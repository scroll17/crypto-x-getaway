import { UserEntity } from '@entities/user';
import { AdminEntity } from '@entities/admin';
import { AccessTokenEntity } from '@entities/accessToken';

export interface ICurrentUserData {
  isAdmin: boolean;
  info: UserEntity | AdminEntity;
  // Note: available everywhere omit LocalAuth strategy
  token?: AccessTokenEntity;
}
