import { PlayerArray } from '../types/player';
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

  export interface PlayerOverviewParams {
    league_id?: number;
    team_id?: number;
    player_name?: string;
  }
  
  export function playerOverview(params: PlayerStatsParams): Promise<PlayerArray | undefined> {
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
      });
  }

  export interface getPlayerIdParams {
    player_name?: string;
  }

  export function getPlayerId(params: getPlayerIdParams): Promise<PlayerIdNamePair[] | undefined> {
    const url = `players`;
    console.log(params)
    // Use axiosClient with the existing parameters object (url, { params })
    return axiosClient.get<PlayerIdNamePair[]>(url, { params })
      .then(response => {
        if (response.status !== 204) {
          return response.data;
        }
        return undefined;
      })
      .catch(error => {
        console.error('Error fetching player ids:', error);
        throw error;
      });
  }