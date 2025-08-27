import React from 'react';
import { 
  Grid, 
  Stack, 
  Typography, 
  Container, 
  Paper,
  Box,
  Fade
} from '@mui/material';
import { SportsEsports as GameIcon } from '@mui/icons-material';
import PlayerList from '../components/PlayerList';
import Leaderboard from '../components/LeaderboardSection';
import GameArea from '../components/GameArea';
import InviteDialog from '../components/InviteDialog';
import WaitingList from '../components/WaitingList';
import { useGame } from '../context/GameContext';

export default function LobbyPage() {
  const { currentPlayer } = useGame();

  if (!currentPlayer) return (
    <Container sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h6" color="error">
        Please login first.
      </Typography>
    </Container>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3, minHeight: '100vh' }}>
      <Fade in timeout={600}>
        <Box>
          {/* Header */}
          <Paper sx={{ 
            p: 3, 
            mb: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3
          }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <GameIcon sx={{ fontSize: 40 }} />
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  Welcome, {currentPlayer.username}!
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Ready to challenge some players?
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Main Content */}
          <Grid container spacing={4}>
            <Grid item xs={12} lg={6}>
              <Stack spacing={3}>
                <Paper sx={{ 
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                  <PlayerList />
                </Paper>
                <Paper sx={{ 
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                  <WaitingList />
                </Paper>
                <Paper sx={{ 
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                  <Leaderboard />
                </Paper>
              </Stack>
            </Grid>
            <Grid item xs={12} lg={6}>
              <GameArea />
            </Grid>
          </Grid>
        </Box>
      </Fade>
      <InviteDialog />
    </Container>
  );
}
