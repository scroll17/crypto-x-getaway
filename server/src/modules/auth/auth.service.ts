/*external modules*/
import _ from 'lodash';
import ms from 'ms';
import * as geoip from 'geoip-lite';
import { Response } from 'express';
import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
/*services*/
import { RedisService } from '../redis/redis.service';
/*@common*/
import { DataGenerateHelper } from '@common/helpers';
import { AuthCookies, RedisUser } from '@common/enums';
/*@entities*/
import { UserEntity, UserModel, UserWentFrom } from '@entities/user';
import { AdminEntity } from '@entities/admin';
import { AccessTokenEntity } from '@entities/accessToken';
import {
  ACCESS_TOKEN_REPOSITORY,
  ADMIN_REPOSITORY,
  TAccessTokenRepository,
  TAdminRepository,
  TUserRepository,
  USER_REPOSITORY,
} from '../database/repositories';
import { LoggedInThirdPartyServiceUserEntity } from './entities/logged-in-third-party-service-user.entity';
/*@interfaces*/
import {
  ICurrentUserData,
  IUserDataInAccessToken,
  IUserDataInThirdPartyService,
  IUserDataInRefreshToken,
} from '@common/interfaces/auth';
/*@dto*/
import { RegisterUserDto } from './dto/register-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private dataGenerateHelper: DataGenerateHelper,
    @InjectDataSource()
    private dataSource: DataSource,
    @Inject(USER_REPOSITORY)
    private userRepository: TUserRepository,
    @Inject(ADMIN_REPOSITORY)
    private adminRepository: TAdminRepository,
    @Inject(ACCESS_TOKEN_REPOSITORY)
    private accessTokenRepository: TAccessTokenRepository,
  ) {}

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const secure = this.configService.getOrThrow<boolean>('security.cookiesOverHttps');

    this.setAccessAuthCookies(res, accessToken);

    res.cookie(AuthCookies.RefreshToken, refreshToken, {
      maxAge: this.getRefreshTokenLiveTime(),
      sameSite: 'none',
      httpOnly: true, // http only, prevents JavaScript cookie access
      secure: secure, // cookie must be sent over https / ssl
    });
  }

  private setAccessAuthCookies(res: Response, accessToken: string) {
    const secure = this.configService.getOrThrow<boolean>('security.cookiesOverHttps');

    res.cookie(AuthCookies.LoggedIn, true, {
      maxAge: this.getAccessTokenLiveTime(),
      sameSite: 'none',
      httpOnly: false, // http only, prevents JavaScript cookie access
      secure: secure, // cookie must be sent over https / ssl
    });

    res.cookie(AuthCookies.AccessToken, accessToken, {
      maxAge: this.getAccessTokenLiveTime(),
      sameSite: 'none',
      httpOnly: true, // http only, prevents JavaScript cookie access
      secure: secure, // cookie must be sent over https / ssl
    });
  }

  public getAccessTokenLiveTime() {
    return ms(this.configService.getOrThrow<string>('jwt.accessExpires'));
  }

  public getRefreshTokenLiveTime() {
    return ms(this.configService.getOrThrow<string>('jwt.refreshExpires'));
  }

  public async generateAuthTokens(
    ip: string,
    user: Pick<UserModel, 'id' | 'email'>,
    isAdmin: boolean,
    queryRunner: QueryRunner | null = null,
  ) {
    const accessTokenLive = this.getAccessTokenLiveTime();
    const refreshTokenLive = this.getRefreshTokenLiveTime();

    const geo = await geoip.lookup(ip);

    const accessToken = this.accessTokenRepository.create({
      logFrom: geo,
      logFromIP: ip,
      userId: isAdmin ? null : user.id,
      adminId: isAdmin ? user.id : null,
      liveTime: accessTokenLive,
      lastUsedAt: new Date(),
      startAliveAt: new Date(),
    });

    queryRunner ? await queryRunner.manager.save(accessToken) : await accessToken.save();

    this.logger.debug(
      'Created new access token',
      _.pick(accessToken, ['id', 'userId', 'logFrom', 'logFromIP', 'liveTime']),
    );

    const accessPayload: IUserDataInAccessToken = {
      id: accessToken.id,
      userId: user.id,
      email: user.email,
    };
    const accessTokenStr = await this.jwtService.signAsync(accessPayload);

    const refreshPayload: IUserDataInRefreshToken = {
      accessId: accessToken.id,
    };
    const refreshTokenStr = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: refreshTokenLive,
      secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
    });

    // TODO: send notification to telegram

    return {
      accessTokenRecord: accessToken,
      accessToken: accessTokenStr,
      refreshToken: refreshTokenStr,
    };
  }

  public async validateUser(email: string, password: string): Promise<ICurrentUserData> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    const admin = await this.adminRepository.findOne({
      where: {
        email,
      },
    });

    if (!user && !admin) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }

    const entity = user ?? admin!;

    const isValidPassword = await entity.comparePassword(password);
    if (!isValidPassword) {
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
    }

    return {
      isAdmin: Boolean(admin),
      info: entity,
    };
  }

  /**
   *  @deprecated
   * */
  public async register(
    dto: RegisterUserDto,
    ip: string,
  ): Promise<{ user: UserModel; accessToken: string; refreshToken: string }> {
    this.logger.debug('Register new user', { user: dto, ip });

    const existingUser = await this.userRepository.findByEmailOrPhone(dto.email, dto.phone);
    if (existingUser) {
      throw new HttpException('User with passed email or phone already exists', HttpStatus.FORBIDDEN);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const user = this.userRepository.create({
        ...dto,
        wentFrom: UserWentFrom.Manual,
        telegramId: '0',
      });
      await user.hashPassword();
      await queryRunner.manager.save(user);

      this.logger.debug('Created new user', _.pick(user, ['id', 'email', 'phone']));

      const { accessToken, refreshToken } = await this.generateAuthTokens(ip, user, false, queryRunner);

      const verifyCode = this.dataGenerateHelper.randomNumber(0, 9, 5);

      const redis = await this.redisService.getDefaultConnection();
      await redis.set(`${RedisUser.VerifyCode}_${user.email}`, verifyCode);

      this.logger.debug('Generated verify token', {
        ..._.pick(user, ['id', 'userId']),
        code: this.configService.get('isDev') ? verifyCode : '#####',
      });

      // TODO: send email

      await queryRunner.commitTransaction();

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public async login(user: ICurrentUserData, ip: string, res: Response) {
    this.logger.debug('Login user', {
      user: _.pick(user.info, ['id', 'email']),
      ip,
    });

    const { accessTokenRecord, accessToken, refreshToken } = await this.generateAuthTokens(ip, user.info, user.isAdmin);
    this.setAuthCookies(res, accessToken, refreshToken);

    return {
      user: user.info.toJSON(),
      accessToken: accessTokenRecord,
    };
  }

  public async thirdPartyLogin(
    thirdPartyAuthUser: IUserDataInThirdPartyService,
    provider: UserWentFrom,
    ip: string,
    res: Response,
  ): Promise<LoggedInThirdPartyServiceUserEntity> {
    if (!thirdPartyAuthUser) throw new HttpException(`${provider} not provided user info`, HttpStatus.NOT_FOUND);

    this.logger.debug(`Login user via "${provider}"`, {
      user: _.pick(thirdPartyAuthUser, ['profileId', 'email', 'name']),
      ip,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: thirdPartyAuthUser.email,
        },
      });
      if (!user) {
        this.logger.error(`User not found by "${provider}" email.`);
        throw new HttpException('User not found by "${provider}" email.', HttpStatus.NOT_FOUND);

        // const user = this.userRepository.create({
        //   firstName: thirdPartyAuthUser.name.givenName,
        //   lastName: thirdPartyAuthUser.name.familyName,
        //   email: thirdPartyAuthUser.email,
        //   verified: thirdPartyAuthUser.verified,
        //   wentFrom: provider,
        //   googleId: thirdPartyAuthUser.profileId,
        //   telegramId: '0',
        // });
        // await queryRunner.manager.save(user);
        //
        // this.logger.debug('Created new user', _.pick(user, ['id', 'email', 'phone']));
        //
        // const { accessToken, refreshToken } = await this.generateAuthTokens(ip, user, false, queryRunner);
        //
        // await queryRunner.commitTransaction();
        //
        // return {
        //   user,
        //   accessToken,
        //   refreshToken,
        //   new: true,
        // };
      }

      switch (provider) {
        case UserWentFrom.Google: {
          if (!user.googleId) {
            this.logger.debug('User doesnt have "googleId". Update record', {
              user: _.pick(thirdPartyAuthUser, ['profileId', 'email']),
            });

            user.googleId = thirdPartyAuthUser.profileId;
            await queryRunner.manager.save(user);
          }

          if (user.googleId !== thirdPartyAuthUser.profileId) {
            throw new HttpException(
              'You cant has multiple IDs from Google provider by one email.',
              HttpStatus.BAD_REQUEST,
            );
          }

          break;
        }
        case UserWentFrom.Facebook: {
          if (!user.facebookId) {
            this.logger.debug('User doesnt have "facebookId". Update record', {
              user: _.pick(thirdPartyAuthUser, ['profileId', 'email']),
            });

            user.facebookId = thirdPartyAuthUser.profileId;
            await queryRunner.manager.save(user);
          }

          if (user.facebookId !== thirdPartyAuthUser.profileId) {
            throw new HttpException(
              'You cant has multiple IDs from Facebook provider by one email.',
              HttpStatus.BAD_REQUEST,
            );
          }

          break;
        }
        default: {
          throw new HttpException(`Invalid provider - "${provider}"`, HttpStatus.BAD_REQUEST);
        }
      }

      this.logger.debug(`User logged in by "${provider}"`, _.pick(user, ['id', 'email']));

      const { accessTokenRecord, accessToken, refreshToken } = await this.generateAuthTokens(
        ip,
        user,
        false,
        queryRunner,
      );
      this.setAuthCookies(res, accessToken, refreshToken);

      await queryRunner.commitTransaction();

      return {
        user: user.toJSON(),
        accessToken: accessTokenRecord,
        new: false,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *  @deprecated
   * */
  public async checkVerificationCode(user: ICurrentUserData, code: number) {
    this.logger.debug('Verify user email', {
      user: _.pick(user.info, ['id', 'email']),
    });

    if (user.isAdmin) {
      throw new HttpException('Admin cant verify email', HttpStatus.BAD_REQUEST);
    }

    const userEntity = user.info as UserEntity;
    if (userEntity.verified) {
      throw new HttpException('You account already verified.', HttpStatus.FORBIDDEN);
    }

    const redis = this.redisService.getDefaultConnection();

    const verificationCode = await redis.get(`${RedisUser.VerifyCode}_${user.info.email}`);
    if (!verificationCode) {
      throw new HttpException('Verification code not found. Please resend verify code', HttpStatus.NOT_FOUND);
    }

    if (Number.parseInt(verificationCode, 10) !== code) {
      throw new HttpException('Invalid verification code', HttpStatus.BAD_REQUEST);
    }

    await redis.del(`${RedisUser.VerifyCode}_${user.info.email}`);

    userEntity.verified = true;
    await userEntity.save();

    return userEntity.toJSON();
  }

  /**
   *  @deprecated
   * */
  public async resendVerificationCode(user: ICurrentUserData) {
    this.logger.debug('Resend verify user email', {
      user: _.pick(user.info, ['id', 'email']),
    });

    if (user.isAdmin) {
      throw new HttpException('Admin cant resend verify email', HttpStatus.BAD_REQUEST);
    }

    const userEntity = user.info as UserEntity;
    if (userEntity.verified) {
      throw new HttpException('You account already verified.', HttpStatus.FORBIDDEN);
    }

    const verifyCode = this.dataGenerateHelper.randomNumber(0, 9, 5);

    const redis = await this.redisService.getDefaultConnection();
    await redis.set(`${RedisUser.VerifyCode}_${userEntity.email}`, verifyCode);

    this.logger.debug('Request for resend verification email', {
      user: _.pick(user, ['id', 'email']),
      code: this.configService.get('isDev') ? verifyCode : '#####',
    });

    // TODO: send email

    return true;
  }

  public async getTokensList(user: ICurrentUserData['info']) {
    this.logger.debug('Get user / admin tokens', {
      user: _.pick(user, ['id', 'email']),
    });

    const accessTokens = await this.accessTokenRepository.findByEntity(user.id);

    this.logger.debug('Tokens found', {
      count: accessTokens.length,
    });

    return accessTokens;
  }

  public async revokeToken(user: ICurrentUserData, tokenId: number) {
    this.logger.debug('Revoke access token', {
      tokenId,
      user: _.pick(user, ['id', 'email']),
    });

    const accessToken = await this.accessTokenRepository.findByIdAndEntity(tokenId, user.info.id, user.isAdmin);
    if (!accessToken) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }

    await accessToken!.remove();

    return true;
  }

  public async refresh(refreshToken: string, res: Response) {
    const refreshTokenPayload: IUserDataInRefreshToken = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
    });
    if (!refreshTokenPayload) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    this.logger.debug('Refresh access token', {
      token: refreshTokenPayload,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const accessToken = await queryRunner.manager.findOne(AccessTokenEntity, {
        where: {
          id: refreshTokenPayload.accessId,
        },
        loadRelationIds: true,
      });
      if (!accessToken) {
        throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
      }

      const result = await queryRunner.manager.update(
        AccessTokenEntity,
        {
          id: refreshTokenPayload.accessId,
        },
        {
          startAliveAt: new Date(),
        },
      );
      if (!result) {
        throw new HttpException('Token not updated', HttpStatus.BAD_REQUEST);
      }

      this.logger.debug(
        'Refreshed access token',
        _.pick(accessToken, ['id', 'userId', 'logFrom', 'logFromIP', 'liveTime']),
      );

      let entity: UserEntity | AdminEntity;
      if (accessToken.userId) {
        const user = await queryRunner.manager.findOne(UserEntity, {
          where: {
            id: accessToken.userId,
          },
        });
        if (!user) throw new NotFoundException('User not found');

        entity = user;
      } else {
        const admin = await queryRunner.manager.findOne(AdminEntity, {
          where: {
            id: accessToken.adminId!,
          },
        });
        if (!admin) throw new NotFoundException('Admin not found');

        entity = admin;
      }

      const accessPayload: IUserDataInAccessToken = {
        id: accessToken.id,
        userId: entity.id,
        email: entity.email,
      };
      const accessTokenStr = await this.jwtService.signAsync(accessPayload);

      this.setAccessAuthCookies(res, accessTokenStr);

      await queryRunner.commitTransaction();

      return accessToken;
    } catch (error) {
      // TODO: jws error handling
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public async logout(user: ICurrentUserData['info'], accessTokenStr: string) {
    this.logger.debug('Logout user', {
      user: _.pick(user, ['id', 'email']),
    });

    const accessTokenPayload: IUserDataInAccessToken = await this.jwtService.verifyAsync(accessTokenStr);
    if (!accessTokenPayload) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    this.logger.debug('Access token payload', {
      token: accessTokenPayload,
    });

    const result = await this.accessTokenRepository.delete({
      id: accessTokenPayload.id,
    });

    return Boolean(result.affected);
  }

  public async initPasswordReset(email: string) {
    this.logger.debug('Init password reset by user email', {
      email,
    });

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    const admin = await this.adminRepository.findOne({
      where: {
        email,
      },
    });

    if (!user && !admin) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }

    const linkLiveTime = this.configService.getOrThrow('bll.resetPasswordLinkLive');
    const verifyCode = this.dataGenerateHelper.randomHEX(12);

    const redis = await this.redisService.getDefaultConnection();
    await redis.set(`${RedisUser.ResetCode}_${email}`, verifyCode, 'PX', linkLiveTime);

    this.logger.debug('Request for send reset password email', {
      user: email,
      code: this.configService.get('isDev') ? verifyCode : '#####',
    });

    // TODO: send email with link to client host + code + email

    return true;
  }

  public async resetPassword(dto: ResetPasswordDto) {
    this.logger.debug('Reset password by user email', {
      data: _.omit(dto, ['password']),
    });

    const redis = await this.redisService.getDefaultConnection();

    const verificationCode = await redis.get(`${RedisUser.ResetCode}_${dto.email}`);
    if (!verificationCode) {
      throw new HttpException('Reset code not found. Please try again', HttpStatus.NOT_FOUND);
    }

    if (verificationCode !== dto.code) {
      throw new HttpException('Invalid reset code', HttpStatus.BAD_REQUEST);
    }

    await redis.del(`${RedisUser.ResetCode}_${dto.email}`);

    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    const admin = await this.adminRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user && !admin) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }

    const entity = user ?? admin!;

    entity.password = dto.password;
    await entity.hashPassword();
    await entity.save();

    return true;
  }
}
