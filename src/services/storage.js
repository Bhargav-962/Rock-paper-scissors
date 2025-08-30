import { CURRENT_PLAYER_KEY, PLAYERS_LIST } from '../constants';

export function getPlayerListFromStorage() {
  try {
    const raw = localStorage.getItem(PLAYERS_LIST);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getCurrentPlayerFromStorage() {
  try {
    const raw = sessionStorage.getItem(CURRENT_PLAYER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCurrentPlayerToStorage(player) {
  try {
    sessionStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(player));
  } catch {}
}

export function removeCurrentPlayerFromStorage() {
  try {
    sessionStorage.removeItem(CURRENT_PLAYER_KEY);
  } catch {}
}

export function savePlayerListToStorage(players) {
  try {
    localStorage.setItem(PLAYERS_LIST, JSON.stringify(players));
  } catch {}
}

export function removePlayerById(id) {
  try {
    const current = getPlayerListFromStorage();
    const updated = current.filter((p) => p.id !== id);
    savePlayerListToStorage(updated);
    return updated;
  } catch {
    return getPlayerListFromStorage();
  }
}
