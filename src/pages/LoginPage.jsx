import React, { useState } from 'react';
import { 
  Paper, 
  Stack, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Container,
  Card,
  CardContent,
  Fade
} from '@mui/material';
import { 
  SportsEsports as GameIcon,
  Login as LoginIcon 
} from '@mui/icons-material';
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
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Fade in timeout={800}>
        <Box sx={{ width: '100%' }}>
          {/* Welcome Header */}
          <Box textAlign="center" sx={{ mb: 6 }}>
            <GameIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Rock Paper Scissors
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Challenge friends and show your skills!
            </Typography>
          </Box>

          {/* Login Card */}
          <Card sx={{ 
            maxWidth: 400, 
            mx: 'auto',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            borderRadius: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Box textAlign="center">
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                      Join the Game
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Enter your username to start playing
                    </Typography>
                  </Box>
                  
                  <TextField 
                    label="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    autoFocus
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderWidth: 2,
                        }
                      }
                    }}
                  />
                  
                  <Button 
                    variant="contained" 
                    onClick={handleSubmit}
                    size="large"
                    startIcon={<LoginIcon />}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(45deg, #2196F3, #1976D2)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2, #1565C0)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Enter Lobby
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>

          {/* Game Rules Preview */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h4">🪨</Typography>
                <Typography variant="caption">Rock</Typography>
              </Box>
              <Box>
                <Typography variant="h4">📄</Typography>
                <Typography variant="caption">Paper</Typography>
              </Box>
              <Box>
                <Typography variant="h4">✂️</Typography>
                <Typography variant="caption">Scissors</Typography>
              </Box>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              The classic game of strategy and luck
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
}
