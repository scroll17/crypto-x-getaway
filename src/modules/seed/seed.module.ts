import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { AdminSeed } from '../../database/seeds/admin.seed';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '@entities/admin';
import { AccessTokenEntity } from '@entities/accessToken';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    CommandModule,
    AuthModule,
    TypeOrmModule.forFeature([AdminEntity, AccessTokenEntity]),
  ],
  providers: [AdminSeed],
})
export class SeedModule {}
