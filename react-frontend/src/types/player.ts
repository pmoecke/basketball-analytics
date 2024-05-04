export interface Player {
  player_id: number;
  player_name: string;
  offensive_rating: number;
  defensive_rating: number;
  effective_field_goal_percentage: number;
  points: number;
  jersey_number: number;
  "free_throws_%": number;
  "transition_attacks_%": number;
  "isolation_%": number;
  "drives_%": number;
  "pick-n-pops_%": number;
}

export const playerKeys: (keyof Player)[] = [
  "effective_field_goal_percentage"
];

export type PlayerArray = Player[];