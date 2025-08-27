import React from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useGame } from '../context/GameContext';

const GameArea = () => {
  const { currentPlayer, activeGame, submitChoice, resetRound, exitGame } = useGame();

  if (!activeGame || !currentPlayer) {
    return (
      <Typography variant="h6" sx={{ mt: 2 }}>
        No active game. Go back to the lobby and invite someone!
      </Typography>
    );
  }

  const opponent = activeGame.players.find((p) => p.id !== currentPlayer.id);
  const myChoice = activeGame.choices?.[currentPlayer.id];
  const oppChoice = activeGame.choices?.[opponent.id];
  const { result } = activeGame;

  const handleChoice = (choice) => {
    if (!myChoice) {
      submitChoice(currentPlayer.id, choice);
    }
  };

  const getResultText = () => {
    if (!result) return 'Waiting for choices...';
    if (result === 'draw') return 'It\'s a Draw!';
    if (result === currentPlayer.id) return 'You Win! 🎉';
    return 'You Lose 😢';
  };

  return (
    <Stack spacing={3} alignItems="center" sx={{ mt: 4 }}>
      <Typography variant="h5">Game vs {opponent.username}</Typography>

      <Stack direction="row" spacing={2}>
        {['Rock', 'Paper', 'Scissors'].map((c) => (
          <Button
            key={c}
            variant={myChoice === c ? 'contained' : 'outlined'}
            onClick={() => handleChoice(c)}
            disabled={!!myChoice}
          >
            {c}
          </Button>
        ))}
      </Stack>

      <Stack spacing={1} alignItems="center">
        <Typography>Your choice: {myChoice || '—'}</Typography>
        <Typography>Opponent's choice: {oppChoice || '—'}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {getResultText()}
        </Typography>
      </Stack>

      {result && (
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" onClick={resetRound}>
            Play Again
          </Button>
          <Button variant="outlined" color="error" onClick={exitGame}>
            Quit Game
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default GameArea;
