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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import useLoginValidation from '../hooks/useLoginValidation';
import { GAME_OPTIONS, PLAYER_STATUS } from '../constants';
import { generateRandomId } from '../utils/player';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { players, registerPlayer, currentPlayerId } = useGame();

  // Filter out current player from validation to avoid duplicate error on re-login
  const playersForValidation = players.filter(player => 
    !currentPlayerId || player.id !== currentPlayerId
  );

  // Use validation hook
  const { displayErrors, formFocused, validationErrors, isFormValid } = useLoginValidation(
    { username }, 
    playersForValidation
  );

  const handleSubmit = (e) => {
    e?.preventDefault();
    // Trigger display of all errors
    formFocused();
    if (!isFormValid) {
      return;
    }
    const name = username.trim();
    const player = { id: generateRandomId(), username: name, status: PLAYER_STATUS.IDLE, score: 0 };
    registerPlayer(player);
    navigate('/lobby');
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleUsernameBlur = () => {
    formFocused('username');
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
                    label="Enter your username" 
                    value={username} 
                    onChange={handleUsernameChange}
                    onBlur={handleUsernameBlur}
                    variant="outlined"
                    fullWidth
                    required
                    autoFocus
                    slotProps={{
                      htmlInput: {
                        maxLength: 30
                      }
                    }}
                    error={displayErrors.username && validationErrors.username.length > 0}
                    helperText={
                      displayErrors.username && validationErrors.username.length > 0
                        ? validationErrors.username[0]
                        : ''
                    }
                  />
                  
                  <Button 
                    variant="contained" 
                    onClick={handleSubmit}
                    size="large"
                    disabled={displayErrors.username && !isFormValid}
                  >
                    Enter Arena
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>

          {/* Game Rules Preview */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 2 }}>
              {GAME_OPTIONS.map((option) => (
                <Box key={option.name}>
                  <Typography variant="h4">{option.emoji}</Typography>
                  <Typography variant="caption">{option.name}</Typography>
                </Box>
              ))}
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
