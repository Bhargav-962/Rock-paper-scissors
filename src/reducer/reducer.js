import { getCurrentPlayerFromStorage, getPlayerListFromStorage } from "../services/storage";
import { DESTROY_ACTIVE_GAME, RESET_ROUND, SET_CURRENT_PLAYER, SET_PLAYER_LIST, START_NEW_GAME, UPDATE_USER_CHOICES, UPDATE_USER_RESULT } from "./types";

const activeGameInitial = {
    participants: [],
    choices: {},
    result: null,
    gameId: null
};

export const initialState = {
    players: getPlayerListFromStorage(),
    currentPlayerId: getCurrentPlayerFromStorage(),
    activeGame: activeGameInitial
};

export const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PLAYER_LIST:
            return { ...state, players: action.payload };

        case SET_CURRENT_PLAYER:
            return { ...state, currentPlayerId: action.payload };
        case START_NEW_GAME:
            return {
                ...state,
                activeGame: {
                    ...state.activeGame,
                    participants: action.payload.participants,
                    gameId: action.payload.gameId
                }
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
