import React, { useState, useEffect, useCallback} from "react";
import { debounce } from 'lodash';

import { Player, PlayerArray } from "../types/player";
import PlayerModal from "./PlayerModal";
import "./PlayerList.css";
import { playerStats, PlayerStatsParams, getPlayerId, getPlayerIdParams } from "../router/data"

import Filter from './Filter';
import Order from './Order';

const PlayerList: React.FC = () => {
  
  const [players, setPlayers] = useState<PlayerArray>([]);
  const [sortOrder, setSortOrder] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [player_search, setPlayer_search] = useState("");
  const [player_id, setPlayer_id] = useState<number[] | null>(null);
  const [league_id, setLeague_id] = useState<number | null>(null);
  const [team_id, setTeam_id] = useState<number | null>(null);
  const leagueOptions = [
    { value: 1, label: 'Basket League' },
    { value: 2, label: 'LEB Oro' },
  ];
  const teamOptions = [
    { value: 1, label: 'Larisa BC' },
    { value: 4, label: 'Olympiacos BC' }
  ];

  useEffect(() => {
    const params: Partial<PlayerStatsParams> = {};
    if (league_id !== null) params.league_id = league_id;
    if (team_id !== null) params.team_id = team_id;
    if (player_id !== null) params.player_id = player_id;
    
    playerStats(params).then(data => {
      if (data !== undefined) {
        console.log(data[0]);
        console.log(data); 
        setPlayers(data);
      }
    });
  }, [league_id, team_id, player_id]);

  const debouncedSearch = useCallback(debounce((playerName: string) => {
    getPlayerId({ player_name: playerName }).then(ids => {
      if (ids) {
          console.log(ids);
          setPlayer_id(ids)
      }
    });
  }, 500), []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setPlayer_search(value);
      debouncedSearch(value);
  };

  return (
    <div className="container">
      <div className={`row justify-content-evenly ${showModal ? 'blur-background' : ''}`}>
        <div className="col-md-3 box">
          <h1>Filter</h1>
          <div className="filter">
            <Filter label="League" value={league_id} onChange={setLeague_id} options={leagueOptions} />
            <Filter label="Team" value={team_id} onChange={setTeam_id} options={teamOptions} />
          </div>
          <h1>Pentagon</h1>
          <div className="pentagon">
          </div>
          <h1>Order</h1>
          <div className="order">
            <Order sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>
        </div>
        <div className="player-search col-md-8 box">
          <input
            className="form-control search mb-3"
            type="text"
            placeholder="Search for players..."
            value={player_search}
            onChange={handleSearch}
          />
          <ul className="player-list">
            {players.map((player, index) => (
              <li
                className="player-row"
                key={`${player.player_id}-${index}`}
                onClick={() => {
                  setSelectedPlayer(player); // Set the selected player
                  setShowModal(true); // Show the modal
                }}
              >
                id: {player.player_id}, points: {player.points}
              </li>
            ))}
          </ul>
        </div>
        <PlayerModal
          selectedPlayer={selectedPlayer}
          showModal={showModal}
          handleClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default PlayerList;
