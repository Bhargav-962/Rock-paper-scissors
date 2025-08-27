import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useGame } from '../context/GameContext';

export default function InviteDialog() {
  const { pendingInvite, acceptInvite, declineInvite } = useGame();

  if (!pendingInvite) return null;

  const from = pendingInvite.from;

  return (
    <Dialog open={true} onClose={() => declineInvite(pendingInvite)}>
      <DialogTitle>Game Invite</DialogTitle>
      <DialogContent>
        <Typography>{from.username} invited you to play Rock-Paper-Scissors.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => declineInvite(pendingInvite)}>Decline</Button>
        <Button variant="contained" onClick={() => acceptInvite(pendingInvite)}>Accept</Button>
      </DialogActions>
    </Dialog>
  );
}
