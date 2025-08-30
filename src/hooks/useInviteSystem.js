import { useState, useRef } from 'react';
import { getChannel } from '../services/bus';
import { WAIT_QUEUE_KEY, PLAYER_STATUS, MESSAGE_TYPES } from '../constants';

export function useInviteSystem() {
  const [pendingInvite, setPendingInvite] = useState(null);
  const [sentInvitations, setSentInvitations] = useState(new Set());
  const channelRef = useRef(getChannel());

  const invitePlayer = (currentPlayer, opponent) => {
    if (!currentPlayer) return;
    if (opponent.status === PLAYER_STATUS.IDLE) {
      // Add to sent invitations to show pending state
      setSentInvitations(prev => new Set([...prev, opponent.id]));
      channelRef.current?.postMessage({ type: MESSAGE_TYPES.INVITE, payload: { from: currentPlayer, to: opponent } });
    } else {
      try {
        const q = JSON.parse(localStorage.getItem(WAIT_QUEUE_KEY) || '[]');
        if (!q.find((item) => item.requester.id === currentPlayer.id && item.targetId === opponent.id)) {
          q.push({ requester: currentPlayer, targetId: opponent.id });
          localStorage.setItem(WAIT_QUEUE_KEY, JSON.stringify(q));
        }
      } catch {}
    }
  };

  const acceptInvite = (invite, currentPlayer, onStartGame) => {
    const { from, to } = invite;
    if (!currentPlayer || to.id !== currentPlayer.id) return;
    channelRef.current?.postMessage({ type: MESSAGE_TYPES.INVITE_ACCEPT, payload: { from: to, to: from } });
    onStartGame(from, to);
    setPendingInvite(null);
    // Clear sent invitation when accepted
    setSentInvitations(prev => {
      const newSet = new Set(prev);
      newSet.delete(from.id);
      return newSet;
    });
  };

  const declineInvite = (invite) => {
    setPendingInvite(null);
    channelRef.current?.postMessage({ type: MESSAGE_TYPES.INVITE_DECLINE, payload: invite });
    // Clear sent invitation when declined
    if (invite.from) {
      setSentInvitations(prev => {
        const newSet = new Set(prev);
        newSet.delete(invite.from.id);
        return newSet;
      });
    }
  };

  const clearSentInvitation = (playerId) => {
    setSentInvitations(prev => {
      const newSet = new Set(prev);
      newSet.delete(playerId);
      return newSet;
    });
  };

  const handleInviteMessage = (payload, currentPlayer) => {
    const { from, to } = payload;
    if (currentPlayer && to.id === currentPlayer.id) setPendingInvite({ from, to });
  };

  const handleInviteAcceptMessage = (payload, currentPlayer) => {
    const { from, to } = payload;
    // Clear sent invitation when accepted
    setSentInvitations(prev => {
      const newSet = new Set(prev);
      newSet.delete(from.id);
      newSet.delete(to.id);
      return newSet;
    });
  };

  const handleInviteDeclineMessage = (payload, currentPlayer) => {
    const { from, to } = payload;
    if (currentPlayer && from.id === currentPlayer.id) {
      setSentInvitations(prev => {
        const newSet = new Set(prev);
        newSet.delete(to.id);
        return newSet;
      });
    }
  };

  return {
    pendingInvite,
    sentInvitations,
    invitePlayer,
    acceptInvite,
    declineInvite,
    clearSentInvitation,
    handleInviteMessage,
    handleInviteAcceptMessage,
    handleInviteDeclineMessage
  };
}
