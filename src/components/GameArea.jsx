import { useState } from 'react';
import { 
  Button, 
  Stack, 
  Typography, 
  Box,
  Card,
  CardContent,
  Chip,
  Fade,
  Zoom,
  Divider,
  LinearProgress
} from '@mui/material';
import { 
  HelpOutline as HelpIcon,
  PlayArrow as PlayIcon,
  ExitToApp as ExitIcon,
  SportsEsports as GameIcon
} from '@mui/icons-material';
import { useGame } from '../context/GameContext';
import { GAME_OPTIONS } from '../constants';
import GameRulesDialog from './GameRulesDialog';

const GameArea = () => {
  const { currentPlayer, activeGame, submitChoice, resetRound, exitGame } = useGame();
  const [showHint, setShowHint] = useState(false);

  if (!activeGame.participants.length || !currentPlayer) {
    return (
      <Card sx={{ 
        maxWidth: 600, 
        mx: 'auto', 
        mt: 4,
        background: 'linear-gradient(145deg, #f5f5f5 0%, #e0e0e0 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <GameIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="text.primary">
            Ready to Play?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Go back to the lobby and invite someone to start a game!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const opponent = activeGame.participants.find((p) => p.id !== currentPlayer.id);
  const myChoice = activeGame.choices?.[currentPlayer.id];
  const oppChoice = activeGame.choices?.[opponent.id];
  const { result } = activeGame;

  const handleChoice = (choice) => {
    if (!myChoice) {
      submitChoice(currentPlayer.id, choice);
    }
  };

  const getResultText = (opponentName) => {
    if (!result) return `Waiting for ${opponentName} to choose...`;
    if (result === 'draw') return 'It\'s a Draw!';
    if (result === currentPlayer.id) return 'You Win!';
    return 'You Lose';
  };

  const getChoiceEmoji = (choice) => {
    const option = GAME_OPTIONS.find(opt => opt.name === choice);
    return option ? option.emoji : '❓';
  };

  const getResultColor = () => {
    if (!result) return 'text.secondary';
    if (result === 'draw') return 'warning.main';
    if (result === currentPlayer.id) return 'success.main';
    return 'error.main';
  };

  const bothPlayersChosen = myChoice && oppChoice;

  return (
    <>
      <Card sx={{ 
        maxWidth: 700, 
        mx: 'auto', 
        mt: 2,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
        borderRadius: 3
      }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={4} alignItems="center">
            {/* Header */}
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <GameIcon color="primary" />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                VS {opponent.username}
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<HelpIcon />}
                onClick={() => setShowHint(true)}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Rules
              </Button>
            </Stack>

            <Divider sx={{ width: '100%' }} />

            {/* Game Choices */}
            <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
              <Typography variant="h6" color="text.secondary">Choose your weapon!</Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                {GAME_OPTIONS.map((option) => (
                  <Zoom in timeout={300} key={option.name}>
                    <Button
                      variant={myChoice === option.name ? 'contained' : 'outlined'}
                      onClick={() => handleChoice(option.name)}
                      disabled={!!myChoice}
                      sx={{
                        minWidth: 120,
                        minHeight: 80,
                        borderRadius: 3,
                        flexDirection: 'column',
                        gap: 1,
                        fontSize: '1.2rem',
                        textTransform: 'none',
                        fontWeight: 600,
                        backgroundColor: myChoice === option.name ? option.color : 'transparent',
                        borderColor: option.color,
                        color: myChoice === option.name ? 'white' : option.color,
                        '&:hover': {
                          backgroundColor: myChoice === option.name ? option.color : `${option.color}15`,
                          transform: 'scale(1.05)',
                          boxShadow: `0 6px 20px ${option.color}40`
                        },
                        transition: 'all 0.3s ease',
                        '&:disabled': {
                          backgroundColor: myChoice === option.name ? option.color : 'transparent',
                          color: myChoice === option.name ? 'white' : option.color,
                          opacity: myChoice === option.name ? 1 : 0.5
                        }
                      }}
                    >
                      <Typography variant="h3">{option.emoji}</Typography>
                      <Typography variant="body2">{option.name}</Typography>
                    </Button>
                  </Zoom>
                ))}
              </Stack>
            </Stack>

            <Divider sx={{ width: '100%' }} />

            {/* Game Status */}
            <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
              {/* Progress indicator */}
              {!result && (
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom textAlign="center">
                    {myChoice ? `Waiting for ${opponent.username} to choose...` : 'Waiting for choices...'}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={bothPlayersChosen ? 100 : (myChoice ? 50 : 0)} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #4CAF50, #2196F3)'
                      }
                    }}
                  />
                </Box>
              )}

              {/* Player choices display */}
              <Stack direction="row" spacing={4} alignItems="center" justifyContent="center">
                <Card sx={{ 
                  minWidth: 150, 
                  textAlign: 'center',
                  backgroundColor: myChoice ? 'primary.50' : 'grey.50',
                  border: myChoice ? '2px solid' : '1px solid',
                  borderColor: myChoice ? 'primary.main' : 'grey.300'
                }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      You
                    </Typography>
                    <Typography variant="h2" sx={{ my: 1 }}>
                      {myChoice ? getChoiceEmoji(myChoice) : '❓'}
                    </Typography>
                    <Chip 
                      label={myChoice || 'Choose!'} 
                      size="small"
                      color={myChoice ? 'primary' : 'default'}
                      variant={myChoice ? 'filled' : 'outlined'}
                    />
                  </CardContent>
                </Card>

                <Typography variant="h3" color="text.secondary">
                  VS
                </Typography>

                <Card sx={{ 
                  minWidth: 150, 
                  textAlign: 'center',
                  backgroundColor: oppChoice ? 'secondary.50' : 'grey.50',
                  border: oppChoice ? '2px solid' : '1px solid',
                  borderColor: oppChoice ? 'secondary.main' : 'grey.300'
                }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {opponent.username}
                    </Typography>
                    <Typography variant="h2" sx={{ my: 1 }}>
                      {result ? (oppChoice ? getChoiceEmoji(oppChoice) : '❓') : (oppChoice ? '✓' : '❓')}
                    </Typography>
                    <Chip 
                      label={result ? (oppChoice || 'No choice') : (oppChoice ? 'Ready!' : 'Thinking...')} 
                      size="small"
                      color={oppChoice ? 'secondary' : 'default'}
                      variant={oppChoice ? 'filled' : 'outlined'}
                    />
                  </CardContent>
                </Card>
              </Stack>

              {/* Result Display */}
              <Fade in={!!result} timeout={800}>
                <Box textAlign="center">
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: getResultColor(),
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      mb: 1
                    }}
                  >
                    {getResultText(opponent.username)}
                  </Typography>
                  {result && result !== 'draw' && (
                    <Typography variant="body2" color="text.secondary">
                      {result === currentPlayer.id ? 'Excellent choice!' : 'Better luck next time!'}
                    </Typography>
                  )}
                </Box>
              </Fade>
            </Stack>

            {/* Action Buttons */}
            {result && (
              <Fade in timeout={500}>
                <Stack direction="row" spacing={3} sx={{ mt: 4 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<PlayIcon />}
                    onClick={resetRound}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #45a049, #4CAF50)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Play Again
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    startIcon={<ExitIcon />}
                    onClick={exitGame}
                    color="error"
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(244, 67, 54, 0.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Quit Game
                  </Button>
                </Stack>
              </Fade>
            )}
          </Stack>
        </CardContent>
      </Card>

      <GameRulesDialog 
        open={showHint} 
        onClose={() => setShowHint(false)} 
      />
    </>
  );
};

export default GameArea;