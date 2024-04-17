import { PlayerArray } from '../types/player';
import axiosClient from './apiClient'

interface PlayerStatsParams {
    league?: string;
    team?: string;
    playerName?: string;
  }
  
  export function playerStats(params: PlayerStatsParams): Promise<PlayerArray | undefined> {
    const url = `players`; // Endpoint relative to the BASE_URL
    console.log(params)
    // Use axiosClient with the existing parameters object (url, { params })
    return axiosClient.get<PlayerArray>(url)
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