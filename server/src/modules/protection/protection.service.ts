import ms from 'ms';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { DataGenerateHelper } from '@common/helpers';
import { RedisProtection } from '@common/enums';
import { JwtService } from '@nestjs/jwt';
import { IDataInSecurityToken } from '@common/interfaces/protection';

@Injectable()
export class ProtectionService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private dataGenerateHelper: DataGenerateHelper,
  ) {}

  public async generateSecurityToken(telegramId: number) {
    const securityTokenLiveTime = Math.floor(
      ms(this.configService.getOrThrow<string>('protection.securityTokenExpires')) / 1000,
    );
    const tokenStr = this.dataGenerateHelper.randomHEX(16);

    this.logger.debug('Generate new security token', {
      liveTime: securityTokenLiveTime,
      userId: telegramId,
    });

    const redis = await this.redisService.getDefaultConnection();
    await redis.setex(RedisProtection.SecurityToken, securityTokenLiveTime, tokenStr);

    const securityTokenPayload: IDataInSecurityToken = {
      token: tokenStr,
      userId: telegramId,
    };
    const securityTokenTokenStr = await this.jwtService.signAsync(securityTokenPayload);

    return securityTokenTokenStr;
  }

  public async validateSecurityToken(token: string) {
    this.logger.debug('Validate security token', {
      token,
    });

    try {
      const securityToken = await this.jwtService.verifyAsync<IDataInSecurityToken>(token);
      if (!securityToken) {
        return {
          valid: false,
          error: new HttpException('Token is invalid', HttpStatus.BAD_REQUEST),
        };
      }

      this.logger.debug('Security token data', {
        data: securityToken,
      });

      const localToken = await this.getLocalSecurityToken();
      if (!localToken) {
        return {
          valid: false,
          error: new HttpException('Local Token does not exist yet or has already expired', HttpStatus.BAD_REQUEST),
        };
      }

      if (securityToken.token !== localToken) {
        return {
          valid: false,
          error: new HttpException('Passed Token is wrong', HttpStatus.FORBIDDEN),
        };
      }

      return {
        valid: true,
        error: null,
      };
    } catch (error) {
      return {
        valid: false,
        error: new HttpException('Token malformed or expired', HttpStatus.BAD_REQUEST),
      };
    }
  }

  public async getLocalSecurityToken() {
    const redis = await this.redisService.getDefaultConnection();
    return redis.get(RedisProtection.SecurityToken);
  }
}
