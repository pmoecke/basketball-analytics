export interface Player {
  player_id: number;
  "player-name": string;
  "free_throws_%": number;
  "transition_attacks_%": number;
  "isolation_%": number;
  "drives_%": number;
  "pick-n-pops_%": number;
  "2-pt_field_goals_attempted":number;
  "2-pt_field_goals_made":number;
  "3-pt_field_goals_attempted": number;
  "3-pt_field_goals_made": number;
  "assists": number;
  points: number;
  jersey_number: number;
}

export const playerKeys: (keyof Player)[] = [
  "player_id", "player-name", "free_throws_%", "transition_attacks_%", 
  "isolation_%", "drives_%", "pick-n-pops_%", "points", "jersey_number"
];

export type PlayerArray = Player[];