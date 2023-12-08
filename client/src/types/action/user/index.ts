export enum ActionUserQueryKeys {}

export interface ActionUser {
  _id: string;
  name: string;
  email: string;
  telegramId: number;
  blocked: boolean;
  hasBotAccess: boolean;
  isAdmin: boolean;
  username: string;
}
