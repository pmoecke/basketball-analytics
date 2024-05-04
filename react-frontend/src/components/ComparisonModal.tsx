import React from "react";
import { Player } from "../types/player";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ComparisonGraph from "./ComparisonGraph";
import TooltipOverlay from "./TooltipOverlay";
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
  if (players.length !== 2 || !showModal) {
    return null;
  } else {
    const player1 = players[0];
    const player2 = players[1];

    return (
      <Modal
        show={showModal}
        onHide={handleClose}
        className="comparison-modal"
        size="xl"
      >
        <Modal.Header closeButton className="comparison-modal-header">
          <Modal.Title>
            {player1["player-name"]} vs {player2["player-name"]}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="comparison-modal-body">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="p-3  "><h5>{player1["player-name"]}</h5></div>
              </div>
              
              <div className="col-md-6">
                <div className="p-3 text-end"><h5>{player2["player-name"]}</h5></div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-2">
                <div className="p-3  ">
                  {player1 && (
                    <>
                      <p className="space_between">
                        <TooltipOverlay
                          tooltipText="ID used to identify each player uniquely"
                          placement="right"
                          children={"ID: "}
                        />
                        {player1.player_id}
                      </p>
                      <p className="space_between"> 
                        <TooltipOverlay
                          tooltipText="Number on this player's jersey"
                          placement="right"
                          children={"Nr: "}
                        />
                        {player1.jersey_number}
                      </p>
                      <p className="space_between">
                        <TooltipOverlay
                          tooltipText="Score between 0 and 100 based on player's offensive prowess"
                          placement="right"
                          children={"Off: "}
                        />
                        {player1.offensive_rating}
                      </p>
                      <p className="space_between">
                        <TooltipOverlay
                          tooltipText="Score between 0 and 100 based on player's defensive prowess"
                          placement="right"
                          children={"Def: "}
                        />
                        {player1.defensive_rating}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-8">
                <div className="p-3  ">
                  <ComparisonGraph player1={player1} player2={player2} />
                </div>
              </div>
              <div className="col-md-2">
                <div className="p-3  text-end">
                  {player2 && (
                    <>
                      <p className="space_between">
                        <TooltipOverlay
                          tooltipText="ID used to identify each player uniquely"
                          placement="left"
                          children={"ID: "}
                        />
                        {player2.player_id}
                      </p>
                      <p className="space_between">
                        <TooltipOverlay
                          tooltipText="Number on this player's jersey"
                          placement="left"
                          children={"Nr: "}
                        />
                        {player2.jersey_number}
                      </p>
                      <p className="space_between">
                        <TooltipOverlay
                          tooltipText="Score between 0 and 100 based on player's offensive prowess"
                          placement="left"
                          children={"Off: "}
                        />
                        {player2.offensive_rating}
                      </p>
                      <p className="space_between">
                        <TooltipOverlay
                          tooltipText="Score between 0 and 100 based on player's defensive prowess"
                          placement="left"
                          children={"Def: "}
                        />
                        {player2.defensive_rating}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="comparison-modal-footer">
          
        </Modal.Footer>
      </Modal>
    );
  }
};

export default ComparisonModal;
