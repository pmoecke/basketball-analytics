import React, { useState, useEffect } from "react";

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

  const [player_id, setPlayerName] = useState<number | null>(null);
  const [league_id, setLeague] = useState<number | null>(null);
  const [team_id, setTeam] = useState<number | null>(null);
  const leagueOptions = [
    { value: 1, label: 'Basket League' },
    { value: 2, label: 'LEB Oro' },
  ];
  const teamOptions = [
    { value: 1, label: 'Larisa BC' },
    { value: 4, label: 'Olympiacos BC' }
  ];

  useEffect(() => {
    const params: Partial<PlayerStatsParams> = {}; // Ensuring TypeScript knows what keys might exist on this object
    if (league_id !== null) params.league_id = league_id;
    if (team_id !== null) params.team_id = team_id;
    if (player_id !== null) params.player_id = player_id;

    playerStats(params).then(data => {
      if (data !== undefined) {
        console.log(data[0]); // Logging the first item if exists
        setPlayers(data);
      }
    });
  }, [league_id, team_id, player_id]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const player_name = event.target.value;
    if (player_name) {
      getPlayerId({ player_name }).then(ids => {
        if (ids) {
          console.log(ids);
          // Assuming you might want to handle multiple player IDs, handle it accordingly
        }
      });
    }
  };

  return (
    <div className="container">
      <div className={`row justify-content-evenly ${showModal ? 'blur-background' : ''}`}>
        <div className="filter col-md-3 box">
            <Filter label="League" value={league_id} onChange={setLeague} options={leagueOptions} />
            <Filter label="Team" value={team_id} onChange={setTeam} options={teamOptions} />
            <Order sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>
        <div className="player-search col-md-8 box">
          <input
            className="form-control search mb-3"
            type="text"
            placeholder="Search for players..."
            value=""
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
                {player.player_id}, {player["Player name"]}, {player["Team name"]}, {player.League}
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
