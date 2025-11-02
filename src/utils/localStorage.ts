import type { Player } from '../types';

const STORAGE_KEYS = {
  PLAYERS: 'players',
  EVENTS: 'events',
  TEAMS: 'teams',
  INVITATIONS: 'invitations',
} as const;

// Generic localStorage utility functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
}

// Player-specific localStorage functions
export function getPlayers(): Player[] {
  return getFromStorage(STORAGE_KEYS.PLAYERS, []);
}

export function savePlayers(players: Player[]): boolean {
  return saveToStorage(STORAGE_KEYS.PLAYERS, players);
}

export function addPlayer(player: Player): boolean {
  const players = getPlayers();
  const updatedPlayers = [...players, player];
  return savePlayers(updatedPlayers);
}

export function updatePlayer(playerId: string, updates: Partial<Omit<Player, 'id'>>): boolean {
  const players = getPlayers();
  const playerIndex = players.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1) {
    console.error(`Player with id ${playerId} not found`);
    return false;
  }
  
  const updatedPlayers = [...players];
  updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], ...updates };
  return savePlayers(updatedPlayers);
}

export function deletePlayer(playerId: string): boolean {
  const players = getPlayers();
  const filteredPlayers = players.filter(p => p.id !== playerId);
  return savePlayers(filteredPlayers);
}

export function getPlayerById(playerId: string): Player | null {
  const players = getPlayers();
  return players.find(p => p.id === playerId) || null;
}