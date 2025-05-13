import axios from 'axios';
import { LoginResponse } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_AUTH;

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse | undefined> {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}`, {
      email,
      password,
    });
    const token = response.data.token;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return response.data;
  } catch (error: unknown) {
    console.error('Error during login:', error);
  }
}
