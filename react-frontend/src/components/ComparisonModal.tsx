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
import { PlayerStatsFromIdParams, getPlayerScore, playerStatsFromId } from "../router/data";
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
  const [playerScore1, setPlayerScore1] = useState<any | null>(null);
  const [playerScore2, setPlayerScore2] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Boxscore");

  useEffect(() => {
    if (players.length === 2) {
      const params1: PlayerStatsFromIdParams = { player_id: players[0].player_id };
      const params2: PlayerStatsFromIdParams = { player_id: players[1].player_id };

      playerStatsFromId(params1).then((data) => {
        if (data !== undefined) {
          setPlayer1(data[0]);
        }
      });

      playerStatsFromId(params2).then((data) => {
        if (data !== undefined) {
          setPlayer2(data[0]);
        }
      });
    }
  }, [players]);

  useEffect(() => {
    if (players.length === 2) {
      const params1: PlayerStatsFromIdParams = { player_id: players[0].player_id };
      const params2: PlayerStatsFromIdParams = { player_id: players[1].player_id };

      playerStatsFromId(params1).then((data) => {
        if (data !== undefined) {
          setPlayer1(data[0]);
        }
      });

      getPlayerScore(params1).then(data => {
        if (data !== undefined) {
          var score = data[0]
          setPlayerScore1(score);
        }
      });

      playerStatsFromId(params2).then((data) => {
        if (data !== undefined) {
          setPlayer2(data[0]);
        }
      });

      getPlayerScore(params2).then(data => {
        if (data !== undefined) {
          var score = data[0]
          setPlayerScore2(score);
        }
      });
    }
  }, [players]);

  if (players.length !== 2 || !showModal || !player1 || !player2) {
    return null;
  }

  const getTriangle = (stat1: number, stat2: number) => {
    if (stat1 > stat2) {
      return <span style={{ color: "lightgreen" }}>{stat1} ▲</span>;
    } else if (stat1 < stat2) {
      return <span style={{ color: "LightCoral" }}>{stat1} ▼</span>;
    } else {
      return <>{stat1}</>;
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
                  {getTriangle(player1[stat as keyof Player] as number, player2[stat as keyof Player] as number)}
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
    "AdditionalData": "Additional Data",
    "Boxscore": "Boxscore",
    "DefenseAgainstShootingCombinations": "Combination Defense",
    "Drives": "Drives",
    "DrivesDefense": "Drives Defense",
    "Efficiency": "Efficiency",
    "PlayTypeCombinations": "Play Types",
    "Stats": "Stats"
  };

  const categories = [
    "AdditionalData", "Boxscore", "DefenseAgainstShootingCombinations", "Drives",
    "DrivesDefense", "Efficiency", "PlayTypeCombinations", "Stats"
  ];

  const pentagonTooltips = "def_score: \noff_score_1: \noff_score_2: \noff_score_3: \nreb_score: "

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      className="comparison-modal"
      size="xl"
    >
      <Modal.Header closeButton className="comparison-modal-header">
        <Modal.Title>
          {player1.player_name} vs {player2.player_name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="comparison-modal-body">
        <div className="container">
          <div className="row">
          <div className="col-md-2"/>
              <div className="col-md-8">
                <ComparisonGraph player1={player1} player2={player2} playerScore1={playerScore1} playerScore2={playerScore2}/>
              </div>
              <div className="col-md-2">
                <TooltipOverlay
                  tooltipText={pentagonTooltips}
                  placement="right"
                  showTitle={false}
                >
                  <FaInfoCircle className="ms-2 larger-icon padded-icon" style={{ cursor: 'pointer' }} />
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
