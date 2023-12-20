import { TPaginateRequest, IActionFilter } from '../common';

export enum User {
  UserAll = 'allUsers',
}

export type ActionUserRequestData = TPaginateRequest<IActionFilter>;

export interface ActionUser {
  _id: string;
  name: string;
  email: string;
  telegramId: number;
  blocked: boolean;
  hasBotAccess: boolean;
  isAdmin: boolean;
  username: string;
  lastActivityAt: string;
}
