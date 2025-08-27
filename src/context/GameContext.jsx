import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getChannel } from '../services/bus';
import { getPlayers, savePlayers, removePlayerById } from '../services/storage';
import { WAIT_QUEUE_KEY } from '../constants';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [players, setPlayers] = useState(() => getPlayers());
  const [currentPlayer, setCurrentPlayer] = useState(() => {
    try {
      const raw = sessionStorage.getItem('rps_current_player');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [activeGame, setActiveGame] = useState(null);
  const [pendingInvite, setPendingInvite] = useState(null);

  const channelRef = useRef(getChannel());

  const broadcastPlayers = (updated) => {
    savePlayers(updated);
    setPlayers(updated);
    channelRef.current?.postMessage({ type: 'PLAYER_LIST_UPDATE', payload: { players: updated } });
  };

  const registerPlayer = (player) => {
    try {
      sessionStorage.setItem('rps_current_player', JSON.stringify(player));
    } catch {}
    setCurrentPlayer(player);
    const existing = getPlayers();
    const updated = existing.some((p) => p.id === player.id)
      ? existing.map((p) => (p.id === player.id ? { ...p, username: player.username } : p))
      : existing.concat({ ...player, status: 'idle', score: player.score || 0 });

    broadcastPlayers(updated);
  };

  const logout = () => {
    if (!currentPlayer) return;
    try {
      const updated = removePlayerById(currentPlayer.id);
      channelRef.current?.postMessage({ type: 'PLAYER_LIST_UPDATE', payload: { players: updated } });
      sessionStorage.removeItem('rps_current_player');
      setCurrentPlayer(null);
      setActiveGame(null);
    } catch {}
  };

  const invitePlayer = (opponent) => {
    if (!currentPlayer) return;
    if (opponent.status === 'idle') {
      channelRef.current?.postMessage({ type: 'INVITE', payload: { from: currentPlayer, to: opponent } });
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

  const acceptInvite = (invite) => {
    const { from, to } = invite;
    if (!currentPlayer || to.id !== currentPlayer.id) return;
    channelRef.current?.postMessage({ type: 'INVITE_ACCEPT', payload: { from: to, to: from } });
    startGame(from, to);
    setPendingInvite(null);
  };

  const declineInvite = (invite) => {
    setPendingInvite(null);
    channelRef.current?.postMessage({ type: 'INVITE_DECLINE', payload: invite });
  };

  const startGame = (p1, p2) => {
    const updated = getPlayers().map((p) =>
      p.id === p1.id ? { ...p, status: 'in-game' } : p.id === p2.id ? { ...p, status: 'in-game' } : p
    );
    broadcastPlayers(updated);
    setActiveGame({ players: [p1, p2], choices: {}, result: null });
  };

  const submitChoice = (playerId, choice) => {
    setActiveGame((prev) => {
      if (!prev) return prev;
      const newChoices = { ...(prev.choices || {}), [playerId]: choice };
      channelRef.current?.postMessage({ type: 'CHOICE_SUBMITTED', payload: { playerId, choice } });

      let result = prev.result;
      if (Object.keys(newChoices).length === 2) {
        const [a, b] = prev.players;
        result = decideWinner(a.id, newChoices[a.id], b.id, newChoices[b.id]);
        if (result !== 'draw') {
          const updatedPlayers = getPlayers().map((pl) =>
            pl.id === result ? { ...pl, score: (pl.score || 0) + 1 } : pl
          );
          broadcastPlayers(updatedPlayers);
        }
      }
      return { ...prev, choices: newChoices, result };
    });
  };

  const resetRound = () => {
    setActiveGame((prev) => (prev ? { ...prev, choices: {}, result: null } : prev));
    channelRef.current?.postMessage({ type: 'RESET_ROUND' });
  };

  const exitGame = () => {
    if (!activeGame) return;
    const [p1, p2] = activeGame.players;
    const updated = getPlayers().map((p) =>
      p.id === p1.id || p.id === p2.id ? { ...p, status: 'idle' } : p
    );
    broadcastPlayers(updated);
    setActiveGame(null);
    channelRef.current?.postMessage({ type: 'EXIT_GAME', payload: { players: [p1, p2] } });

    try {
      const q = JSON.parse(localStorage.getItem(WAIT_QUEUE_KEY) || '[]');
      [p1, p2].forEach((available) => {
        const idx = q.findIndex((item) => item.targetId === available.id);
        if (idx !== -1) {
          const next = q.splice(idx, 1)[0];
          channelRef.current?.postMessage({ type: 'INVITE', payload: { from: next.requester, to: available } });
        }
      });
      localStorage.setItem(WAIT_QUEUE_KEY, JSON.stringify(q));
    } catch {}
  };

  const decideWinner = (id1, c1, id2, c2) => {
    if (c1 === c2) return 'draw';
    if (
      (c1 === 'Rock' && c2 === 'Scissors') ||
      (c1 === 'Paper' && c2 === 'Rock') ||
      (c1 === 'Scissors' && c2 === 'Paper')
    ) {
      return id1;
    }
    return id2;
  };

  useEffect(() => {
    const ch = channelRef.current;
    if (!ch) return;

    const handler = (ev) => {
      const { type, payload } = ev.data || ev;

      if (type === 'PLAYER_LIST_UPDATE') {
        setPlayers(payload.players || getPlayers());
        return;
      }

      if (type === 'INVITE') {
        const { from, to } = payload;
        if (currentPlayer && to.id === currentPlayer.id) setPendingInvite({ from, to });
        return;
      }

      if (type === 'INVITE_ACCEPT') {
        const { from, to } = payload;
        if (currentPlayer && (from.id === currentPlayer.id || to.id === currentPlayer.id)) {
          startGame(from, to);
        }
        return;
      }

      if (type === 'CHOICE_SUBMITTED') {
        setActiveGame((prev) => {
          if (!prev) return prev;
          const choices = { ...(prev.choices || {}), [payload.playerId]: payload.choice };
          let result = prev.result;

          if (Object.keys(choices).length === 2 && !result) {
            const [a, b] = prev.players;
            result = decideWinner(a.id, choices[a.id], b.id, choices[b.id]);

            if (result !== 'draw') {
              const updatedPlayers = getPlayers().map((pl) =>
                pl.id === result ? { ...pl, score: (pl.score || 0) + 1 } : pl
              );
              broadcastPlayers(updatedPlayers);
            }
          }
          return { ...prev, choices, result };
        });
        return;
      }

      if (type === 'EXIT_GAME') {
        setActiveGame(null);
        const updated = getPlayers().map((p) =>
          payload.players.find((pl) => pl.id === p.id) ? { ...p, status: 'idle' } : p
        );
        broadcastPlayers(updated);
        return;
      }

      if (type === 'RESET_ROUND') {
        setActiveGame((prev) => (prev ? { ...prev, choices: {}, result: null } : prev));
        return;
      }
    };

    ch.addEventListener('message', handler);
    return () => ch.removeEventListener('message', handler);
  }, [currentPlayer]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        const meRaw = sessionStorage.getItem('rps_current_player');
        const me = meRaw ? JSON.parse(meRaw) : null;
        if (me?.id) {
          const updated = removePlayerById(me.id);
          channelRef.current?.postMessage({ type: 'PLAYER_LIST_UPDATE', payload: { players: updated } });
        }
        sessionStorage.removeItem('rps_current_player');
      } catch {}
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    setPlayers(getPlayers());
  }, []);

  return (
    <GameContext.Provider
      value={{
        players,
        currentPlayer,
        registerPlayer,
        logout,
        invitePlayer,
        pendingInvite,
        acceptInvite,
        declineInvite,
        activeGame,
        submitChoice,
        resetRound,
        exitGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
