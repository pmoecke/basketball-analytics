import React, { useState, useEffect, useCallback } from "react";
import { Tab, Tabs } from "react-bootstrap";

import { Player, PlayerArray } from "../types/player";
import PlayerList from "./PlayerList";
import Player2DView from "./Player2DView";
import PlayerModal from "./PlayerModal";
import "./PlayerDashboard.css";
import PlayerSearch from "./PlayerSearch";
import { playerStats, PlayerStatsParams, playerOverview, PlayerOverviewParams } from "../router/data";

import Filter from "./Filter";
import SidebarFilter from './SidebarFilter'; 
import Order from "./Order";
import FilterGraph from "./FilterGraph";
import ComparisonView from "./Comparison"

import ComparisonModal from "./ComparisonModal";

import AdvancedFilterModal from "./AdvancedFilterModal";

const PlayerDashboard: React.FC = () => {
  // Player data
  const [players, setPlayers] = useState<PlayerArray>([]);
  const [sortedPlayers, setSortedPlayers] = useState<PlayerArray>([]);
  // Ordering
  const [sortOrder, setSortOrder] = useState("desc");
  const [orderValue, setOrderValue] = useState<keyof Player>("efficiency_score");
  // View player
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  // Compare player
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonPlayers, setComparisonPlayers] = useState<Player[]>([]);
  // Filtering
  const [player_search, setPlayer_search] = useState("");
  const [player_name, setPlayer_name] = useState<string | undefined>(undefined);
  const [league_id, setLeague_id] = useState<number | undefined>(undefined);
  const [team_id, setTeam_id] = useState<number | undefined>(undefined);

  // Toggle sidebar
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Tabs
  const [activeKey, setActiveKey] = useState("list");

  // Function to handle tab selection change
  const handleSelect = (key: string | null) => key && setActiveKey(key);

  //Advanced Filtering
  const [showAdvancedFilterModal, setShowAdvancedFilterModal] = useState(false);

  // Handles general player filtering
  useEffect(() => {
    const params: Partial<PlayerOverviewParams> = {};
    params.league_id = league_id;
    params.team_id = team_id;
    params.player_name = player_name;

    playerOverview(params).then((data) => {
      if (data !== undefined) {
        console.log(data);
        setPlayers(data);
      }
    });
  }, [league_id, team_id, player_name]);

  // Handles ordering of the data
  useEffect(() => {
    console.log({ orderValue });
    console.log({ sortOrder });
    let sortedData = [...players];
    sortedData.sort((a, b) => {
      const keyA = a[orderValue];
      const keyB = b[orderValue];
      if (typeof keyA === "number" && typeof keyB === "number") {
        return sortOrder === "asc" ? keyA - keyB : keyB - keyA;
      } else if (typeof keyA === "string" && typeof keyB === "string") {
        return sortOrder === "asc"
          ? keyA.localeCompare(keyB)
          : keyB.localeCompare(keyA);
      }
      return 0;
    });

    setSortedPlayers(sortedData);
  }, [players, sortOrder, orderValue]);

  const togglePlayerForComparison = (player: Player) => {
    if (
      comparisonPlayers.length < 2 &&
      !comparisonPlayers.find((p) => p.player_id === player.player_id)
    ) {
      setComparisonPlayers([...comparisonPlayers, player]);
    } else {
      setComparisonPlayers(
        comparisonPlayers.filter((p) => p.player_id !== player.player_id)
      );
    }
  };

  useEffect(() => {
    console.log(comparisonPlayers);
  }, [comparisonPlayers]);

  return (
    <div className="container m-3">
      <div
        className={`row justify-content-evenly ${
          showModal || showComparisonModal || showAdvancedFilterModal ? "blur-background" : ""
        }`}
      >
       <SidebarFilter
        showAdvancedFilterModal={showAdvancedFilterModal}
        setShowAdvancedFilterModal={setShowAdvancedFilterModal}
        league_id={league_id}
        setLeague_id={setLeague_id}
        team_id={team_id}
        setTeam_id={setTeam_id}
        isOpen={isOpen}
      />
        <div className="player-search col-md-11 box">
          <div className="row">
            <div className="col-md-4">
              <h1 className="fs-3 white">Search</h1>
              <PlayerSearch setPlayer_name={setPlayer_name} />
            </div>
            <div className="col-md-4">
              <Order
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                orderValue={orderValue}
                setOrderValue={setOrderValue}
              />
            </div>
            <div className="col-md-4">
              <h1 className="fs-3 white">Show Filters</h1>
              <button className={`btn ${isOpen ? 'btn-danger' : 'btn-success'}`} onClick={toggleSidebar}>
                  {isOpen ? 'False' : 'True'}
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
            <PlayerList
                players={sortedPlayers}
                setSelectedPlayer={setSelectedPlayer}
                setShowModal={setShowModal}
                togglePlayerForComparison={togglePlayerForComparison}
                comparisonPlayers={comparisonPlayers}
              />
              <ComparisonView
              comparisonPlayers={comparisonPlayers}
              togglePlayerForComparison={togglePlayerForComparison}
              setShowComparisonModal={setShowComparisonModal}
              />
            </div>
            <div className="col-md-6">
              <Player2DView
                  players={players}
                  setSelectedPlayer={setSelectedPlayer}
                  setShowModal={setShowModal}
                />
            </div>
          </div>
        </div>
        
      </div>
      <PlayerModal
        selectedPlayer={selectedPlayer}
        showModal={showModal}
        handleClose={() => setShowModal(false)}
      />
      <ComparisonModal
        players={comparisonPlayers}
        showModal={showComparisonModal}
        handleClose={() => setShowComparisonModal(false)}
      />
      <AdvancedFilterModal
        showModal={showAdvancedFilterModal}
        handleClose={() => setShowAdvancedFilterModal(false)}
      />
    </div>
  );
};

export default PlayerDashboard;
