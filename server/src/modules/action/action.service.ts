import crypto from 'node:crypto';
import ms from 'ms';
import Redis from 'ioredis';
import { AxiosError, AxiosRequestConfig, AxiosHeaders, AxiosResponse } from 'axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { DataGenerateHelper } from '@common/helpers';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@entities/user';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { IClientMetadata, IDataInActionToken } from '@common/types';

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

  private async buildRequestOptions(user: UserEntity, req: Request) {
    if (!this.actionServerUrl) {
      throw new HttpException('You have to set Server URL before', HttpStatus.FORBIDDEN);
    }

    const clientMetadata = this.buildClientMetadata(req);
    const signature = await this.buildRequestSignature(req);
    const userSecretToken = await this.buildUserReqSecretToken(user);

    const headers = new AxiosHeaders();
    headers.set(clientMetadata.header, clientMetadata.metadata);
    headers.set(signature.header, signature.value);
    headers.set(userSecretToken.header, userSecretToken.token);

    const config: AxiosRequestConfig = {
      url: req.path.replace('/action', ''),
      method: req.method,
      baseURL: this.actionServerUrl,
      headers: headers,
      params: req.query,
      data: req.body,
      responseType: 'json',
      responseEncoding: 'utf8',
      maxContentLength: Number.POSITIVE_INFINITY,
      maxBodyLength: Number.POSITIVE_INFINITY,
    };
    this.logger.verbose('Request config for Action server', config);

    return config;
  }

  private buildClientMetadata(req: Request) {
    const header = 'x-client-metadata';
    const metadata: IClientMetadata = {
      hostname: req.hostname,
      ip: req.ip,
      ips: req.ips,
      protocol: req.protocol,
      subDomains: req.subdomains,
    };

    return {
      header,
      metadata: JSON.stringify(metadata),
    };
  }

  public async buildUserReqSecretToken(user: UserEntity) {
    const header = this.configService.getOrThrow<string>('action.userSecurityTokenHeader');
    const { token } = await this.getSecretToken(user);

    return {
      header,
      token,
    };
  }

  private async buildRequestSignature(req: Request) {
    const secret = this.configService.getOrThrow<string>('action.signatureSecret');
    const header = this.configService.getOrThrow<string>('action.signatureHeader');

    const timestamp = Math.floor(Date.now() / 1000);
    const body = JSON.stringify(req.body);
    const query = JSON.stringify(req.query);

    const signature = crypto.createHmac('sha256', secret).update(`${timestamp}.${body}.${query}`, 'utf8').digest('hex');

    return {
      header,
      value: `t=${timestamp},s=${signature}`,
    };
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
        telegramId: user.telegramId,
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
    const request = async () => {
      const config = await this.buildRequestOptions(user, req);
      const { data } = await this.httpService.axiosRef.request(config);

      return data;
    };

    try {
      return await request();
    } catch (error) {
      this.logger.error(
        'Request to Action server error:',
        error instanceof AxiosError ? { ...error.toJSON(), config: '<hidden>' } : error,
      );

      if (error instanceof AxiosError) {
        const response = error.response as AxiosResponse<{ message: string; statusCode: number }>;
        if (response) {
          // TODO: repeat request
        }

        throw new HttpException(
          {
            source: error.name,
            details:
              response && response.data
                ? response.data
                : {
                    message: error.message,
                    code: error.code,
                  },
          },
          error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (error instanceof Error) {
        throw new HttpException(
          {
            source: error.name,
            details: {
              message: error.message,
              stack: error.stack,
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw error;
    }
  }
}
