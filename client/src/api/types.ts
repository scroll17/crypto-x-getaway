export enum QUERY_KEYS {
  AuthUser = 'authUser',
}

export interface User {
  name: string;
  email: string;
  role: string;
  _id: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
