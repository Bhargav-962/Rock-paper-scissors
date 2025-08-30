import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getChannel } from '../services/bus';
import { getPlayerListFromStorage, savePlayerListToStorage, removePlayerById } from '../services/storage';
import { PLAYER_STATUS, CURRENT_PLAYER_KEY, MESSAGE_TYPES } from '../constants';
import {
  broadcastPlayerListUpdate,
  broadcastStartGame,
  broadcastChoiceSubmitted,
  broadcastResetRound,
  broadcastExitGame,
  addMessageListener
} from '../utils/broadcast';

const GameContext = createContext();

const activeGameInitial = {
  participants: [],
  choices: {},
  result: null
}

export function GameProvider({ children }) {
  const [players, setPlayers] = useState(() => getPlayerListFromStorage());
  const [currentPlayer, setCurrentPlayer] = useState(() => {
    try {
      const raw = sessionStorage.getItem(CURRENT_PLAYER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [activeGame, setActiveGame] = useState(activeGameInitial);
  const channelRef = useRef(getChannel());

  const updatePlayerList = (players) => {
    savePlayerListToStorage(players);
    setPlayers(players);
    // Updates the player list across other tabs
    broadcastPlayerListUpdate(channelRef.current, players);
  };

  const playGame = (opponent) => {
    if (!currentPlayer || !opponent) return;
    // Start the game with current player and opponent
    const participants = [currentPlayer, opponent];
    const updatedParticipantsList = participants.map(player => {
      return { ...player, status: PLAYER_STATUS.IN_GAME };
    });

    // Notify other tabs about the game start
    broadcastStartGame(channelRef.current, updatedParticipantsList);
    const updatedPlayersList = players.map(player =>
      updatedParticipantsList.find(p => p.id === player.id) || player
    );
    updatePlayerList(updatedPlayersList);
    setActiveGame({ participants: updatedParticipantsList, choices: {}, result: null });
  };

  // Updates player list for current user and broadcasts it to other users
  const registerPlayer = (player, isCurrentPlayer = false) => {
    try {
      sessionStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(player));
    } catch { }
    if (isCurrentPlayer) {
      setCurrentPlayer(player);
    }
    updatePlayerList([...players, player]);
  };

  const logout = () => {
    if (!currentPlayer) return;
    try {
      const updated = removePlayerById(currentPlayer.id);
      broadcastPlayerListUpdate(channelRef.current, updated);
      sessionStorage.removeItem(CURRENT_PLAYER_KEY);
      setCurrentPlayer(null);
      setActiveGame(activeGameInitial);
    } catch { }
  };

  const updateUserChoice = (choices, result = null) => {
    setActiveGame({ ...activeGame, choices, result });

    // Broadcast the choice submission to other tabs
    broadcastChoiceSubmitted(channelRef.current, choices, result);
  };

  const submitChoice = (playerId, choice) => {
    const newChoices = { ...(activeGame.choices || {}), [playerId]: choice };
    let finalResult = null;

    if (Object.keys(newChoices).length === 2) {
      const [a, b] = activeGame.participants;
      finalResult = decideWinner(a.id, newChoices[a.id], b.id, newChoices[b.id]);
      if (finalResult !== 'draw') {
        const updatedPlayers = players.map((pl) =>
          pl.id === finalResult ? { ...pl, score: (pl.score || 0) + 1 } : pl
        );
        updatePlayerList(updatedPlayers);
      }
    }

    updateUserChoice(newChoices, finalResult);
  };

  const resetRound = () => {
    setActiveGame((prev) => (prev ? { ...prev, choices: {}, result: null } : prev));
    broadcastResetRound(channelRef.current);
  };

  const exitGame = () => {
    if (!activeGame.participants.length) return;
    const [p1, p2] = activeGame.participants;
    const updated = players.map((p) =>
      p.id === p1.id || p.id === p2.id ? { ...p, status: PLAYER_STATUS.IDLE } : p
    );
    updatePlayerList(updated);
    setActiveGame(activeGameInitial);
    broadcastExitGame(channelRef.current, [p1, p2]);
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
    const handler = (ev) => {
      const { type, payload } = ev.data || ev;

      switch (type) {
        case MESSAGE_TYPES.PLAYER_LIST_UPDATE:
          setPlayers(payload.players || getPlayerListFromStorage());
          break;

        case MESSAGE_TYPES.START_GAME:
          const { participants: gamePlayers } = payload;
          if (currentPlayer && gamePlayers.find(p => p.id === currentPlayer.id)) {
            setActiveGame({ participants: gamePlayers, choices: {}, result: null });
          }
          break;

        case MESSAGE_TYPES.CHOICE_SUBMITTED:
          setActiveGame((prev) => ({ ...prev, choices: payload.choices, result: payload.result }));
          break;

        case MESSAGE_TYPES.EXIT_GAME:
          setActiveGame(activeGameInitial);
          break;

        case MESSAGE_TYPES.RESET_ROUND:
          setActiveGame((prev) => (prev ? { ...prev, choices: {}, result: null } : prev));
          break;

        default:
          // Unknown message type, ignore
          break;
      }
    };

    const removeListener = addMessageListener(channelRef.current, handler);
    return removeListener;
  }, [currentPlayer?.id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        const meRaw = sessionStorage.getItem(CURRENT_PLAYER_KEY);
        const me = meRaw ? JSON.parse(meRaw) : null;
        if (me?.id) {
          const updated = removePlayerById(me.id);
          broadcastPlayerListUpdate(channelRef.current, updated);
        }
        sessionStorage.removeItem(CURRENT_PLAYER_KEY);
      } catch { }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <GameContext.Provider
      value={{
        players,
        currentPlayer,
        registerPlayer,
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
