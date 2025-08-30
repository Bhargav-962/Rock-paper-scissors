import { Button, Stack, Typography, Zoom } from '@mui/material';
import { GAME_OPTIONS } from '../constants';
import { getChoiceButtonStyle, styles } from './GameArea.styles';

const GameChoices = ({ myChoice, onChoice }) => {
  const handleChoice = (choice) => {
    if (!myChoice) {
      onChoice(choice);
    }
  };

  return (
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
  );
};

export default GameChoices;
