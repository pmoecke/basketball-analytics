import React from "react";
import { Player } from "../types/player";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import PlayerGraph from "./PlayerGraph";

interface PlayerModalProps {
  selectedPlayer: Player | null;
  showModal: boolean;
  handleClose: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ selectedPlayer, showModal, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedPlayer ? selectedPlayer["player-name"] : "Player Details"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedPlayer && (
          <>
            <p>Player id: {selectedPlayer.player_id}</p>
            <p>Points: {selectedPlayer.points}</p>
            <p>Jersey number: {selectedPlayer.jersey_number}</p>

            <PlayerGraph player={selectedPlayer}/>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlayerModal;
