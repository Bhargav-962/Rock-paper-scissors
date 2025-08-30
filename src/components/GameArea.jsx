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
import { styles, getChoiceButtonStyle } from './GameArea.styles';

const GameArea = () => {
  const { currentPlayer, activeGame, submitChoice, resetRound, exitGame } = useGame();
  const [showHint, setShowHint] = useState(false);

  if (!activeGame.participants.length || !currentPlayer) {
    return (
      <Card sx={styles.emptyStateCard}>
        <CardContent sx={styles.emptyStateContent}>
          <GameIcon sx={styles.emptyStateIcon} />
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
      <Card sx={styles.mainCard}>
        <CardContent sx={styles.cardContent}>
          <Stack spacing={4} alignItems="center">
            {/* Header */}
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={styles.headerStack}>
              <GameIcon color="primary" />
              <Typography variant="h4" sx={styles.title}>
                VS {opponent.username}
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<HelpIcon />}
                onClick={() => setShowHint(true)}
                sx={styles.rulesButton}
              >
                Rules
              </Button>
            </Stack>

            <Divider sx={{ width: '100%' }} />

            {/* Game Choices */}
            <Stack spacing={3} alignItems="center" sx={styles.choicesStack}>
              <Typography variant="h6" color="text.secondary">Choose your weapon!</Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                {GAME_OPTIONS.map((option) => (
                  <Zoom in timeout={300} key={option.name}>
                    <Button
                      variant={myChoice === option.name ? 'contained' : 'outlined'}
                      onClick={() => handleChoice(option.name)}
                      disabled={!!myChoice}
                      sx={getChoiceButtonStyle(option, myChoice)}
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
                <Box sx={styles.progressContainer}>
                  <Typography variant="body2" color="text.secondary" gutterBottom textAlign="center">
                    {myChoice ? `Waiting for ${opponent.username} to choose...` : 'Waiting for choices...'}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={bothPlayersChosen ? 100 : (myChoice ? 50 : 0)} 
                    sx={styles.progressBar}
                  />
                </Box>
              )}

              {/* Player choices display */}
              <Stack direction="row" spacing={4} alignItems="center" justifyContent="center">
                <Card sx={{ 
                  ...styles.playerCard,
                  ...(myChoice ? styles.myChoiceCard : styles.noChoiceCard)
                }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      You
                    </Typography>
                    <Typography variant="h2" sx={styles.emojiText}>
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
                  ...styles.playerCard,
                  ...(oppChoice ? styles.oppChoiceCard : styles.noChoiceCard)
                }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {opponent.username}
                    </Typography>
                    <Typography variant="h2" sx={styles.emojiText}>
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
                      ...styles.resultText,
                      color: getResultColor()
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
                    sx={styles.playAgainButton}
                  >
                    Play Again
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    startIcon={<ExitIcon />}
                    onClick={exitGame}
                    color="error"
                    sx={styles.quitButton}
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