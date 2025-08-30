import { Box, Typography, LinearProgress } from '@mui/material';
import { styles } from './GameArea.styles';

const GameProgress = ({ myChoice, opponent, bothPlayersChosen }) => {
  return (
    <Box sx={styles.progressContainer}>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        gutterBottom 
        textAlign="center"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '250px'
        }}
      >
        {myChoice ? `Waiting for ${opponent.username} to choose...` : 'Waiting for choices...'}
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={bothPlayersChosen ? 100 : (myChoice ? 50 : 0)} 
        sx={styles.progressBar}
      />
    </Box>
  );
};

export default GameProgress;
