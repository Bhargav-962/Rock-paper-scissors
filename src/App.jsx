import { Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import LoginPage from './pages/LoginPage';
import LobbyPage from './pages/LobbyPage';

function ProtectedRoute({ children }) {
  const { currentPlayerId } = useGame();

  if (!currentPlayerId) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <GameProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/lobby"
            element={
              <ProtectedRoute>
                <LobbyPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </GameProvider>
  );
}
