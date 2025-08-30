import { MESSAGE_TYPES } from '../constants';

export const broadcastPlayerListUpdate = (channel, players) => {
  channel?.postMessage({
    type: MESSAGE_TYPES.PLAYER_LIST_UPDATE,
    payload: { players }
  });
};

export const broadcastStartGame = (channel, participants) => {
  channel?.postMessage({
    type: MESSAGE_TYPES.START_GAME,
    payload: { participants }
  });
};

export const broadcastChoiceSubmitted = (channel, choices, result) => {
  channel?.postMessage({
    type: MESSAGE_TYPES.CHOICE_SUBMITTED,
    payload: { choices, result }
  });
};

export const broadcastResetRound = (channel) => {
  channel?.postMessage({
    type: MESSAGE_TYPES.RESET_ROUND
  });
};

export const broadcastExitGame = (channel, players) => {
  channel?.postMessage({
    type: MESSAGE_TYPES.EXIT_GAME,
    payload: { players }
  });
};

export const addMessageListener = (channel, handler) => {
  if (!channel) return () => {};

  channel.addEventListener('message', handler);
  return () => channel.removeEventListener('message', handler);
};
