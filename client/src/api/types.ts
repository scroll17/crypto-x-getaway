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
