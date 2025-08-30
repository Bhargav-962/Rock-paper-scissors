export const CHANNEL_NAME = 'game_channel';
export const PLAYERS_LIST = 'players_list';
export const CURRENT_PLAYER_KEY = 'current_player';

export const MESSAGE_TYPES = {
  PLAYER_LIST_UPDATE: 'PLAYER_LIST_UPDATE',
  CHOICE_SUBMITTED: 'CHOICE_SUBMITTED',
  RESET_ROUND: 'RESET_ROUND',
  EXIT_GAME: 'EXIT_GAME',
  START_GAME: 'START_GAME',
  FORFEIT_GAME: 'FORFEIT_GAME'
};

export const GAME_OPTIONS = [
  { name: 'Rock', emoji: '🪨', beats: 'Scissors', color: '#8D6E63' },
  { name: 'Paper', emoji: '📄', beats: 'Rock', color: '#5C6BC0' },
  { name: 'Scissors', emoji: '✂️', beats: 'Paper', color: '#EF5350' }
];

export const PLAYER_STATUS = {
  IDLE: 'idle',
  IN_GAME: 'in-game'
};

export const PLAYER_STATUS_LABELS = {
  [PLAYER_STATUS.IDLE]: 'Idle',
  [PLAYER_STATUS.IN_GAME]: 'In-Game'
};
