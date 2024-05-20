import React, { useState, useEffect } from "react";

import { Player, PlayerArray, ProjectedPlayer } from "../types/player";
import PlayerList from "./PlayerList";
import Player2DGraph from "./Player2DGraph";
import PlayerModal from "./PlayerModal";
import "./PlayerDashboard.css";
import PlayerSearch from "./PlayerSearch";
import {
  playerOverview,
  PlayerOverviewParams,
  PlayerProjectionParams,
} from "../router/data";

import SidebarFilter from "./SidebarFilter";
import Order from "./Order";
import Order2 from "./Order2";
import FilterGraph from "./FilterGraph";
import ComparisonView from "./Comparison";
import ComparisonModal from "./ComparisonModal";

import AdvancedFilterModal from "./AdvancedFilterModal";
import TooltipOverlay from "./TooltipOverlay";
import ProjectionDropdown from "./projectionDropdown"
import { playerProjection } from "../router/data";



const PlayerDashboard: React.FC = () => {
  // Player data
  const [players, setPlayers] = useState<PlayerArray>([]);
  const [sortedPlayers, setSortedPlayers] = useState<PlayerArray>([]);
  // Ordering
  const [sortOrder, setSortOrder] = useState("desc");
  const [orderValue, setOrderValue] =
    useState<keyof Player>("efficiency_score");
  // View player
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  // Compare player
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonPlayers, setComparisonPlayers] = useState<Player[]>([]);
  // Highlight player
  const [highlightedPlayer, setHighlightedPlayer] = useState<Player | null>(
    null
  );

  // Filtering
  const [player_search, setPlayer_search] = useState("");
  const [player_name, setPlayer_name] = useState<string | undefined>(undefined);
  const [league_id, setLeague_id] = useState<number | undefined>(undefined);
  const [team_id, setTeam_id] = useState<number | undefined>(undefined);

  // Projections
  const [projection, setProjection] = useState<string | undefined>("boxscore");
  const [playerProjections, setPlayerProjections] = useState<ProjectedPlayer[]>([]);

  // Toggle sidebar
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  //Advanced Filtering
  const [showAdvancedFilterModal, setShowAdvancedFilterModal] = useState(false);

  function totalMinutesPlayed(timeStr: string, games_played: number): number {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    var avgMinutesPlayed = (minutes * 60 + seconds) / 60;
    var totalMinutesPlayed = avgMinutesPlayed * games_played
    return totalMinutesPlayed
  }
  
  // Handles general player filtering
  useEffect(() => {
    const params: Partial<PlayerOverviewParams> = {};
    params.league_id = league_id;
    params.team_id = team_id;
    params.player_name = player_name;

    playerOverview(params).then((data) => {
      if (data !== undefined) {
        
        console.log("before", data);
        data = data.filter(player => totalMinutesPlayed(player.minutes, player.games_played) >= 230);
        console.log("after", data);
      
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

    // Take only the first 100 elements after sorting
    let top100Players = sortedData.slice(0, 100);
    const top100PlayerIds: number[] = top100Players.map(player => player.player_id);
    const params: Partial<PlayerProjectionParams> = {};
    params.player_id = top100PlayerIds;
    params.projections = projection;
    console.log(top100PlayerIds)
    if (top100PlayerIds.length != 0){
      // Update the state for player projections based on the filtered 100 sorted players
      playerProjection(params)
      .then(data => {
        if (data !== undefined) {
          console.log("projectedplayers", data);
          setPlayerProjections(data);
        }
      });
    }
    
    // Update state with only the first 100 sorted players
    setSortedPlayers(top100Players);
  }, [players, sortOrder, orderValue, projection]);

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
          showModal || showComparisonModal || showAdvancedFilterModal || isOpen
            ? "blur-background"
            : ""
        }`}
      >
        <div
          className="col-md-1"
          onClick={toggleSidebar}
          style={{ cursor: "pointer" }}
        >
          <TooltipOverlay
            tooltipText="Show Filter"
            placement="right"
            children={
              <button className={`btn sidebar-btn `}>
                {isOpen ? "Close Sidebar" : "〉"}
              </button>
            }
            showTitle={false}
          />
        </div>
        <div className="player-search col-md-11">
          <div className="row">
            <div className="col-md-8 mb-3">
              <div className="d-flex justify-content-between">
        <div className="flex-grow-1 ">
          <PlayerSearch setPlayer_name={setPlayer_name} />
        </div>
        <div>
          <Order2
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            orderValue={orderValue}
            setOrderValue={setOrderValue}
          />
        </div>
      </div>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-3">
            <ProjectionDropdown projection={projection} setProjection={setProjection}/>
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
                highlightedPlayer={highlightedPlayer}
                setHighlightedPlayer={setHighlightedPlayer}
              />
            </div>
            <div className="col-md-6">
              <Player2DGraph
                players={sortedPlayers}
                projectedPlayersData={playerProjections}
                comparisonPlayers={comparisonPlayers}
                setSelectedPlayer={setSelectedPlayer}
                setShowModal={setShowModal}
                highlightedPlayer={highlightedPlayer}
                setHighlightedPlayer={setHighlightedPlayer}
              />
            </div>
          </div>
          <div className="row">
            <ComparisonView
              comparisonPlayers={comparisonPlayers}
              togglePlayerForComparison={togglePlayerForComparison}
              setShowComparisonModal={setShowComparisonModal}
            />
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

      <SidebarFilter
        showAdvancedFilterModal={showAdvancedFilterModal}
        setShowAdvancedFilterModal={setShowAdvancedFilterModal}
        league_id={league_id}
        setLeague_id={setLeague_id}
        team_id={team_id}
        setTeam_id={setTeam_id}
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default PlayerDashboard;
