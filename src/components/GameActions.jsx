import { Button, Stack, Fade } from '@mui/material';
import { 
  PlayArrow as PlayIcon,
  ExitToApp as ExitIcon
} from '@mui/icons-material';
import { styles } from './GameArea.styles';

const GameActions = ({ result, onPlayAgain, onQuitGame }) => {
  if (!result) return null;

  return (
    <Fade in timeout={500}>
      <Stack direction="row" spacing={3} sx={{ mt: 4 }}>
        <Button 
          variant="contained" 
          size="large"
          startIcon={<PlayIcon />}
          onClick={onPlayAgain}
          sx={styles.playAgainButton}
        >
          Play Again
        </Button>
        <Button 
          variant="outlined" 
          size="large"
          startIcon={<ExitIcon />}
          onClick={onQuitGame}
          color="error"
          sx={styles.quitButton}
        >
          Quit Game
        </Button>
      </Stack>
    </Fade>
  );
};

export default GameActions;
