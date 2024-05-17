import React, { useState } from "react";
import { Player } from "../types/player";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ComparisonGraph from "./ComparisonGraph";
import TooltipOverlay from "./TooltipOverlay";
import { tooltipTexts } from "./tooltipTexts"; // Import the tooltip texts dictionary
import "./ComparisonModal.css";

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
  const [selectedCategory, setSelectedCategory] = useState("boxscore");

  if (players.length !== 2 || !showModal) {
    return null;
  } else {
    const player1 = players[0];
    const player2 = players[1];

    const getTriangle = (stat1: number, stat2: number) => {
      if (stat1 > stat2) {
        return (
          <>
            <span style={{ color: "lightgreen" }}>{stat1} ▲</span>
          </>
        );
      } else if (stat1 < stat2) {
        return (
          <>
            <span style={{ color: "LightCoral" }}>{stat1} ▼</span>
          </>
        );
      } else {
        return <>{stat1}=</>;
      }
    };

    const renderTable = (category: string) => {
      switch (category) {
        case "playmaking":
          return (
            <Table striped bordered responsive-sm variant="dark" className="transparent-table">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col" className="text-right">{player1.player_name}</th>
                  <th scope="col" className="text-right">{player2.player_name}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>
                    <TooltipOverlay
                      tooltipText={tooltipTexts["ID: "]}
                      placement="right"
                      children={"ID: "}
                    />
                  </th>
                  <td className="text-right">{player1.player_id}</td>
                  <td className="text-right">{player2.player_id}</td>
                </tr>
                <tr>
                  <th>
                    <TooltipOverlay
                      tooltipText={tooltipTexts["Nr: "]}
                      placement="right"
                      children={"Nr: "}
                    />
                  </th>
                  <td className="text-right">{player1.jersey_number}</td>
                  <td className="text-right">{player2.jersey_number}</td>
                </tr>
                <tr>
                  <th>
                    <TooltipOverlay
                      tooltipText={tooltipTexts["Off: "]}
                      placement="right"
                      children={"Off: "}
                    />
                  </th>
                  <td className="text-right">
                    {getTriangle(
                      player1.offensive_rating,
                      player2.offensive_rating
                    )}
                  </td>
                  <td className="text-right">
                    {getTriangle(
                      player2.offensive_rating,
                      player1.offensive_rating
                    )}
                  </td>
                </tr>
                <tr>
                  <th>
                    <TooltipOverlay
                      tooltipText={tooltipTexts["Def: "]}
                      placement="right"
                      children={"Def: "}
                    />
                  </th>
                  <td className="text-right">{player1.defensive_rating}</td>
                  <td className="text-right">{player2.defensive_rating}</td>
                </tr>
              </tbody>
            </Table>
          );
        // Add more cases for other categories like "defense", "scoring", etc.
        case "boxscore":
          return (
            <Table striped bordered responsive-sm variant="dark" className="transparent-table">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col" className="text-right">{player1.player_name}</th>
                  <th scope="col" className="text-right">{player2.player_name}</th>
                </tr>
              </thead>
              <tbody>


                <tr>
                  <th>
                    <TooltipOverlay
                      tooltipText={tooltipTexts["GMP: "]}
                      placement="right"
                      children={"GMP: "}
                    />
                  </th>
                  {/* FIXME stats arent loaded correctly? */}
                  <td className="text-right">{getTriangle(player1.games_played, player2.games_played)}</td>
                  <td className="text-right">{getTriangle(player2.games_played, player1.games_played)}</td>
                </tr>
                  <tr>
                    <th>
                      <TooltipOverlay
                        tooltipText={tooltipTexts["MINS: "]}
                        placement="right"
                        children={"MINS: "}
                      />
                    </th>
                    <td className="text-right">{player1.minutes}</td>
                    <td className="text-right">{player2.minutes}</td>
                  </tr>
                  <tr>
                    <th>
                      <TooltipOverlay
                        tooltipText={tooltipTexts["PTS: "]}
                        placement="right"
                        children={"PTS: "}
                      />
                    </th>
                    <td className="text-right">{player1.points}</td>
                    <td className="text-right">{player2.points}</td>
                  </tr>


                </tbody>
            </Table>
          );
        // Add more cases for other categories like "defense", "scoring", etc.
        
        default:
          return null;
      }
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
            {player1.player_name} vs {player2.player_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="comparison-modal-body">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <ComparisonGraph player1={player1} player2={player2} />
              </div>
              <div className="col-md-4">
                
                <div className="table-container">
                <DropdownButton
                  id="dropdown-basic-button"
                  title={selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                  onSelect={(eventKey) => setSelectedCategory(eventKey || "playmaking")}
                  className="mb-3"
                  menuVariant="dark"
                >
                  <Dropdown.Item eventKey="playmaking" >Playmaking</Dropdown.Item>
                  <Dropdown.Item eventKey="boxscore" >Boxscore</Dropdown.Item>
                  <Dropdown.Item eventKey="scoring">Scoring</Dropdown.Item>
                  {/* Add more dropdown items as needed */}
                </DropdownButton>
                  {renderTable(selectedCategory)}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="comparison-modal-footer"></Modal.Footer>
      </Modal>
    );
  }
};

export default ComparisonModal;
