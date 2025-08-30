import {
  DESTROY_ACTIVE_GAME,
  RESET_ROUND,
  SET_CURRENT_PLAYER,
  SET_PLAYER_LIST,
  UPDATE_PARTICIPANTS_LIST,
  UPDATE_USER_CHOICES,
  UPDATE_USER_RESULT
} from "../reducer/types";

// Pure action creators that dispatch state updates
export const updatePlayersList = (dispatch) => (payload) => {
  dispatch({ type: SET_PLAYER_LIST, payload });
};

export const updateCurrentPlayer = (dispatch) => (payload) => {
  dispatch({ type: SET_CURRENT_PLAYER, payload });
};

export const updateGameParticipants = (dispatch) => (payload) => {
  dispatch({ type: UPDATE_PARTICIPANTS_LIST, payload });
};

export const destroyCurrentGame = (dispatch) => () => {
  dispatch({ type: DESTROY_ACTIVE_GAME });
};

export const updateUserChoices = (dispatch) => (payload) => {
  dispatch({ type: UPDATE_USER_CHOICES, payload });
};

export const updateUserResult = (dispatch) => (payload) => {
  dispatch({ type: UPDATE_USER_RESULT, payload });
};

export const resetGameState = (dispatch) => () => {
  dispatch({ type: RESET_ROUND });
};
