import React from 'react';
import { Grid, Stack, Typography, Container } from '@mui/material';
import PlayerList from '../components/PlayerList';
import Leaderboard from '../components/LeaderboardSection';
import GameArea from '../components/GameArea';
import InviteDialog from '../components/InviteDialog';
import WaitingList from '../components/WaitingList';
import { useGame } from '../context/GameContext';

export default function LobbyPage() {
  const { currentPlayer } = useGame();

  if (!currentPlayer) return <Typography sx={{ p: 2 }}>Please login first.</Typography>;

  return (
    <Container sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h5">Welcome, {currentPlayer.username}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <PlayerList />
            <WaitingList />
            <Leaderboard />
          </Grid>
          <Grid item xs={12} md={6}>
            <GameArea />
          </Grid>
        </Grid>
        <InviteDialog />
      </Stack>
    </Container>
  );
}
