import { Card, CardContent, Typography, Chip } from '@mui/material';
import { GAME_OPTIONS } from '../constants';
import { styles } from './GameArea.styles';

const PlayerChoiceDisplay = ({ 
  playerName, 
  choice, 
  result, 
  isCurrentPlayer = false,
  showEmoji = true 
}) => {
  const getChoiceEmoji = (choice) => {
    const option = GAME_OPTIONS.find(opt => opt.name === choice);
    return option ? option.emoji : '❓';
  };

  const getDisplayEmoji = () => {
    if (showEmoji) {
      return choice ? getChoiceEmoji(choice) : '❓';
    }
    // For opponent during game (before result)
    return result ? (choice ? getChoiceEmoji(choice) : '❓') : (choice ? '✓' : '❓');
  };

  const getChipLabel = () => {
    if (showEmoji) {
      return choice || 'Choose!';
    }
    // For opponent during game (before result)
    return result ? (choice || 'No choice') : (choice ? 'Ready!' : 'Thinking...');
  };

  const getCardStyle = () => {
    if (choice) {
      return isCurrentPlayer ? styles.myChoiceCard : styles.oppChoiceCard;
    }
    return styles.noChoiceCard;
  };

  return (
    <Card sx={{ 
      ...styles.playerCard,
      ...getCardStyle()
    }}>
      <CardContent>
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '120px'
          }}
        >
          {playerName}
        </Typography>
        <Typography variant="h2" sx={styles.emojiText}>
          {getDisplayEmoji()}
        </Typography>
        <Chip 
          label={getChipLabel()} 
          size="small"
          color={choice ? (isCurrentPlayer ? 'primary' : 'secondary') : 'default'}
          variant={choice ? 'filled' : 'outlined'}
        />
      </CardContent>
    </Card>
  );
};

export default PlayerChoiceDisplay;
