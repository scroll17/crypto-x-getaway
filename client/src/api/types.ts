export enum QUERY_KEYS {
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

export interface GenericResponse {
  status: string;
  message: string;
}

export interface UserResponse {
  status: string;
  data: {
    user: User;
  };
}
export type UserLoginData = { email: string; password: string };

export type AxiosErrorData = {
  statusCode: number;
  message: string;
  details: Record<string, unknown>;
};
// this file need to refactor
export interface userTableResponseItem {
  _id: string;
  name: string;
  email: string;
  telegramId: number;
  blocked: boolean;
  hasBotAccess: boolean;
  isAdmin: boolean;
  username: string;
}
