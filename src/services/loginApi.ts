import { apiClient } from './apiClient';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const registerUser = async (data: User) => {
  const response = await apiClient.post('/users', data);
  return response.data;
};

export const getUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const loginUser = async (credentials: LoginCredentials) => {
  const response = await apiClient.post('/auth', credentials);
  return response.data;
};
