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
        <Modal.Title>{selectedPlayer ? selectedPlayer["player-name"] : "Player Details"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedPlayer && (
          <>
            <p>Player id: {selectedPlayer.player_id}</p>
            <p>Points: {selectedPlayer.points}</p>
            <p>Jersey number: {selectedPlayer.jersey_number}</p>
            <p>Drives%: {selectedPlayer["drives_%"]}</p>
            <p>Free throws%: {selectedPlayer["free_throws_%"]}</p>
            <p>Isolation%: {selectedPlayer["isolation_%"]}</p>
            <p>Pick n pops%: {selectedPlayer["pick-n-pops_%"]}</p>
            <p>transition attacks%: {selectedPlayer["transition_attacks_%"]}</p>
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
