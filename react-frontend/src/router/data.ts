import { PlayerArray } from '../types/player';
import { PlayerIdNamePair } from '../types/playerIdNamePair';
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
      });
  }