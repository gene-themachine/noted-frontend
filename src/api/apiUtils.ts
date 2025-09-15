import axios from 'axios';
import { SERVER_URL } from '../utils/constants';
import { getBearerToken } from '../utils/localStorage';
import '../lib/authToken' // initializes Supabase auth listener to keep token fresh

export const api = axios.create({
  baseURL: SERVER_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getBearerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const handleResponse = (response: { data: any; }) => {
  return response.data;
};

export const handleError = (error: { response: { data: { message: any; }; }; message: any; }) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error:', error.response.data);
    throw new Error(error.response.data.message || 'An error occurred');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error:', error.message);
    throw new Error(error.message || 'An error occurred');
  }
}; 
