import { Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/Main.page.tsx';
import CreateEventPage from './pages/CreateEvent.page.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/create-event/*" element={<CreateEventPage />} />
    </Routes>
  );
}

export default App;
