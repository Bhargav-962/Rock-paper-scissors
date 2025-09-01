// simple id generator - no external deps
export const generateRandomId = () =>
  'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7);


export const findPlayerById = (players, playerId) => {
  return players.find(player => player.id === playerId);
};
