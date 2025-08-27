import { STORAGE_KEY } from '../constants';

export function getPlayers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePlayers(players) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
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
