import { MESSAGE_TYPES } from '../constants';

export const broadcastPlayerListUpdate = (channel, players) => {
  channel?.postMessage({
    type: MESSAGE_TYPES.PLAYER_LIST_UPDATE,
    payload: { players }
  });
};

export const broadcastStartGame = (channel, participants, gameId) => {
  channel?.postMessage({
    type: MESSAGE_TYPES.START_GAME,
    payload: { participants, gameId }
  });
};

export const broadcastChoiceSubmitted = ({ channel, choices, result, gameId }) => {
  channel?.postMessage({
    type: MESSAGE_TYPES.CHOICE_SUBMITTED,
    payload: { choices, result, gameId }
  });
};

export const broadcastResetRound = (channel, gameId) => {
  channel?.postMessage({
    type: MESSAGE_TYPES.RESET_ROUND,
    payload: { gameId }
  });
};

export const broadcastExitGame = (channel, players, gameId) => {
  channel?.postMessage({
    type: MESSAGE_TYPES.EXIT_GAME,
    payload: { players, gameId }
  });
};

export const broadcastForfeitGame = ({ channel, winner, gameId }) => {
  channel?.postMessage({
    type: MESSAGE_TYPES.FORFEIT_GAME,
    payload: { winner, gameId }
  });
};

export const addMessageListener = (channel, handler) => {
  if (!channel) return () => {};

  channel.addEventListener('message', handler);
  return () => channel.removeEventListener('message', handler);
};
