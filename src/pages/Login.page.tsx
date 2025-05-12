import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { loginUser } from '../api/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const data = await loginUser(email, password);
      console.log('Login successful:', data);
      // TODO: store token, redirect, etc.
    } catch (error: unknown) {
      let message = 'Login failed';
      if (error instanceof Error) {
        message = error.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Авторизация</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <TextField
            required
            id="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ autoComplete: 'username' }}
            disabled={isLoading}
          />
          <TextField
            required
            id="password"
            label="Пароль"
            type="password"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ autoComplete: 'current-password' }}
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="!rounded-full min-h-[40px]"
            disabled={isLoading}
          >
            <span className="normal-case">{isLoading ? 'Вход...' : 'Войти'}</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
