import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { getChannel } from '../services/bus';
import { removePlayerById } from '../services/storage';
import { CURRENT_PLAYER_KEY, MESSAGE_TYPES } from '../constants';
import { broadcastPlayerListUpdate, addMessageListener } from '../utils/broadcast';
import { gameReducer, initialState } from '../reducer/reducer';
import { useCommonFunctions } from '../hooks/useCommonFunctions';
import {
  updatePlayersList,
  updateGameParticipants,
  destroyCurrentGame,
  updateUserChoices,
  updateUserResult,
  resetGameState
} from '../actions/gameActions';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { currentPlayer, players, activeGame } = state;
  const channelRef = useRef(getChannel());
  const {
    registerPlayer,
    logout,
    playGame,
    submitChoice,
    resetRound,
    exitGame,
  } = useCommonFunctions(state, dispatch, channelRef.current);

  useEffect(() => {
    const handler = (ev) => {
      const { type, payload } = ev.data || ev;

      switch (type) {
        case MESSAGE_TYPES.PLAYER_LIST_UPDATE:
          updatePlayersList(dispatch)(payload.players);
          break;

        case MESSAGE_TYPES.START_GAME:
          const { participants: gamePlayers } = payload;
          if (currentPlayer && gamePlayers.find(p => p.id === currentPlayer.id)) {
            updateGameParticipants(dispatch)(gamePlayers);
          }
          break;

        case MESSAGE_TYPES.CHOICE_SUBMITTED:
          updateUserChoices(dispatch)(payload.choices);
          updateUserResult(dispatch)(payload.result);
          break;

        case MESSAGE_TYPES.EXIT_GAME:
          destroyCurrentGame(dispatch)();
          break;

        case MESSAGE_TYPES.RESET_ROUND:
          resetGameState(dispatch)();
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
