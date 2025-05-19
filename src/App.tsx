import { Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/Main.page.tsx';
import LoginPage from './pages/Login.page.tsx';
import CreateEventPage from './pages/CreateEvent.page.tsx';
import ProtectedRoute from './pages/ProtectedRoute.tsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/create-event/*" element={<CreateEventPage />} />
      </Route>
    </Routes>
  );
}

export default App;
