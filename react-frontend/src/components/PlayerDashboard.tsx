import React, { useState, useEffect } from "react";

import { Player, PlayerArray, ProjectedPlayer } from "../types/player";
import PlayerList from "./PlayerList";
import Player2DGraph from "./Player2DGraph";
import PlayerModal from "./PlayerModal";
import "./PlayerDashboard.css";

import {
  getPlayerScore,
  playerOverview,
  PlayerOverviewParams,
  PlayerProjectionParams,
  playerStatsFromId,
  PlayerStatsFromIdParams,
} from "../router/data";

import SidebarFilter from "./SidebarFilter";
import Order from "./Order";
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
  const [orderValue, setOrderValue] = useState<keyof Player>("efficiency_score");
  // View player
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedPlayerScore, setSelectedPlayerScore] = useState<any | null>(null);

  // Compare player
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonPlayers, setComparisonPlayers] = useState<Player[]>([]);
  // Highlight player
  const [highlightedPlayer, setHighlightedPlayer] = useState<Player | null>(null);

  // Filtering
  const [player_name, setPlayer_name] = useState<string | undefined>(undefined);
  const [league_id, setLeague_id] = useState<number | undefined>(undefined);
  const [team_id, setTeam_id] = useState<number | undefined>(undefined);
  const [playerFilterValues, setPlayerFilterValues] = useState<([number[], number[]]) | undefined>(undefined);

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
  }, [league_id, team_id, player_name]); // add playerFilterValues here later when in same table

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
    console.log("top100PlayerIds", top100PlayerIds)
    if (top100PlayerIds.length !== 0){
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

  useEffect(() => {
    if (selectedPlayer != null) {
      const params: Partial<PlayerStatsFromIdParams> = {};
      params.player_id = [selectedPlayer!.player_id]
      getPlayerScore(params).then(data => {
        if (data !== undefined) {
          var score = data[0]
          //console.log("player score", score);
          setSelectedPlayerScore(score);
        }
      });
    }
  }, [selectedPlayer]);


  useEffect(() => {
    if (playerFilterValues != null) {
      const params: Partial<PlayerStatsFromIdParams> = {};
      // top, right, bottom right, left bottom, left
      // off2, off3, reb, def, off1
      console.log("playerFilterValues", playerFilterValues)
      params.min_def_score = playerFilterValues[0][3]
      params.max_def_score = playerFilterValues[1][3]
      params.min_off_score_1 = playerFilterValues[0][4]
      params.max_off_score_1 = playerFilterValues[1][4]
      params.min_off_score_2 = playerFilterValues[0][0]
      params.max_off_score_2 = playerFilterValues[1][0]
      params.min_off_score_3 = playerFilterValues[0][1]
      params.max_off_score_3 = playerFilterValues[1][1]
      params.min_reb_score = playerFilterValues[0][2]
      params.max_reb_score = playerFilterValues[1][2]
      getPlayerScore(params).then(data => {
        if (data !== undefined && data!.length !== 0) {
          console.log(data)
          const playerIds = data.map(player => player.player_id);
          console.log("playerIds", playerIds);
          
          const params1: Partial<PlayerStatsFromIdParams> = { player_id: playerIds }; // Initialize params1 properly
          
          playerStatsFromId(params1).then(data => {
            if (data !== undefined) {
              const players = data;
              console.log("players", players);
              setPlayers(players);
            }else {
              console.log("here??????")
              setPlayers([])
            }
          }).catch(error => {
            console.error("Error fetching player stats:", error);
          });
        } else {
          setPlayers([])
        }
      }).catch(error => {
        console.error("Error fetching player scores:", error);
      });
    } 
  }, [playerFilterValues]);
  


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
        <div className="col-md-11">
          <div className="row my-3">
            <div className="col-md-2">
              <h1 className="fs-3 white">Player Order</h1>
            </div> 
            <div className="col-md-3"> 
              <Order
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                orderValue={orderValue}
                setOrderValue={setOrderValue}
              />
            </div>
            <div className="col-md-1"/> 
            <div className="col-md-2"> 
              <div className="advanced">
                  <button
                  className="btn text-center btn-secondary w-100"
                  onClick={() => {
                      setShowAdvancedFilterModal(true);
                  }}
                  >
                  Config Projection
                  </button>
              </div>
            </div>
            <div className="col-md-4"> 
              <ProjectionDropdown projection={projection} setProjection={setProjection}/>
            </div>
          </div>
          <div className="row my-4">
            <div className="col-md-6">
              <PlayerList
                players={sortedPlayers}
                setSelectedPlayer={setSelectedPlayer}
                setShowModal={setShowModal}
                orderValue={orderValue}
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
      {selectedPlayer && selectedPlayerScore && (
        <PlayerModal
          selectedPlayer={selectedPlayer}
          selectedPlayerScore={selectedPlayerScore}
          comparisonPlayers={comparisonPlayers}
          togglePlayerForComparison={togglePlayerForComparison}
          showModal={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
      {comparisonPlayers && (
      <ComparisonModal
        players={comparisonPlayers}
        showModal={showComparisonModal}
        handleClose={() => setShowComparisonModal(false)}
      />
      )}
      <AdvancedFilterModal
        showModal={showAdvancedFilterModal}
        handleClose={() => setShowAdvancedFilterModal(false)}
      />

      <SidebarFilter
        setPlayer_name={setPlayer_name}
        league_id={league_id}
        setLeague_id={setLeague_id}
        team_id={team_id}
        setTeam_id={setTeam_id}
        setPlayerFilterValues={setPlayerFilterValues}
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default PlayerDashboard;
