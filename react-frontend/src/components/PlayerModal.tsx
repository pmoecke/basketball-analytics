import React, { useState } from "react";
import { Player } from "../types/player";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import PlayerGraph from "./PlayerGraph";
import TooltipOverlay from "./TooltipOverlay";
import "./PlayerModal.css";
import { statDictionary } from "./statDictionary";
import { statMapping } from "./statMapping";
import { tooltipTexts } from "./tooltipTexts";

interface PlayerModalProps {
  selectedPlayer: Player | null;
  showModal: boolean;
  handleClose: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({
  selectedPlayer,
  showModal,
  handleClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("Boxscore");

  const renderTable2 = (category: string) => {
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
                    {selectedPlayer[stat as keyof Player] as string}
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
      </Modal.Header>
      <Modal.Body className="player-modal-body">
        {selectedPlayer && (
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <PlayerGraph player={selectedPlayer} />
              </div>
              <div className="col-md-4">
                Explain 5 Axes here
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
                  {renderTable2(selectedCategory)}
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
