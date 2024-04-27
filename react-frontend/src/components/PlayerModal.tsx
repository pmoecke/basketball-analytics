import React from "react";
import { Player } from "../types/player";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import PlayerGraph from "./PlayerGraph";
import TooltipOverlay from "./TooltipOverlay";
import "./PlayerModal.css";

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
  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      className="player-modal"
      size="lg"
    >
      <Modal.Header closeButton className="player-modal-header">
        <Modal.Title>
          {selectedPlayer ? selectedPlayer["player-name"] : "Player Details"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="player-modal-body">
        {selectedPlayer && (
          <>
            <p>
              <TooltipOverlay
                tooltipText="ID used to identify each player uniquely"
                placement="left"
                children={"ID: "}
              />
              {selectedPlayer.player_id}
            </p>
            <p>
              <TooltipOverlay
                tooltipText="Number on this player's jersey"
                placement="left"
                children={"Nr: "}
              />
              {selectedPlayer.jersey_number}
            </p>
            <p>
              <TooltipOverlay
                tooltipText="Score between 0 and 100 based on player's offensive prowess"
                placement="left"
                children={"Off: "}
              />
              {selectedPlayer.offensive_rating}
            </p>
            <p>
              <TooltipOverlay
                tooltipText="Score between 0 and 100 based on player's defensive prowess"
                placement="left"
                children={"Def: "}
              />
              {selectedPlayer.defensive_rating}
            </p>

            <PlayerGraph player={selectedPlayer} />
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="player-modal-footer">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlayerModal;
