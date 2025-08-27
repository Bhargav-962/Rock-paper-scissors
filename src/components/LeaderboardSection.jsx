import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import { useGame } from '../context/GameContext';

export default function Leaderboard() {
  const { players } = useGame();
  const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Typography variant="h6">Leaderboard</Typography>
        {sorted.length === 0 && <Typography>No players yet</Typography>}
        {sorted.map((p) => (
          <Typography key={p.id}>{p.username} — {p.score || 0} pts</Typography>
        ))}
      </Stack>
    </Paper>
  );
}
