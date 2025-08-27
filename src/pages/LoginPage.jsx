import React, { useState } from 'react';
import { Paper, Stack, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { generateId } from '../utils/id';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { players, registerPlayer } = useGame();

  const handleSubmit = (e) => {
    e?.preventDefault();
    const name = username.trim();
    if (!name) return;
    const taken = players.some((p) => p.username.toLowerCase() === name.toLowerCase());
    if (taken) {
      alert('Username already taken in another tab. Choose another one.');
      return;
    }
    const player = { id: generateId(), username: name, score: 0 };
    registerPlayer(player);
    navigate('/lobby');
  };

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: '80vh' }}>
      <Paper sx={{ p: 4, width: 340 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="h5" align="center">Enter Username</Typography>
            <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Button variant="contained" onClick={handleSubmit}>Join Lobby</Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
