export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  birthYear: number;
  score: number; // 1-5
}

export interface Team {
  id: string;
  name: string;
  maxPlayers: number;
  eventId: string;
}

export interface Invitation {
  id: string;
  playerId: string;
  eventId: string;
  status: 'open' | 'accepted' | 'declined';
}

export interface Event {
  id: string;
  name: string;
  date: string; // ISO date string
  startTime: string; // HH:MM format
  teams: Team[];
  invitations: Invitation[];
  selectedPlayers: string[]; // Player IDs
}

export interface PlayerSelection {
  playerId: string;
  teamId: string;
}