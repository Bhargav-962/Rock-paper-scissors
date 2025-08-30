import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getChannel } from '../services/bus';
import { getPlayers, savePlayers, removePlayerById } from '../services/storage';
import { PLAYER_STATUS, CURRENT_PLAYER_KEY, MESSAGE_TYPES } from '../constants';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [players, setPlayers] = useState(() => getPlayers());
  const [currentPlayer, setCurrentPlayer] = useState(() => {
    try {
      const raw = sessionStorage.getItem(CURRENT_PLAYER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [activeGame, setActiveGame] = useState(null);

  const channelRef = useRef(getChannel());

  const broadcastPlayers = (updated) => {
    savePlayers(updated);
    setPlayers(updated);
    // Updates the player list across other tabs
    channelRef.current?.postMessage({ type: MESSAGE_TYPES.PLAYER_LIST_UPDATE, payload: { players: updated } });
  };

  const playGame = (opponent) => {
    if (!currentPlayer || !opponent) return;
    
    // Start the game directly with current player and opponent
    const p1 = currentPlayer;
    const p2 = opponent;
    
    // Notify other tabs about the game start
    channelRef.current?.postMessage({ 
      type: MESSAGE_TYPES.START_GAME, 
      payload: { players: [p1, p2] } 
    });
    
    startGame(p1, p2);
  };

  const updatePlayerList = (player, isCurrentPlayer = false) => {
    try {
      sessionStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(player));
    } catch {}
    if (isCurrentPlayer) {
      setCurrentPlayer(player);
    }
    broadcastPlayers([...players, player]);
  };

  const logout = () => {
    if (!currentPlayer) return;
    try {
      const updated = removePlayerById(currentPlayer.id);
      channelRef.current?.postMessage({ type: MESSAGE_TYPES.PLAYER_LIST_UPDATE, payload: { players: updated } });
      sessionStorage.removeItem(CURRENT_PLAYER_KEY);
      setCurrentPlayer(null);
      setActiveGame(null);
    } catch {}
  };

  const startGame = (p1, p2) => {
    const updated = players.map((p) =>
      p.id === p1.id ? { ...p, status: PLAYER_STATUS.IN_GAME } : p.id === p2.id ? { ...p, status: PLAYER_STATUS.IN_GAME } : p
    );
    broadcastPlayers(updated);
    setActiveGame({ players: [p1, p2], choices: {}, result: null });
  };

  const submitChoice = (playerId, choice) => {
    setActiveGame((prev) => {
      if (!prev) return prev;
      const newChoices = { ...(prev.choices || {}), [playerId]: choice };
      channelRef.current?.postMessage({ type: MESSAGE_TYPES.CHOICE_SUBMITTED, payload: { playerId, choice } });

      let result = prev.result;
      if (Object.keys(newChoices).length === 2) {
        const [a, b] = prev.players;
        result = decideWinner(a.id, newChoices[a.id], b.id, newChoices[b.id]);
        if (result !== 'draw') {
          const updatedPlayers = players.map((pl) =>
            pl.id === result ? { ...pl, score: (pl.score || 0) + 1 } : pl
          );
          console.log("==>new choices",newChoices, updatedPlayers )
          broadcastPlayers(updatedPlayers);
        }
      }
      return { ...prev, choices: newChoices, result };
    });
  };

  const resetRound = () => {
    setActiveGame((prev) => (prev ? { ...prev, choices: {}, result: null } : prev));
    channelRef.current?.postMessage({ type: MESSAGE_TYPES.RESET_ROUND });
  };

  const exitGame = () => {
    if (!activeGame) return;
    const [p1, p2] = activeGame.players;
    const updated = players.map((p) =>
      p.id === p1.id || p.id === p2.id ? { ...p, status: PLAYER_STATUS.IDLE } : p
    );
    broadcastPlayers(updated);
    setActiveGame(null);
    channelRef.current?.postMessage({ type: MESSAGE_TYPES.EXIT_GAME, payload: { players: [p1, p2] } });
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

      switch (type) {
        case MESSAGE_TYPES.PLAYER_LIST_UPDATE:
          setPlayers(payload.players || getPlayers());
          break;

        case MESSAGE_TYPES.START_GAME:
          const { players: gamePlayers } = payload;
          if (currentPlayer && gamePlayers.find(p => p.id === currentPlayer.id)) {
            startGame(gamePlayers[0], gamePlayers[1]);
          }
          break;

        case MESSAGE_TYPES.CHOICE_SUBMITTED:
          setActiveGame((prev) => {
            if (!prev) return prev;
            const choices = { ...(prev.choices || {}), [payload.playerId]: payload.choice };
            let result = prev.result;

            if (Object.keys(choices).length === 2 && !result) {
              const [a, b] = prev.players;
              result = decideWinner(a.id, choices[a.id], b.id, choices[b.id]);

              if (result !== 'draw') {
                const updatedPlayers = players.map((pl) =>
                  pl.id === result ? { ...pl, score: (pl.score || 0) + 1 } : pl
                );
                broadcastPlayers(updatedPlayers);
              }
            }
            return { ...prev, choices, result };
          });
          break;

        case MESSAGE_TYPES.EXIT_GAME:
          setActiveGame(null);
          const updated = players.map((p) =>
            payload.players.find((pl) => pl.id === p.id) ? { ...p, status: PLAYER_STATUS.IDLE } : p
          );
          broadcastPlayers(updated);
          break;

        case MESSAGE_TYPES.RESET_ROUND:
          setActiveGame((prev) => (prev ? { ...prev, choices: {}, result: null } : prev));
          break;

        default:
          // Unknown message type, ignore
          break;
      }
    };

    ch.addEventListener('message', handler);
    return () => ch.removeEventListener('message', handler);
  }, [currentPlayer]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        const meRaw = sessionStorage.getItem(CURRENT_PLAYER_KEY);
        const me = meRaw ? JSON.parse(meRaw) : null;
        if (me?.id) {
          const updated = removePlayerById(me.id);
          channelRef.current?.postMessage({ type: MESSAGE_TYPES.PLAYER_LIST_UPDATE, payload: { players: updated } });
        }
        sessionStorage.removeItem(CURRENT_PLAYER_KEY);
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
        updatePlayerList,
        logout,
        playGame,
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
