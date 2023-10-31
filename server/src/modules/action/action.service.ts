import ms from 'ms';
import Redis from 'ioredis';
import { AxiosError } from 'axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { DataGenerateHelper } from '@common/helpers';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@entities/user';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { IDataInActionToken } from '@common/types';

@Injectable()
export class ActionService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly redis: Redis;

  private actionServerUrl: string | null = null;
  public readonly userSecrets = new Map<number, string>();
  public readonly userTokens = new Map<number, string>();

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
    private readonly dataGenerateHelper: DataGenerateHelper,
  ) {
    this.redis = this.redisService.getDefaultConnection();
    this.actionServerUrl = this.configService.get<string>('action.serverDefaultUrl') ?? null;
  }

  public async setActionServerUrl(url: string) {
    this.actionServerUrl = url;
  }

  public generateSecret(userId: number, force = false) {
    let secret = this.userSecrets.get(userId);
    if (secret && !force) return secret;

    secret = this.dataGenerateHelper.randomHEX(16);
    this.userSecrets.set(userId, secret);

    return secret;
  }

  public async generateSecretToken(user: Pick<UserEntity, 'id' | 'email' | 'telegramId'>, force: boolean) {
    const expireAt = this.configService.getOrThrow<string>('action.userSecurityTokenExpires');
    const tokenLiveTime = Math.floor(ms(expireAt) / 1000);

    const secret = this.generateSecret(user.id, force);

    this.logger.debug('Generate new secret token', {
      liveTime: tokenLiveTime,
      data: {
        id: user.id,
        email: user.email,
        telegramId: user.telegramId
      },
    });

    const tokenPayload: IDataInActionToken = {
      secret,
      userId: user.id,
      telegramId: user.telegramId,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(tokenPayload);

    this.userTokens.set(user.id, token);

    return {
      secret,
      token,
    };
  }

  public async getSecretToken(user: Pick<UserEntity, 'id' | 'email' | 'telegramId'>) {
    const savedToken = this.userTokens.get(user.id);
    if (!savedToken) {
      return await this.generateSecretToken(user, true);
    }

    const { payload } = this.jwtService.decode(savedToken, { complete: true }) as {
      payload: IDataInActionToken & {
        iat: number;
        exp: number;
      };
    };
    if (Date.now() / 1000 + 30 >= payload.exp) {
      // Note: if token will be alive only 30s then recreate it
      return await this.generateSecretToken(user, true);
    }

    const secret = this.userSecrets.get(user.id);
    return {
      token: savedToken,
      secret: secret!,
    };
  }

  public async transmit(user: UserEntity, req: Request, res: Response) {
    if (!this.actionServerUrl) {
      throw new HttpException('You have to set Server URL before', HttpStatus.FORBIDDEN);
    }

    const request = () => {
      const path = '';
    };

    try {
      // TODO: refresh token if it expired
    } catch (error) {
      this.logger.error('Request to Action server error:', error);

      if (error instanceof AxiosError) {
        const response = error.response;
        if (res) {
          // TODO: repeat request
        }
      }

      throw error;
    }
  }
}
