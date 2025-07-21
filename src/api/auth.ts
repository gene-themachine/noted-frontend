import axios from 'axios';
import { SERVER_URL } from '../utils/constants';
import { getBearerToken } from '../utils/localStorage';

const authApi = axios.create({ baseURL: SERVER_URL });

// Add request interceptor to automatically attach bearer token
authApi.interceptors.request.use(
  (config) => {
    const token = getBearerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const login = (email: string, password: string) =>
  authApi.post('/auth/login', { email, password });

export const register = (
  email: string,
  password: string,
  username: string,
  firstName: string,
) =>
  authApi.post('/auth/register', {
    email,
    password,
    password_confirmation: password,
    username,
    firstName,
  });

export const logout = () => authApi.post('/auth/logout');

export const getUser = () => authApi.get('/auth/user');
