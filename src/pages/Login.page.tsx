import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data) {
        localStorage.setItem('userEmail', email);
        navigate('/');
      } else {
        setError('Login failed');
      }
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
    <div className="flex flex-col  min-h-screen gap-[48px] p-[12px] md:p-[40px] w-full md:w-[505px]">
      <span className="text-[28px] font-bold">BeHub</span>
      <form onSubmit={handleSubmit} className="flex flex-col gap-[48px]">
        <TextField
          required
          id="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={e => setEmail(e.target.value)}
          InputLabelProps={{ shrink: true }}
          disabled={isLoading}
          inputProps={{ autoComplete: 'off' }}
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
          sx={{
            width: '89px',
            alignSelf: 'flex-end',
          }}
        >
          <span className="normal-case">{isLoading ? 'Вход...' : 'Войти'}</span>
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
