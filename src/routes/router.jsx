import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import LobbyPage from '../pages/LobbyPage.jsx';
import { useGame } from '../context/GameContext.jsx';

export default function Router() {
  const { currentPlayer } = useGame();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/lobby" element={currentPlayer ? <LobbyPage /> : <Navigate to="/login" replace />} />
      <Route path="/" element={<Navigate to={currentPlayer ? '/lobby' : '/login'} replace />} />
    </Routes>
  );
}
