export interface Player {
  player_id: number;
  player_name: string;
  offensive_rating: number;
  games_played: number;
  efficiency_score: number;
  points: number;
  assists: number;
  "free_throws_%": number;
  "transition_attacks_%": number;
  "isolation_%": number;
  "drives_%": number;
  "pick-n-pops_%": number;
  "2-pt_field_goals_attempted": number;
  "2-pt_field_goals_made": number;
  "3-pt_field_goals_attempted": number;
  "3-pt_field_goals_made": number;
  assists_to_turnovers: number;
  blocks: number;
  catch_and_drive_attempted: number;
  catch_and_drive_made: number;
  catch_and_shoot_attempted: number;
  catch_and_shoot_made: number;
  contested_field_goals: number;
  contested_field_goals_made: number;
  cuts_attempted: number;
  cuts_made: number;
  defensive_rating: number;
  defensive_rebounds: number;
  deflections: number;
  draw_foul_rate: number;
  drives_made: number;
  drives_with_shot: number;
  effective_field_goal_percentage: number;
  field_goals_attempted: number;
  field_goals_made: number;
  fouls: number;
  fouls_drawn: number;
  free_throws_attempted: number;
  free_throws_made: number;
  hand_off_attempted: number;
  hand_off_made: number;
  isolations_attempted: number;
  isolations_made: number;
  jersey_number: number;
  left_drives: number;
  left_drives_made: number;
  minutes: string;
  net_rating: number;
  number_of_player_possessions: number;
  offensive_rebounds: number;
  opp_catch_and_drive_shots: number;
  opp_catch_and_drive_shots_made: number;
  opp_catch_and_shoot_shots: number;
  opp_catch_and_shoot_shots_made: number;
  opp_cuts_shots: number;
  opp_cuts_shots_made: number;
  opp_drives_shots: number;
  opp_drives_shots_made: number;
  opp_hand_off_shots: number;
  opp_hand_off_shots_made: number;
  opp_isolations_shots: number;
  opp_isolations_shots_made: number;
  opp_pick_n_pop_shots: number;
  opp_pick_n_pop_shots_made: number;
  opp_pick_n_roll_shots: number;
  opp_pick_n_roll_shots_made: number;
  opp_post_up_shots: number;
  opp_post_up_shots_made: number;
  opp_screens_off_shots: number;
  opp_screens_off_shots_made: number;
  opp_transition_shots: number;
  opp_transition_shots_made: number;
  opponent_field_goals_attempted: number;
  opponent_field_goals_made: number;
  opponent_points_with_player: number;
  opponent_possessions_played: number;
  plus_minus: number;
  pnp_attempted: number;
  pnp_made: number;
  pnr_handlers_attempted: number;
  pnr_handlers_made: number;
  pnr_rollers_attempted: number;
  pnr_rollers_made: number;
  points_off_assists: number;
  points_off_screen_assists: number;
  points_per_player_possession: number;
  posts_up_attempted: number;
  posts_up_made: number;
  rebounds: number;
  right_drives: number;
  right_drives_made: number;
  screen_assist: number;
  screens_off_attempted: number;
  screens_off_made: number;
  season: string;
  steals: number;
  steals_to_turnovers: number;
  team_points_with_player: number;
  transitions_attempted: number;
  transitions_made: number;
  true_shooting_percentage: number;
  turnovers: number;
  uncontested_field_goals: number;
  uncontested_field_goals_made: number;
  off_score_1: number;
  off_score_2: number;
  off_score_3: number;
  def_score: number;
  reb_score: number;
}

export interface ProjectedPlayer {
  player_id: number;
  x: number;
  y: number;
}
export interface OrderKeyValuePair {
  key: string;
  value: (keyof Player);
}

// Define the ordered key-value pairs
export const orderKeyValues: OrderKeyValuePair[] = [
  { key: "Off 1", value: "off_score_1" },
  { key: "Off 2", value: "off_score_2" },
  { key: "Off 3", value: "off_score_3" },
  { key: "Defense", value: "def_score" },
  { key: "Rebounds", value: "reb_score" },
];

export const playerKeys: (keyof Player)[] = [
  "efficiency_score",
  "player_id",
  "player_name",
  "offensive_rating",
  "defensive_rating",
  "games_played",
  "points",
  "jersey_number",
  "assists",
  "free_throws_%",
  "transition_attacks_%",
  "isolation_%",
  "drives_%",
  "pick-n-pops_%",
  "2-pt_field_goals_attempted",
  "2-pt_field_goals_made",
  "3-pt_field_goals_attempted",
  "3-pt_field_goals_made",
  "assists_to_turnovers",
  "blocks",
  "catch_and_drive_attempted",
  "catch_and_drive_made",
  "catch_and_shoot_attempted",
  "catch_and_shoot_made",
  "contested_field_goals",
  "contested_field_goals_made",
  "cuts_attempted",
  "cuts_made",
  "defensive_rating",
  "defensive_rebounds",
  "deflections",
  "draw_foul_rate",
  "drives_made",
  "drives_with_shot",
  "effective_field_goal_percentage",
  "field_goals_attempted",
  "field_goals_made",
  "fouls",
  "fouls_drawn",
  "free_throws_attempted",
  "free_throws_made",
  "hand_off_attempted",
  "hand_off_made",
  "isolations_attempted",
  "isolations_made",
  "jersey_number",
  "left_drives",
  "left_drives_made",
  "minutes",
  "net_rating",
  "number_of_player_possessions",
  "offensive_rebounds",
  "opp_catch_and_drive_shots",
  "opp_catch_and_drive_shots_made",
  "opp_catch_and_shoot_shots",
  "opp_catch_and_shoot_shots_made",
  "opp_cuts_shots",
  "opp_cuts_shots_made",
  "opp_drives_shots",
  "opp_drives_shots_made",
  "opp_hand_off_shots",
  "opp_hand_off_shots_made",
  "opp_isolations_shots",
  "opp_isolations_shots_made",
  "opp_pick_n_pop_shots",
  "opp_pick_n_pop_shots_made",
  "opp_pick_n_roll_shots",
  "opp_pick_n_roll_shots_made",
  "opp_post_up_shots",
  "opp_post_up_shots_made",
  "opp_screens_off_shots",
  "opp_screens_off_shots_made",
  "opp_transition_shots",
  "opp_transition_shots_made",
  "opponent_field_goals_attempted",
  "opponent_field_goals_made",
  "opponent_points_with_player",
  "opponent_possessions_played",
  "plus_minus",
  "pnp_attempted",
  "pnp_made",
  "pnr_handlers_attempted",
  "pnr_handlers_made",
  "pnr_rollers_attempted",
  "pnr_rollers_made",
  "points_off_assists",
  "points_off_screen_assists",
  "points_per_player_possession",
  "posts_up_attempted",
  "posts_up_made",
  "rebounds",
  "right_drives",
  "right_drives_made",
  "screen_assist",
  "screens_off_attempted",
  "screens_off_made",
  "season",
  "steals",
  "steals_to_turnovers",
  "team_points_with_player",
  "transitions_attempted",
  "transitions_made",
  "true_shooting_percentage",
  "turnovers",
  "uncontested_field_goals",
  "uncontested_field_goals_made"
];

export type PlayerArray = Player[];
