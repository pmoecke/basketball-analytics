export interface Player {
  player_id: number;
  "player-name": string;
  "free_throws_%": number;
  "transition_attacks_%": number;
  "isolation_%": number;
  "drives_%": number;
  "pick-n-pops_%": number;
  points: number;
  jersey_number: number;
}

export type PlayerArray = Player[];