import React, { useState, useEffect } from "react";

import { orderKeyValues, OrderKeyValuePair, Player, PlayerArray, ProjectedPlayer } from "../types/player";
import PlayerList from "./PlayerList";
import Player2DGraph from "./Player2DGraph";
import PlayerModal from "./PlayerModal";
import "./PlayerDashboard.css";

import {
  playerOverview,
  PlayerOverviewParams,
  PlayerProjectionParams,
} from "../router/data";

import SidebarFilter from "./SidebarFilter";
import Order from "./Order";
import ComparisonView from "./Comparison";
import ComparisonModal from "./ComparisonModal";

import AdvancedFilterModal from "./CustomProjectionModal";
import TooltipOverlay from "./TooltipOverlay";
import ProjectionDropdown from "./projectionDropdown"
import { playerProjection } from "../router/data";

const PlayerDashboard: React.FC = () => {
  // Player data
  const [players, setPlayers] = useState<PlayerArray>([]);
  const [sortedPlayers, setSortedPlayers] = useState<PlayerArray>([]);
  // Ordering
  const [sortOrder, setSortOrder] = useState("desc");
  const [orderValue, setOrderValue] = useState<OrderKeyValuePair>(orderKeyValues[0]);
  // View player
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Compare player
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonPlayers, setComparisonPlayers] = useState<Player[]>([]);
  // Highlight player
  const [highlightedPlayer, setHighlightedPlayer] = useState<Player | null>(null);

  // Filtering
  const [player_name, setPlayer_name] = useState<string | undefined>(undefined);
  const [season, setSeason] = useState<string | undefined>(undefined);
  const [playerFilterValues, setPlayerFilterValues] = useState<([number[], number[]]) | undefined>(undefined);

  // Projections
  const [projection, setProjection] = useState<string | undefined>("boxscore");
  const [playerProjections, setPlayerProjections] = useState<ProjectedPlayer[]>([]);
  const [customProjectionPlayerData, setCustomProjectionPlayerData] = useState<ProjectedPlayer[]>([]);

  // Toggle sidebar
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  //Projection configuration
  const [showProjectionConfig, setShowProjectionConfig] = useState(false);
  
  // Handles general player filtering
  useEffect(() => {
    const params: Partial<PlayerOverviewParams> = {};
    if (player_name !== undefined) {
      params.player_name = player_name;
    }
    if (season !== undefined) {
      params.season = season;
    }
    if (playerFilterValues != null) {
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
    }

    playerOverview(params).then((data) => {
      if (data !== undefined) {
        console.log("playerOverviewData", data);
        setPlayers(data);
      }
    });
  }, [player_name, season, playerFilterValues]);

  
  // Handles ordering of the data
  useEffect(() => {
    console.log("orderValue", { orderValue });
    console.log("sortOrder", { sortOrder });
    let sortedData = [...players];
    sortedData.sort((a, b) => {
      const keyA = a[orderValue["value"]];
      const keyB = b[orderValue["value"]];
      if (typeof keyA === "number" && typeof keyB === "number") {
        return sortOrder === "asc" ? keyA - keyB : keyB - keyA;
      } else if (typeof keyA === "string" && typeof keyB === "string") {
        return sortOrder === "asc"
          ? keyA.localeCompare(keyB)
          : keyB.localeCompare(keyA);
      }
      return 0;
    });

    // Clear the comaprison player array to avoid bugs in plot
    setComparisonPlayers([])

    // Take only the first 100 elements after sorting
    let top100Players = sortedData.slice(0, 100);
    console.log("Setting sorted players", top100Players)
    setSortedPlayers(top100Players);
  }, [players, sortOrder, orderValue]);

  useEffect(() => {
    const top100PlayerIds: number[] = sortedPlayers.map(player => player.player_id);
    const params: Partial<PlayerProjectionParams> = {};
    params.player_id = top100PlayerIds;
    if (projection !== "custom_projection") {
      params.projection = projection;
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
    }
    else {
      const data = customProjectionPlayerData.filter(player => top100PlayerIds.includes(player.player_id));
      setPlayerProjections(data);
      console.log("setting projection data for custom projection", data)
    }
  }, [sortedPlayers, projection, customProjectionPlayerData]);
  

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
    console.log("comparisonPlayers", comparisonPlayers);
  }, [comparisonPlayers]);
  
  return (
    <div className="container my-4">
      <div
        className={`row justify-content-evenly ${
          showModal || showComparisonModal || showProjectionConfig || isOpen
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
        <div className="col-md-10">
          <div className="row my-2">
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
            <div className="col-md-4">
              <ProjectionDropdown projection={projection} setProjection={setProjection}/>
            </div>
            <div className="col-md-2"> 
              <div className="advanced">
                  <button
                  className="btn text-center btn-secondary w-100"
                  onClick={() => {
                    setShowProjectionConfig(true);
                  }}
                  >
                  Custom Projection
                  </button>
              </div>
            </div>
            
          </div>
          <div className="row my-5">
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
        <div className="col-md-1"/>
      </div>
      {selectedPlayer && (
        <PlayerModal
          selectedPlayer={selectedPlayer}
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
        showModal={showProjectionConfig}
        handleClose={() => setShowProjectionConfig(false)}
        setCustomProjectionPlayerData={setCustomProjectionPlayerData}
      />
      <SidebarFilter
        setPlayer_name={setPlayer_name}
        season={season}
        setSeason={setSeason}
        setPlayerFilterValues={setPlayerFilterValues}
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default PlayerDashboard;
