import React from "react";
import { Player } from "../types/player";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface PlayerModalProps {
  selectedPlayer: Player | null;
  showModal: boolean;
  handleClose: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ selectedPlayer, showModal, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedPlayer ? selectedPlayer["Player name"] : "Player Details"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedPlayer && (
          <>
            <p>Player id: {selectedPlayer.player_id}</p>
            <p>Player name: {selectedPlayer["Player name"]}</p>
            <p>League: {selectedPlayer.League}</p>
            <p>Team: {selectedPlayer["Team name"]}</p>
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
