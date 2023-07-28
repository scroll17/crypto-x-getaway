import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {RedisService} from "../redis/redis.service";
import {DataGenerateHelper} from "@common/helpers";
import {RedisProtection} from "@common/enums";

@Injectable()
export class ProtectionService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
    private dataGenerateHelper: DataGenerateHelper,
  ) {}

  public async generateSecurityToken() {
    const token = this.dataGenerateHelper.randomHEX(16);

    const redis = await this.redisService.getDefaultConnection();
    await redis.set(RedisProtection.SecurityToken, token);

    return token;
  }

  public async validateSecurityToken(token: string) {
    const redis = await this.redisService.getDefaultConnection();

    const localToken = await redis.get(RedisProtection.SecurityToken);
    if(!localToken) {
      return {
        valid: false,
        error: new HttpException('Local Token does not exist yet', HttpStatus.BAD_REQUEST)
      }
    }

    if(token !== localToken) {
      return {
        valid: false,
        error: new HttpException('Passed Token is invalid', HttpStatus.BAD_REQUEST)
      }
    }

    return {
      valid: true,
      error: null
    }
  }

  public async getSecurityToken() {
    const redis = await this.redisService.getDefaultConnection();
    return redis.get(RedisProtection.SecurityToken);
  }
}
