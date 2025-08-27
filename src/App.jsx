import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import LoginPage from './pages/LoginPage';
import LobbyPage from './pages/LobbyPage';

function ProtectedRoute({ children }) {
  const { currentPlayer } = useGame();
  if (!currentPlayer) {
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
