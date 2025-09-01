import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import { useGame } from '../context/GameContext';

export default function Leaderboard() {
  const { players, currentPlayerId } = useGame();
  const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  const isCurrentPlayerInGame = (id) => id === currentPlayerId;

  return (
    <Paper sx={{ p: 2, minWidth: '300px' }}>
      <Stack spacing={1}>
        <Typography variant="h6">Leaderboard</Typography>
        {sorted.length === 0 && <Typography>No players yet</Typography>}
        {sorted.map((p) => (
          <Stack key={p.id} direction="row" spacing={1} alignItems="center">
            <Typography 
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '150px',
                flex: 1
              }}
            >
              {p.username}{isCurrentPlayerInGame(p.id) ? ' (You)' : ''}
            </Typography>
            <Typography sx={{ flexShrink: 0 }}>
              — {p.score || 0} pts
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
