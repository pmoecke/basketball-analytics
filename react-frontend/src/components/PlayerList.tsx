import React, { useState, useEffect } from "react";

import { Player, PlayerArray } from "../types/player";
import PlayerModal from "./PlayerModal";
import "./PlayerList.css";
import { playerStats } from "../router/data"

import Filter from './Filter';
import Order from './Order';

const PlayerList: React.FC = () => {
  
  const [players, setPlayers] = useState<PlayerArray>([]);
  const [sortOrder, setSortOrder] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [playerName, setPlayerName] = useState<string>("");
  const [league, setLeague] = useState<string>("");
  const [team, setTeam] = useState<string>("");
  const leagueOptions = [
    { value: 'Basket League', label: 'Basket League' },
    { value: 'LEB Oro', label: 'LEB Oro' },
  ];
  const teamOptions = [
    { value: 'Larisa BC', label: 'Larisa BC' },
    { value: 'Olympiacos BC', label: 'Olympiacos BC' }
  ];

  useEffect(() => {
    playerStats({ league, team, playerName }).then(exampleData => { 
      if (exampleData !== undefined) {
        console.log(exampleData[0])
        console.log(exampleData)
        setPlayers(exampleData);
      }
    });
  }, [league, team, playerName]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setPlayerName(value);
  };

  return (
    <div className="container">
      <div className={`row justify-content-evenly ${showModal ? 'blur-background' : ''}`}>
        <div className="filter col-md-3 box">
            <Filter label="League" value={league} onChange={setLeague} options={leagueOptions} />
            <Filter label="Team" value={team} onChange={setTeam} options={teamOptions} />
            <Order sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>
        <div className="player-search col-md-8 box">
          <input
            className="form-control search mb-3"
            type="text"
            placeholder="Search for players..."
            value={playerName}
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
