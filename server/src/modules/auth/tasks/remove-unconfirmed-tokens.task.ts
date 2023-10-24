import { Inject, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ACCESS_TOKEN_REPOSITORY, TAccessTokenRepository } from '../../database/repositories';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@Injectable()
export class RemoveUnconfirmedTokensTask {
  private readonly logger = new Logger(this.constructor.name);

  private readonly loginConfirmationExpires: number;

  constructor(
    private configService: ConfigService,
    @Inject(ACCESS_TOKEN_REPOSITORY)
    private accessTokenRepository: TAccessTokenRepository,
  ) {
    this.loginConfirmationExpires = this.configService.getOrThrow<number>('security.loginConfirmationExpires');
  }

  @Interval('remove-unconfirmed-tokens', ms('5s'))
  public async removeTokens() {
    this.logger.debug('Remove expired unconfirmed Access Tokens', { expireTime: this.loginConfirmationExpires });

    const removeResult = await this.accessTokenRepository.removeUnconfirmed(
      Math.floor(this.loginConfirmationExpires / 1000),
    );

    this.logger.verbose('Removed unconfirmed Access Tokens', {
      count: removeResult.affected,
    });
  }
}
