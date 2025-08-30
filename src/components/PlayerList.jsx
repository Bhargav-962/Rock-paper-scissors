import React from 'react';
import { Button, Stack, Typography, Chip, Paper } from '@mui/material';
import { useGame } from '../context/GameContext';
import { PLAYER_STATUS, PLAYER_STATUS_LABELS } from '../constants';

export default function PlayerList() {
  const { players, currentPlayer, invitePlayer, sentInvitations } = useGame();

  const others = players.filter((p) => p.id !== currentPlayer?.id);

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Players</Typography>
        {others.length === 0 && <Typography>No other players online</Typography>}
        {others.map((p) => {
          const isInvitationSent = sentInvitations.has(p.id);
          const isPlayerBusy = p.status === PLAYER_STATUS.IN_GAME;
          const isDisabled = isPlayerBusy || !currentPlayer || isInvitationSent;
          
          return (
            <Stack key={p.id} direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography>{p.username}</Typography>
                <Chip 
                  label={PLAYER_STATUS_LABELS[p.status]} 
                  size="small" 
                  color={p.status === PLAYER_STATUS.IN_GAME ? 'warning' : 'success'} 
                />
              </Stack>
              <Button
                variant="contained"
                size="small"
                onClick={() => invitePlayer(p)}
                disabled={isDisabled}
                color={isInvitationSent ? 'secondary' : 'primary'}
              >
                {isInvitationSent ? 'Invitation Sent' : 'Play'}
              </Button>
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
}
