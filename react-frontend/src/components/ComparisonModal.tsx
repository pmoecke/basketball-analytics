import React, { useState, useEffect } from "react";
import { Player } from "../types/player";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Nav from "react-bootstrap/Nav";
import ComparisonGraph from "./ComparisonGraph";
import TooltipOverlay from "./TooltipOverlay";
import "./ComparisonModal.css";
import { statDictionary } from "./statDictionary";
import { statMapping } from "./statMapping";
import { tooltipTexts } from "./tooltipTexts";
import { PlayerStatsFromIdAndSeasonParams, playerStatsFromIdAndSeason } from "../router/data";
import { FaInfoCircle } from "react-icons/fa";

interface ComparisonModalProps {
  players: Player[];
  showModal: boolean;
  handleClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  players,
  showModal,
  handleClose,
}) => {
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Boxscore");

  useEffect(() => {
    if (players.length === 2) {
      const params1: PlayerStatsFromIdAndSeasonParams = { player_id: [players[0].player_id], season: players[0].season};
      const params2: PlayerStatsFromIdAndSeasonParams = { player_id: [players[1].player_id], season: players[1].season };

      playerStatsFromIdAndSeason(params1).then((data) => {
        if (data !== undefined) {
          setPlayer1(data[0]);
        }
      });

      playerStatsFromIdAndSeason(params2).then((data) => {
        if (data !== undefined) {
          setPlayer2(data[0]);
        }
      });
    }
  }, [players]);

  if (players.length !== 2 || !showModal || !player1 || !player2) {
    return null;
  }

  const getTriangle = (stat1: number, stat2: number) => {
    if (stat1 > stat2) {
      return <span style={{ color: "lightgreen" }}>{Number(stat1).toFixed(2)} ▲</span>;
    } else if (stat1 < stat2) {
      return <span style={{ color: "LightCoral" }}>{Number(stat1).toFixed(2)} ▼</span>;
    } else {
      return <span>{Number(stat1).toFixed(2)}</span>;
    }
  };

  const renderTable = (category: string) => {
    const filteredStats = statDictionary[category as keyof typeof statDictionary] || [];

    return (
      <div className="table-responsive-vertical">
        <Table striped bordered variant="dark" className="transparent-table text-nowrap">
          <thead>
            <tr>
              <th scope="col"></th>
              {filteredStats.map((stat) => (
                <th key={stat} scope="col" className="text-left">
                  <TooltipOverlay
                    tooltipText={tooltipTexts[statMapping[stat]]}
                    placement="top"
                    showTitle={false}
                  >
                    {statMapping[stat]}
                  </TooltipOverlay>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="text-center">{player1.player_name}</th>
              {filteredStats.map((stat) => (
                <td key={stat} className="text-right">
                  {getTriangle(player1[stat as keyof Player] as number, (player2[stat as keyof Player] as number))}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="text-center">{player2.player_name}</th>
              {filteredStats.map((stat) => (
                <td key={stat} className="text-right">
                  {getTriangle(player2[stat as keyof Player] as number, player1[stat as keyof Player] as number)}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>
      </div>
    );
  };

  const handleSelect = (eventKey: string | null) => {
    setSelectedCategory(eventKey || "Boxscore");
  };

  const categoryNames: { [key: string]: string } = {
    "Boxscore": "Boxscore",
    "DefenseAgainstShootingCombinations": "Combination Defense",
    "Drives": "Drives",
    "DrivesDefense": "Drives Defense",
    "Efficiency": "Efficiency",
    "PlayTypeCombinations": "Play Types",
    "AdditionalData": "Additional Data",
  };

  const categories = [
    "Boxscore", "DefenseAgainstShootingCombinations", "Drives",
    "DrivesDefense", "Efficiency", "PlayTypeCombinations", "AdditionalData", 
  ];

  const toolTips: { [key: string]: string } = {
    "off_score_1": "'Playing in the Paint' considers the following features: posts up made and attempted, cuts made and attempted, 2-pt field goals made and attempted and screen assists",
    "off_score_2": "'Perimeter Offense' considers the following features: 3-pt field goals made and attempted, assists, isolations made and attempted, catch and shoot made and attempted",
    "off_score_3": "'Driving Offense' considers the following features: catch and drive made and attempted, PnR handlers made and attempted, drives made and drives with shot",
    "def_score": "'Defensive Performance Indicator (DPI)' is calculated according to: DPI = blocks + fouls drawn - fouls + steals - turnovers + points off screen assists + assists to turnover ratio",
    "reb_score": "'Reboudning' is simply the rebounding score of a player",
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      className="comparison-modal"
      size="xl"
    >
      <Modal.Header closeButton className="comparison-modal-header">
        <Modal.Title>
          {player1.player_name} - {player1.season}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; vs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{player2.player_name} - {player2.season}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="comparison-modal-body">
        <div className="container">
          <div className="row">
            <div className="col-md-2"/>
            <div className="col-md-8">
              <ComparisonGraph player1={player1} player2={player2}/>
            </div>
            <div className="col-md-2">
            <FaInfoCircle className="ms-5 larger-icon padded-icon" style={{ cursor: 'pointer' }} />
            <br/>
            <div className="mb-2"/>
            <TooltipOverlay
                      tooltipText={toolTips["off_score_1"]}
                      placement="left"
                      showTitle={false}
                >
                  Playing in the paint
                </TooltipOverlay>
                <br/>
                <div className="mb-2"/>
                <TooltipOverlay
                      tooltipText={toolTips["off_score_2"]}
                      placement="left"
                      showTitle={false}
                >
                  Perimeter Offense
                </TooltipOverlay>
                <br/>
                <div className="mb-2"/>
                <TooltipOverlay
                      tooltipText={toolTips["off_score_3"]}
                      placement="left"
                      showTitle={false}
                >
                  Driving Offense
                </TooltipOverlay>
                <br/>
                <div className="mb-2"/>
                <TooltipOverlay
                      tooltipText={toolTips["reb_score"]}
                      placement="left"
                      showTitle={false}
                >
                  Rebounding
                </TooltipOverlay>
                <br/>
                <div className="mb-2"/>
                <TooltipOverlay
                      tooltipText={toolTips["def_score"]}
                      placement="left"
                      showTitle={false}
                >
                  DPI
                </TooltipOverlay>
            </div>
            <div className="col-md-12">
              <div className="table-container">
                <Nav variant="tabs" activeKey={selectedCategory} onSelect={handleSelect} className="mb-0">
                  {categories.map(category => (
                    <Nav.Item key={category}>
                      <Nav.Link eventKey={category}>{categoryNames[category]}</Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
                {renderTable(selectedCategory)}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="comparison-modal-footer"></Modal.Footer>
    </Modal>
  );
};

export default ComparisonModal;
