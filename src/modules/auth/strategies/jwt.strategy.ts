/*external modules*/
import _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
/*@interfaces*/
import {
  ICurrentUserData,
  IUserDataInAccessToken,
} from '@common/interfaces/auth';
/*@entities*/
import { UserEntity } from '@entities/user';
import { AdminEntity } from '@entities/admin';
import { AccessTokenEntity } from '@entities/accessToken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(AdminEntity)
    private adminsRepository: Repository<AdminEntity>,
    @InjectRepository(AccessTokenEntity)
    private accessTokenRepository: Repository<AccessTokenEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.accessSecret'),
    });
  }

  async validate(payload: IUserDataInAccessToken): Promise<ICurrentUserData> {
    const token = await this.accessTokenRepository.findOne({
      where: {
        id: payload.id,
      },
      loadRelationIds: true,
    });
    if (!token) {
      throw new HttpException('Token is revoked', HttpStatus.FORBIDDEN);
    }

    this.logger.debug('Token found', { token });

    let entity: UserEntity | AdminEntity;
    if (token.userId) {
      const user = await this.usersRepository.findOne({
        where: {
          id: token.userId,
        },
      });
      if (!user) throw new NotFoundException('User not found');

      entity = user;
    } else {
      const admin = await this.adminsRepository.findOne({
        where: {
          id: token.adminId!,
        },
      });
      if (!admin) throw new NotFoundException('Admin not found');

      entity = admin;
    }

    this.logger.debug('Found user / admin by token:', {
      entity: _.pick(entity, ['id', 'email']),
      isAdmin: Boolean(token.adminId),
    });

    await this.accessTokenRepository.update(
      {
        id: token.id,
      },
      {
        lastUsedAt: new Date(),
      },
    );
    this.logger.debug('Updated last token activity');

    return {
      isAdmin: Boolean(token.adminId),
      info: entity,
    };
  }
}
