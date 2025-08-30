import { getCurrentPlayerFromStorage, getPlayerListFromStorage } from "../services/storage";
import { DESTROY_ACTIVE_GAME, RESET_ROUND, SET_CURRENT_PLAYER, SET_PLAYER_LIST, UPDATE_PARTICIPANTS_LIST, UPDATE_USER_CHOICES, UPDATE_USER_RESULT } from "./types";

const activeGameInitial = {
    participants: [],
    choices: {},
    result: null
};

export const initialState = {
    players: getPlayerListFromStorage(),
    currentPlayer: getCurrentPlayerFromStorage(),
    activeGame: activeGameInitial
};

export const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PLAYER_LIST:
            return { ...state, players: action.payload };

        case SET_CURRENT_PLAYER:
            return { ...state, currentPlayer: action.payload };

        case UPDATE_PARTICIPANTS_LIST:
            return {
                ...state,
                activeGame: { ...state.activeGame, participants: action.payload }
            };

        case DESTROY_ACTIVE_GAME:
            return { ...state, activeGame: activeGameInitial };

        case UPDATE_USER_CHOICES:
            return {
                ...state,
                activeGame: { ...state.activeGame, choices: action.payload }
            };

        case UPDATE_USER_RESULT:
            return {
                ...state,
                activeGame: { ...state.activeGame, result: action.payload }
            };
        case RESET_ROUND:
            return {
                ...state,
                activeGame: { ...state.activeGame, choices: {}, result: null }
            };
        default:
            return state;
    }
};
