import React from "react";
import { Player } from "../types/player";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ComparisonGraph from "./ComparisonGraph";
// Styling
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
      <Modal show={showModal} onHide={handleClose} className="player-modal">
        <Modal.Header closeButton className="player-modal-header">
          <Modal.Title>
            {player1["player-name"]} vs {player2["player-name"]}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="player-modal-body">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="p-3  ">{player1["player-name"]}</div>
              </div>
              <div className="col-md-4">
                <div className="p-3  "></div>
              </div>
              <div className="col-md-4">
                <div className="p-3 text-end">{player2["player-name"]}</div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-2">
                <div className="p-3  ">
                  {player1 && (
                    <>
                      <p>Player id: {player1.player_id}</p>
                      <p>Points: {player1.points}</p>
                      <p>Jersey number: {player1.jersey_number}</p>
                      <p>Offensive rating: {player1.offensive_rating}</p>
                      <p>Defensive rating: {player1.defensive_rating}</p>
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
                <div className="p-3  ">
                  {player2 && (
                    <>
                      <p>Player id: {player2.player_id}</p>
                      <p>Points: {player2.points}</p>
                      <p>Jersey number: {player2.jersey_number}</p>
                      <p>Offensive rating: {player2.offensive_rating}</p>
                      <p>Defensive rating: {player2.defensive_rating}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
};

export default ComparisonModal;
