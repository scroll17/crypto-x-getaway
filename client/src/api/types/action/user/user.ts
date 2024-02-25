import { TPaginateRequest } from '../../common';

export enum ActionUserQueryKeys {
  UserAll = 'allUsers',
}

export type ActionUserRequestData = TPaginateRequest<object>;

export interface ActionUserEntity {
  _id: string;
  name: string;
  username: string;
  email: string;
  telegramId: number;
  blocked: boolean;
  hasBotAccess: boolean;
  isAdmin: boolean;
  lastActivityAt: string | null;
}
