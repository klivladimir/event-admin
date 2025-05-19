import { AjaxError } from 'rxjs/ajax';
import { throwError } from 'rxjs';

export function handleAuthError(err: AjaxError | Error) {
  if (err instanceof AjaxError && err.status === 401) {
    console.error('Authentication error: 401. Redirecting to login...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentEventId');
    window.location.href = '/login';
  }
  return throwError(() => err);
}
