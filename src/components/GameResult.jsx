import { Box, Typography, Fade } from '@mui/material';
import { styles } from './GameArea.styles';

const GameResult = ({ result, currentPlayer, opponent, myChoice, oppChoice }) => {
  const getResultText = (opponentName) => {
    if (!result) return `Waiting for ${opponentName} to choose...`;
    if (result === 'draw') return 'It\'s a Draw!';
    if (result === currentPlayer.id) {
      // Check if this was a forfeit win
      if (!myChoice && !oppChoice) {
        return `${opponentName} Forfeited - You Win!`;
      }
      return 'You Win!';
    }
    // Check if this was a forfeit loss
    if (!myChoice && !oppChoice) {
      return 'You Forfeited - You Lose';
    }
    return 'You Lose';
  };

  const getResultColor = () => {
    if (!result) return 'text.secondary';
    if (result === 'draw') return 'warning.main';
    if (result === currentPlayer.id) return 'success.main';
    return 'error.main';
  };

  return (
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
  );
};

export default GameResult;
