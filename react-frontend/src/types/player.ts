export interface Player {
  player_id: number;
  player_name: string;
  offensive_rating: number;
  defensive_rating: number;
  games_played: number;
  efficiency_score: number;
  points: number;
  jersey_number: number;
  assists: number;
  "free_throws_%": number;
  "transition_attacks_%": number;
  "isolation_%": number;
  "drives_%": number;
  "pick-n-pops_%": number;
  "2-pt_field_goals_attempted":number;
  "2-pt_field_goals_made":number;
  "3-pt_field_goals_attempted": number;
  "3-pt_field_goals_made": number;
}

export interface ProjectedPlayer {
  player_id: number;
  x: number;
  y: number;
}

export const playerKeys: (keyof Player)[] = [
  "efficiency_score"
];

export type PlayerArray = Player[];