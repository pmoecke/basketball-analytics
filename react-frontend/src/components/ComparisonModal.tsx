import React, { useState } from "react";
import { Player } from "../types/player";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Nav from "react-bootstrap/Nav";
import ComparisonGraph from "./ComparisonGraph";
import TooltipOverlay from "./TooltipOverlay";
import "./ComparisonModal.css";
import { statDictionary } from "./statDictionary"
import { statMapping } from "./statMapping";
import { tooltipTexts } from "./tooltipTexts";

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
  
  const [selectedCategory, setSelectedCategory] = useState("Boxscore");

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



  const renderTable2 = (category: string) => {
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
                    children={statMapping[stat]}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {player1 && (
              <tr>
                <th scope="row" className="text-center">{player1.player_name}</th>
                {filteredStats.map((stat) => (
                  <td key={stat} className="text-right">
                    {getTriangle(player1[stat as keyof Player] as number, player2[stat as keyof Player] as number)}
                  </td>
                ))}
              </tr>
            )}
            {player2 && (
              <tr>
                <th scope="row" className="text-center">{player2.player_name}</th>
                {filteredStats.map((stat) => (
                  <td key={stat} className="text-right">
                    {getTriangle(player2[stat as keyof Player] as number, player1[stat as keyof Player] as number)}
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



    const renderTable = (category: string) => {
      switch (category) {
        case "playmaking":
          return (
            <div className="table-responsive-vertical">
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
                  {/* Add more rows as needed */}
                </tbody>
              </Table>
            </div>
          );
        case "boxscore":
          return (
            <div className="table-responsive-vertical">
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
                  {/* Add more rows as needed */}
                </tbody>
              </Table>
            </div>
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
        </Modal.Body>
        <Modal.Footer className="comparison-modal-footer"></Modal.Footer>
      </Modal>
    );
  }
};

export default ComparisonModal;
