import { LoginResponse } from '../types';
import { ajax } from 'rxjs/ajax';
import { firstValueFrom, catchError } from 'rxjs';
import { handleAuthError } from './errorHandler';

export const API_BASE_URL = import.meta.env.VITE_API_AUTH;

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse | undefined> {
  try {
    const source = ajax<LoginResponse>({
      url: `${API_BASE_URL}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email,
        password,
      },
    }).pipe(
      catchError(error => {
        console.error('Error during login:', error);
        return handleAuthError(error);
      })
    );

    const response = await firstValueFrom(source);
    const token = response.response.token;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);

    return response.response;
  } catch (error: unknown) {
    console.error('Error during login:', error);
  }
}
