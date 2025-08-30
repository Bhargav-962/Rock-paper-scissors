import { Button, Stack, Typography } from '@mui/material';
import { 
  HelpOutline as HelpIcon,
  SportsEsports as GameIcon,
  Flag as ForfeitIcon
} from '@mui/icons-material';
import { styles } from './GameArea.styles';

const GameHeader = ({ opponent, result, onShowRules, onForfeit }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={styles.headerStack}>
      <GameIcon color="primary" />
      <Typography variant="h4" sx={styles.title}>
        VS {opponent.username}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<HelpIcon />}
          onClick={onShowRules}
          sx={styles.rulesButton}
        >
          Rules
        </Button>
        {!result && (
          <Button 
            variant="outlined" 
            size="small" 
            color="error"
            startIcon={<ForfeitIcon />}
            onClick={onForfeit}
            sx={styles.rulesButton}
          >
            Forfeit
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default GameHeader;
