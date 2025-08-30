import { PLAYERS_LIST } from '../constants';

export function getPlayers() {
  try {
    const raw = localStorage.getItem(PLAYERS_LIST);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePlayers(players) {
  try {
    localStorage.setItem(PLAYERS_LIST, JSON.stringify(players));
  } catch {}
}

export function removePlayerById(id) {
  try {
    const current = getPlayers();
    const updated = current.filter((p) => p.id !== id);
    savePlayers(updated);
    return updated;
  } catch {
    return getPlayers();
  }
}
