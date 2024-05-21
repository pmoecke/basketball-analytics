import React, { useState } from "react";
import { Player, PlayerArray } from "../types/player";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Nav from "react-bootstrap/Nav";
import PlayerGraph from "./PlayerGraph";
import TooltipOverlay from "./TooltipOverlay";
import "./PlayerModal.css";
import { statDictionary } from "./statDictionary";
import { statMapping } from "./statMapping";
import { tooltipTexts } from "./tooltipTexts";
import { FaInfoCircle } from "react-icons/fa";

interface PlayerModalProps {
  selectedPlayer: Player | null;
  selectedPlayerScore: any;
  comparisonPlayers: PlayerArray;
  togglePlayerForComparison: (player: Player) => void;
  showModal: boolean;
  handleClose: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({
  selectedPlayer,
  selectedPlayerScore,
  comparisonPlayers,
  togglePlayerForComparison,
  showModal,
  handleClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("Boxscore");

  const renderTable = (category: string) => {
    const filteredStats = statDictionary[category as keyof typeof statDictionary] || [];

    return (
      <div className="table-responsive-vertical">
        <Table striped bordered  variant="dark" className="transparent-table text-nowrap">
          <thead>
            <tr>
              <th scope="col"></th>
              {filteredStats.map((stat) => (
                <th key={stat} scope="col" className="text-left">
                  <TooltipOverlay
                    tooltipText={tooltipTexts[statMapping[stat]]}
                    placement="top"
                    children={statMapping[stat]}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedPlayer && (
              <tr>
                <th scope="row" className="text-center">{selectedPlayer.player_name}</th>
                {filteredStats.map((stat) => (
                  <td key={stat} className="text-right">
                    {selectedPlayer[stat as keyof Player]}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  };

  const handleSelect = (eventKey: string | null) => {
    setSelectedCategory(eventKey || "Boxscore");
  };

  const categoryNames : { [key: string]: string } = {
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
      className="player-modal"
      size="xl"
    >
      <Modal.Header closeButton className="player-modal-header">
        <Modal.Title>
          {selectedPlayer ? selectedPlayer.player_name : "Player Details"}
        </Modal.Title>
        {selectedPlayer && 
        <TooltipOverlay tooltipText='Add/remove from comparison' placement="left" showTitle={false}>  
            <button 
                onClick={(e) => {
                    e.stopPropagation(); 
                    togglePlayerForComparison(selectedPlayer);
                    handleClose();
                }}
                className={`btn ms-5 ${
                    comparisonPlayers.find(p => p.player_id === selectedPlayer.player_id) ? 'btn-danger' : 
                    comparisonPlayers.length >= 2 ? 'btn-tertary' : 'btn-success'
                }`}
                style={{ display: comparisonPlayers.find(p => p.player_id === selectedPlayer.player_id) ? 'block' : comparisonPlayers.length >= 2 ? 'none' : 'block' }}
            >
                {comparisonPlayers.find(p => p.player_id === selectedPlayer.player_id) ? 'Remove Compare' : 'Add Compare'}
            </button>
        </TooltipOverlay>
        }
      </Modal.Header>
      <Modal.Body className="player-modal-body">
        {selectedPlayer && (
          <div className="container">
            <div className="row">
              <div className="col-md-2"/>
              <div className="col-md-8">
               <PlayerGraph player={selectedPlayer} playerScore={selectedPlayerScore} />
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
            </div>
            
            
            <div className="row">
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
        )}
      </Modal.Body>
      <Modal.Footer className="player-modal-footer">
      </Modal.Footer>
    </Modal>
  );
};

export default PlayerModal;
