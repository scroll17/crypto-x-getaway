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

export interface AuthRefresh {
  access_token: string;
}

export interface UserResponse {
  status: string;
  data: {
    user: User;
  };
}
