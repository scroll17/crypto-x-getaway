import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NgrokService } from '../../../ngrok/ngrok.service';
import { ProtectionService } from '../../../protection/protection.service';
import { MarkdownHelper } from '@common/telegram/helpers';
import {
  ACCESS_TOKEN_REPOSITORY,
  TAccessTokenRepository,
  TUserRepository,
  USER_REPOSITORY,
} from '../../../database/repositories';
import { TelegrafException } from 'nestjs-telegraf';
import { RedisUser } from '@common/enums';
import { RedisService } from '../../../redis/redis.service';
import Redis from 'ioredis';

@Injectable()
export class CryptoXBotService {
  private readonly logger = new Logger(this.constructor.name);

  private redis: Redis;
  private lastSecurityToken: string | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly ngrokService: NgrokService,
    private readonly protectionService: ProtectionService,
    private readonly markdownHelper: MarkdownHelper,
    private readonly redisService: RedisService,
    @Inject(USER_REPOSITORY)
    private userRepository: TUserRepository,
    @Inject(ACCESS_TOKEN_REPOSITORY)
    private accessTokenRepository: TAccessTokenRepository,
  ) {
    this.redis = this.redisService.getDefaultConnection();
  }

  private async getUserByTelegramId(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        telegramId: id,
      },
    });
    if (!user) {
      throw new TelegrafException('User not found');
    }

    return user;
  }

  private async getAccessToken(telegramUserId: number, tokenId: number) {
    const user = await this.getUserByTelegramId(telegramUserId);

    const token = await this.redis.get(`${RedisUser.LoginConfirmation}:${user.email}`);
    if (!token) {
      throw new TelegrafException('Token has expired');
    }

    if (Number.parseInt(token) !== tokenId) {
      throw new TelegrafException('Token is invalid');
    }

    const accessToken = await this.accessTokenRepository.findByIdAndEntity(tokenId, user.id, false);
    if (!accessToken) {
      throw new TelegrafException('Token not found');
    }

    return accessToken;
  }

  public async getSecurityToken(telegramUserId: number) {
    if (this.lastSecurityToken) {
      this.logger.debug('Return old security token');

      const tokenMsg = this.markdownHelper.bold('Token');
      const tokenText = this.markdownHelper.monospaced(this.lastSecurityToken);

      return `${tokenMsg}: ${tokenText}`;
    }

    const newSecurityToken = await this.protectionService.generateSecurityToken(telegramUserId);
    this.lastSecurityToken = newSecurityToken;

    const tokenMsg = this.markdownHelper.bold('Token');
    const tokenText = this.markdownHelper.monospaced(newSecurityToken);

    return `${tokenMsg}: ${tokenText}`;
  }

  public async refreshSecurityToken(telegramUserId: number) {
    this.logger.debug('Refresh security token');

    const newSecurityToken = await this.protectionService.generateSecurityToken(telegramUserId);

    const tokenMsg = this.markdownHelper.bold('Token');
    const tokenText = this.markdownHelper.monospaced(newSecurityToken);

    return `${tokenMsg}: ${tokenText}`;
  }

  public async approveAccessToken(telegramUserId: number, data: string) {
    this.logger.debug('Approve access token', { telegramUserId, data });

    const tokenId = Number.parseInt(data.split(':')[1]);
    const accessToken = await this.getAccessToken(telegramUserId, tokenId);

    accessToken.confirmed = true;
    await accessToken.save();

    this.logger.debug('Access token confirmed');
  }

  public async disapproveAccessToken(telegramUserId: number, data: string) {
    this.logger.debug('Disapprove access token', { telegramUserId, data });

    const tokenId = Number.parseInt(data.split(':')[1]);
    const accessToken = await this.getAccessToken(telegramUserId, tokenId);

    await accessToken.remove();

    this.logger.debug('Access token removed');
  }
}
