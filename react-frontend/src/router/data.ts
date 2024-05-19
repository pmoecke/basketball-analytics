import { PlayerArray, ProjectedPlayer } from '../types/player';
import axiosClient from './apiClient'

export interface PlayerStatsParams {
    league_id?: number;
    team_id?: number;
    player_name?: string;
  }
  
export function playerStats(params: PlayerStatsParams): Promise<PlayerArray | undefined> {
  const url = `stats`; // Endpoint relative to the BASE_URL
  console.log(params)
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

export interface PlayerOverviewParams {
  league_id?: number;
  team_id?: number;
  player_name?: string;
}

export function playerOverview(params: PlayerOverviewParams): Promise<PlayerArray | undefined> {
  const url = `overview-stats`; // Endpoint relative to the BASE_URL
  console.log(params)
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

export interface PlayerStatsFromIdParams {
  player_id?: number;
}

export function playerStatsFromId(params: PlayerStatsFromIdParams): Promise<PlayerArray | undefined> {
  const url = 'stats'; // Endpoint relative to the BASE_URL
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

export interface PlayerProjectionParams {
  player_id?: number[];
  projections?: string | undefined;
}



export function playerProjection(params: PlayerProjectionParams): Promise<ProjectedPlayer[] | undefined> {
  const url = 'projection'; // Endpoint relative to the BASE_URL
  console.log(params)
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