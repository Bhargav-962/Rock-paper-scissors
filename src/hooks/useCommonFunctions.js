import { removeCurrentPlayerFromStorage, removePlayerById, saveCurrentPlayerToStorage, savePlayerListToStorage } from "../services/storage";
import { broadcastChoiceSubmitted, broadcastPlayerListUpdate, broadcastResetRound, broadcastStartGame, broadcastExitGame } from "../utils/broadcast";
import { PLAYER_STATUS } from "../constants";
import {
  updatePlayersList,
  updateCurrentPlayer,
  updateGameParticipants,
  destroyCurrentGame,
  updateUserChoices,
  updateUserResult,
  resetGameState
} from "../actions/gameActions";

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

export function useCommonFunctions(state, dispatch, channel) {
  const { currentPlayer, players, activeGame } = state;

  const updatePlayerList = (players) => {
    savePlayerListToStorage(players);
    updatePlayersList(dispatch)(players);
    // Updates the player list across other tabs
    broadcastPlayerListUpdate(channel, players);
  };

  const playGame = (opponent) => {
    if (!currentPlayer || !opponent) return;
    // Start the game with current player and opponent
    const participants = [currentPlayer, opponent];
    const updatedParticipantsList = participants.map(player => {
      return { ...player, status: PLAYER_STATUS.IN_GAME };
    });

    // Notify other tabs about the game start
    broadcastStartGame(channel, updatedParticipantsList);
    const updatedPlayersList = players.map(player =>
      updatedParticipantsList.find(p => p.id === player.id) || player
    );
    updatePlayerList(updatedPlayersList); // Update status for active participants
    updateCurrentPlayer(dispatch)(updatedParticipantsList[0]);
    updateGameParticipants(dispatch)(updatedParticipantsList);
  };

  // Updates player list for current user and broadcasts it to other users
  const registerPlayer = (player) => {
    saveCurrentPlayerToStorage(player);
    updateCurrentPlayer(dispatch)(player);
    updatePlayerList([...players, player]);
  };

  const logout = () => {
    if (!currentPlayer) return;
    const updated = removePlayerById(currentPlayer.id);
    broadcastPlayerListUpdate(channel, updated);
    removeCurrentPlayerFromStorage();
    updateCurrentPlayer(dispatch)(null);
    destroyCurrentGame(dispatch)();
  };

  const computeResultsBasedOnChoices = (newChoices) => {
    const [a, b] = activeGame.participants;
    let finalResult = decideWinner(a.id, newChoices[a.id], b.id, newChoices[b.id]);
    if (finalResult !== 'draw') {
      const updatedPlayers = players.map((pl) =>
        pl.id === finalResult ? { ...pl, score: (pl.score || 0) + 1 } : pl
      );
      updatePlayerList(updatedPlayers);
    }
    updateUserResult(dispatch)(finalResult);
    return finalResult;
  };

  const submitChoice = (playerId, choice) => {
    let finalResult = null;
    const newChoices = { ...(activeGame.choices || {}), [playerId]: choice };

    updateUserChoices(dispatch)(newChoices);
    if (Object.keys(newChoices).length === 2) {
      finalResult = computeResultsBasedOnChoices(newChoices);
    }
    // Broadcast the choice submission to other tabs
    broadcastChoiceSubmitted(channel, newChoices, finalResult);
  };

  const resetRound = () => {
    resetGameState(dispatch)();
    broadcastResetRound(channel);
  };

  const exitGame = () => {
    if (!activeGame.participants.length) return;
    const [p1, p2] = activeGame.participants;
    const updated = players.map((p) =>
      p.id === p1.id || p.id === p2.id ? { ...p, status: PLAYER_STATUS.IDLE } : p
    );
    updatePlayerList(updated);
    destroyCurrentGame(dispatch)();
    broadcastExitGame(channel, [p1, p2]);
  };

  return {
    registerPlayer,
    logout,
    playGame,
    submitChoice,
    resetRound,
    exitGame,
  };
}
