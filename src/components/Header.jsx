import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { useGame } from '../context/GameContext';

export default function Header() {
  const { currentPlayer } = useGame();

  return (
    <AppBar position="static">
      <Toolbar>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
          <Typography variant="h6">RPS — Multiplayer</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button component={RouterLink} to="/lobby" color="inherit">Lobby</Button>
            {currentPlayer ? <Typography sx={{ ml: 2 }}>{currentPlayer.username}</Typography> : <Button component={RouterLink} to="/login" color="inherit">Login</Button>}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
