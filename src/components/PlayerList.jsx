import React from 'react';
import { Button, Stack, Typography, Chip, Paper } from '@mui/material';
import { useGame } from '../context/GameContext';

export default function PlayerList() {
  const { players, currentPlayer, invitePlayer } = useGame();

  const others = players.filter((p) => p.id !== currentPlayer?.id);

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Players</Typography>
        {others.length === 0 && <Typography>No other players online</Typography>}
        {others.map((p) => (
          <Stack key={p.id} direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography>{p.username}</Typography>
              <Chip label={p.status === 'in-game' ? 'In-Game' : 'Idle'} size="small" color={p.status === 'in-game' ? 'warning' : 'success'} />
            </Stack>
            <Button
              variant="contained"
              size="small"
              onClick={() => invitePlayer(p)}
              disabled={p.status === 'in-game' || !currentPlayer}
            >
              Play
            </Button>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
