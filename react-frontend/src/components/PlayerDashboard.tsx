import React, { useState, useEffect, useCallback} from "react";
import { debounce } from 'lodash';

import { Player, PlayerArray } from "../types/player";
import PlayerList from "./PlayerList";
import PlayerModal from "./PlayerModal";
import "./PlayerDashboard.css";
import PlayerSearch from "./PlayerSearch"
import { playerStats, PlayerStatsParams, getPlayerId, getPlayerIdParams } from "../router/data"

import Filter from './Filter';
import Order from './Order';

const PlayerDashboard: React.FC = () => {
  // Player data
  const [players, setPlayers] = useState<PlayerArray>([]);
  const [sortedPlayers, setSortedPlayers] = useState<PlayerArray>([]);
  // Ordering
  const [sortOrder, setSortOrder] = useState("desc");
  const [orderValue, setOrderValue] = useState<keyof Player>("points");
  // View player
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  // Filtering
  const [player_search, setPlayer_search] = useState("");
  const [player_id, setPlayer_id] = useState<number[] | null>(null); // Is set by the player name search
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
  // Handles general player filtering
  useEffect(() => {
    const params: Partial<PlayerStatsParams> = {};
    if (league_id !== null) params.league_id = league_id;
    if (team_id !== null) params.team_id = team_id;
    if (player_id !== null) params.player_id = player_id;
    
    playerStats(params).then(data => {
      if (data !== undefined) {
        console.log(data); 
        setPlayers(data);
      }
    });
  }, [league_id, team_id, player_id]);

  // Handles ordering of the data
  useEffect(() => {
    console.log({orderValue})
    console.log({sortOrder})
    let sortedData = [...players];
    sortedData.sort((a, b) => {
      const keyA = a[orderValue];
      const keyB = b[orderValue];
      if (typeof keyA === "number" && typeof keyB === "number") {
        return sortOrder === "asc" ? keyA - keyB : keyB - keyA;
      } else if (typeof keyA === "string" && typeof keyB === "string") {
        return sortOrder === "asc" ? keyA.localeCompare(keyB) : keyB.localeCompare(keyA);
      }
      return 0;
    });
    
    setSortedPlayers(sortedData);
  }, [players, sortOrder, orderValue]);
  
  // Adds delay in ms when writing a new search so doesnt send several request to API

  return (
    <div className="container">
      <div className={`row justify-content-evenly ${showModal ? 'blur-background' : ''}`}>
        <div className="col-md-3 box">
          <h1 className="fs-3 white">General Filter</h1>
          <div className="filter">
            <Filter label="League" value={league_id} onChange={setLeague_id} options={leagueOptions} />
            <Filter label="Team" value={team_id} onChange={setTeam_id} options={teamOptions} />
          </div>
          <h1 className="fs-3 white">Player Filter</h1>
          <div className="pentagon">
          </div>
          <h1 className="fs-3 white">Ordering</h1>
          <div className="order">
            <Order sortOrder={sortOrder} setSortOrder={setSortOrder} orderValue={orderValue} setOrderValue={setOrderValue} />
          </div>
        </div>
        <div className="player-search col-md-8 box">
          <PlayerSearch setPlayerId={setPlayer_id}/>
          <PlayerList players={players} setSelectedPlayer={setSelectedPlayer} setShowModal={setShowModal}/>
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

export default PlayerDashboard;
