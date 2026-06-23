import apiClient from './apiClient';

export interface SignupPayload {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  signup: (data: SignupPayload) => apiClient.post('account/register', data),
  login: (data: LoginPayload) => apiClient.post('account/login', data),
};
