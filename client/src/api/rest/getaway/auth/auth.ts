import { baseApi } from '@api/config';
import { UserLoginData } from '@types/getaway/auth';

// Makes a POST request to sign in the registered user.
export const login = async (user: UserLoginData) => {
  const response = await baseApi.post('/auth/login', user);

  return response.data;
};

// Makes a GET request to log out the user.
export const logout = async () => {
  const response = await baseApi.get('auth/logout');
  return response.data;
};

// Makes a PUT request to refresh access token because we could have available refresh token
export const refresh = async () => {
  const response = await baseApi.put('auth/refresh');
  return response.data;
};

// Makes a GET request to retrieve the authenticated user’s credentials.
export const getMe = async () => {
  const response = await baseApi.get('user/me');
  return response.data;
};
