import { useState } from 'react';
import { 
  Stack, 
  Typography, 
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { useGame } from '../context/GameContext';
import GameRulesDialog from './GameRulesDialog';
import GameEmptyState from './GameEmptyState';
import GameHeader from './GameHeader';
import GameChoices from './GameChoices';
import GameProgress from './GameProgress';
import PlayerChoiceDisplay from './PlayerChoiceDisplay';
import GameResult from './GameResult';
import GameActions from './GameActions';
import { styles } from './GameArea.styles';

const GameArea = () => {
  const { currentPlayer, activeGame, submitChoice, resetRound, exitGame, forfeitGame } = useGame();
  const [showHint, setShowHint] = useState(false);

  if (!activeGame.participants.length || !currentPlayer) {
    return <GameEmptyState />;
  }

  const opponent = activeGame.participants.find((p) => p.id !== currentPlayer.id);
  const myChoice = activeGame.choices?.[currentPlayer.id];
  const oppChoice = activeGame.choices?.[opponent.id];
  const { result } = activeGame;

  const handleChoice = (choice) => {
    submitChoice(currentPlayer.id, choice);
  };

  const bothPlayersChosen = myChoice && oppChoice;

  return (
    <>
      <Card sx={styles.mainCard}>
        <CardContent sx={styles.cardContent}>
          <Stack spacing={4} alignItems="center">
            <GameHeader 
              opponent={opponent}
              result={result}
              onShowRules={() => setShowHint(true)}
              onForfeit={forfeitGame}
            />

            <Divider sx={{ width: '100%' }} />

            <GameChoices 
              myChoice={myChoice}
              onChoice={handleChoice}
            />

            <Divider sx={{ width: '100%' }} />

            <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
              {!result && (
                <GameProgress 
                  myChoice={myChoice}
                  opponent={opponent}
                  bothPlayersChosen={bothPlayersChosen}
                />
              )}

              <Stack direction="row" spacing={4} alignItems="center" justifyContent="center">
                <PlayerChoiceDisplay 
                  playerName="You"
                  choice={myChoice}
                  result={result}
                  isCurrentPlayer={true}
                  showEmoji={true}
                />

                <Typography variant="h3" color="text.secondary">
                  VS
                </Typography>

                <PlayerChoiceDisplay 
                  playerName={opponent.username}
                  choice={oppChoice}
                  result={result}
                  isCurrentPlayer={false}
                  showEmoji={false}
                />
              </Stack>

              <GameResult 
                result={result}
                currentPlayer={currentPlayer}
                opponent={opponent}
                myChoice={myChoice}
                oppChoice={oppChoice}
              />
            </Stack>

            <GameActions 
              result={result}
              onPlayAgain={resetRound}
              onQuitGame={exitGame}
            />
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