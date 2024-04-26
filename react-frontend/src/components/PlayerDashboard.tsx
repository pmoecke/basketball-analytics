import React, { useState, useEffect, useCallback} from "react";
import { Tab, Tabs } from 'react-bootstrap';

import { Player, PlayerArray } from "../types/player";
import PlayerList from "./PlayerList";
import Player2DView from "./Player2DView"
import PlayerModal from "./PlayerModal";
import "./PlayerDashboard.css";
import PlayerSearch from "./PlayerSearch"
import { playerStats, PlayerStatsParams } from "../router/data"

import Filter from './Filter';
import Order from './Order';
import PlayerFilter from "./PlayerFilter";
import ComparisonView from "./ComparisonVIew";

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
  // Compare player
  const [comparisonPlayers, setComparisonPlayers] = useState<Player[]>([]);
  // Filtering
  const [player_search, setPlayer_search] = useState("");
  const [player_name, setPlayer_name] = useState<string | undefined>(undefined);
  const [league_id, setLeague_id] = useState<number | undefined>(undefined);
  const [team_id, setTeam_id] = useState<number | undefined>(undefined);
  // Tabs
  const [activeKey, setActiveKey] = useState('list');

  // Function to handle tab selection change
  const handleSelect = (key: string | null) => key && setActiveKey(key);

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
      params.league_id = league_id;
      params.team_id = team_id;
      params.player_name = player_name;
    
    playerStats(params).then(data => {
      if (data !== undefined) {
        console.log(data); 
        setPlayers(data);
      }
    });
  }, [league_id, team_id, player_name]);

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


  const togglePlayerForComparison = (player: Player) => {
    if (comparisonPlayers.length < 2 && !comparisonPlayers.find(p => p.player_id === player.player_id)) {
        setComparisonPlayers([...comparisonPlayers, player]);
    }
    else {
      setComparisonPlayers(comparisonPlayers.filter(p => p.player_id !== player.player_id));
    }
  };

  useEffect(() => {
    console.log(comparisonPlayers)
  }, [comparisonPlayers])


  return (
    <div className="container">
      <div className={`row justify-content-evenly ${showModal ? 'blur-background' : ''}`}>
        <div className="col-md-3 box">
          <h1 className="fs-3 text-center white">General Filter</h1>
          <div className="filter">
            <Filter label="League" value={league_id} onChange={setLeague_id} options={leagueOptions} />
            <Filter label="Team" value={team_id} onChange={setTeam_id} options={teamOptions} />
          </div>
          <h1 className="fs-3 text-center white">Player Filter</h1>
          <div className="pentagon">
              <PlayerFilter min={min} max={max}/>
          </div>
          <h1 className="fs-3 text-center white">Ordering</h1>
          <div className="order">
            <Order sortOrder={sortOrder} setSortOrder={setSortOrder} orderValue={orderValue} setOrderValue={setOrderValue} />
          </div>
        </div>
        <div className="player-search col-md-6 box">
          <PlayerSearch setPlayer_name={setPlayer_name}/>
          <Tabs activeKey={activeKey} onSelect={handleSelect} className="mb-3">
            <Tab eventKey="list" title="Player List">
              <PlayerList players={players} setSelectedPlayer={setSelectedPlayer} setShowModal={setShowModal} togglePlayerForComparison={togglePlayerForComparison} comparisonPlayers={comparisonPlayers}/>
            </Tab>
            <Tab eventKey="view" title="Player 2D View">
              <Player2DView players={players} setSelectedPlayer={setSelectedPlayer} setShowModal={setShowModal}/>
            </Tab>
          </Tabs>
          <div className="fs-5 text-center white mt-3">Results: {players.length}</div>
        </div>
          <ComparisonView comparisonPlayers={comparisonPlayers} togglePlayerForComparison={togglePlayerForComparison}/>
        </div>
        <PlayerModal
          selectedPlayer={selectedPlayer}
          showModal={showModal}
          handleClose={() => setShowModal(false)}
        />
    </div>
  );
};

export default PlayerDashboard;
