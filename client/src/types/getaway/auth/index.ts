export enum GetawayAuthQueryKeys {
  AuthUser = 'authUser',
  RefreshToken = 'refreshToken',
}

export interface User {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  telegramId: number;
  name: string;
}

export interface UserResponse {
  status: string;
  data: {
    user: User;
  };
}

export type UserLoginData = { email: string; password: string };
