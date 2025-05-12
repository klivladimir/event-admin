import axios from 'axios';
import { AuthResponse } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_AUTH;

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse | undefined> {
  try {
    const response = await axios.post<{ token: string }>(`${API_BASE_URL}`, {
      email,
      password,
    });
    const token = response.data.token;
    localStorage.setItem('authToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return response.data;
  } catch (error: unknown) {
    console.error('Error during login:', error);
  }
}
