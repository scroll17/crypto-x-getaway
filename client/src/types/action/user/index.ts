export enum User {
  UserAll = 'allUsers',
}

export interface ActionUserRequest {
  paginate: {
    page: number;
    count: number;
  };
  sort: {
    name: string;
    type: 'asc';
  };
  filter?: {
    id: string;
    name: string;
  };
}

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
