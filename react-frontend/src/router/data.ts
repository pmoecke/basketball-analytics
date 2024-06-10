import { PlayerArray, ProjectedPlayer } from '../types/player';
import axiosClient from './apiClient'

export interface PlayerStatsFromIdParams {
  player_id?: number[];
}

// Gets all the player stats for multiple players
export function playerStatsFromId(params: PlayerStatsFromIdParams): Promise<PlayerArray | undefined> {
  const url = 'stats'; // Endpoint relative to the BASE_URL
  console.log("Params being sent to stats: ", params)
  return axiosClient.get<PlayerArray>(url, { params })
    .then(response => {
      if (response.status !== 204) {
        return response.data;
      }
      return undefined;
    })
    .catch(error => {
      console.error('Error fetching player stats:', error);
      throw error;
    });
}

export interface PlayerOverviewParams {
  player_name?: string;
  season?: string;
  min_def_score?: number;
  max_def_score?: number;
  min_off_score_1?: number;
  max_off_score_1?: number;
  min_off_score_2?: number;
  max_off_score_2?: number;
  min_off_score_3?: number;
  max_off_score_3?: number;
  min_reb_score?: number; 
  max_reb_score?: number;
}

// Get the overview stats for multiple players
export function playerOverview(params: PlayerOverviewParams): Promise<PlayerArray | undefined> {
  const url = `overview-stats`; // Endpoint relative to the BASE_URL
  console.log("Params being sent to overview-stats: ", params)
  // Use axiosClient with the existing parameters object (url, { params })
  return axiosClient.get<PlayerArray>(url, { params })
    .then(response => {
      if (response.status !== 204) {
        return response.data;
      }
      return undefined;
    })
    .catch(error => {
      console.error('Error fetching player stats:', error);
      throw error;
    }
  );
}

export interface PlayerProjectionParams {
  player_id?: number[];
  projection?: string | undefined;
  col?: string[];
}

// Get the projections for multiple players
export function playerProjection(params: PlayerProjectionParams): Promise<ProjectedPlayer[] | undefined> {
  const url = 'projection'; // Endpoint relative to the BASE_URL
  console.log('Params being sent to projection', params)
  return axiosClient.get<any>(url, { params })
    .then(response => {
      if (response.status !== 204) {
        return response.data;
      }
      return undefined;
    })
    .catch(error => {
      console.error('Error fetching player stats:', error);
      throw error;
    });
}