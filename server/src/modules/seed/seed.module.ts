import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { AdminSeed, UserSeed } from '../../database/seeds';
import { AuthModule } from '../auth/auth.module';
import {
  AccessTokenRepositoryProvider,
  AdminRepositoryProvider,
  UserRepositoryProvider,
} from '../database/repositories';

const seeds = [AdminSeed, UserSeed];

@Module({
  imports: [CommandModule, AuthModule],
  providers: [AccessTokenRepositoryProvider, AdminRepositoryProvider, UserRepositoryProvider, ...seeds],
})
export class SeedModule {}
