import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { DataGenerateHelper } from '@common/helpers';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ActionService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private dataGenerateHelper: DataGenerateHelper,
  ) {}
}
