import { UserEntity } from '@entities/user';

export type TUserSeed = Pick<
  UserEntity,
  'firstName' | 'lastName' | 'email' | 'password' | 'verified' | 'hasBotAccess' | 'telegramId'
>;
