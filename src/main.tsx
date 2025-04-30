import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#65558F',
    },
    info: {
      main: '#E8DEF8',
      contrastText: 'black',
    },
  },
  cssVariables: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <App />
          </LocalizationProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);
