import { Card, CardContent, Typography } from '@mui/material';
import { SportsEsports as GameIcon } from '@mui/icons-material';
import { styles } from './GameArea.styles';

const GameEmptyState = () => {
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
};

export default GameEmptyState;
