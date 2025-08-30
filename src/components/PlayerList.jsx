import { Stack, Typography, Paper } from '@mui/material';
import { useGame } from '../context/GameContext';
import { PLAYER_STATUS } from '../constants';
import PlayerListItem from './PlayerListItem';

export default function PlayerList() {
  const { players, currentPlayer, invitePlayer, sentInvitations } = useGame();
  const otherPlayers = players.filter((p) => p.id !== currentPlayer?.id);

  return (
    <Paper sx={{ p: 2, width: '300px' }}>
      <Stack spacing={2}>
        <Typography variant="h6">Players</Typography>
        {otherPlayers.length === 0 && <Typography>No other players online</Typography>}
        {otherPlayers.map((p, idx) => {
          const isInvitationSent = sentInvitations.has(p.id);
          const isPlayerBusy = p.status === PLAYER_STATUS.IN_GAME;
          const isDisabled = isPlayerBusy || isInvitationSent;
          return (
            <PlayerListItem
              key={p.id}
              player={p}
              idx={idx}
              invitePlayer={invitePlayer}
              isDisabled={isDisabled}
              isInvitationSent={isInvitationSent}
            />
          );
        })}
      </Stack>
    </Paper>
  );
}
