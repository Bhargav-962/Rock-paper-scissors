export const CHANNEL_NAME = 'game_channel';
export const STORAGE_KEY = 'players_list';
export const WAIT_QUEUE_KEY = 'waiting_queue';
export const CURRENT_PLAYER_KEY = 'current_player';

export const GAME_OPTIONS = [
  { name: 'Rock', emoji: '🪨' },
  { name: 'Paper', emoji: '📄' },
  { name: 'Scissors', emoji: '✂️' }
];

export const PLAYER_STATUS = {
  IDLE: 'idle',
  IN_GAME: 'in-game'
};

export const PLAYER_STATUS_LABELS = {
  [PLAYER_STATUS.IDLE]: 'Idle',
  [PLAYER_STATUS.IN_GAME]: 'In-Game'
};
