import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { Player } from "../types/player";
import { players } from "../data/players";
import "./PlayerList.css";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const PlayerList: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>(players);
  const [sortOrder, setSortOrder] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const PlayerModal = ({
    player,
    onClose,
  }: {
    player: Player;
    onClose: () => void;
  }) => {
    if (!player) return null;

    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <h2>{player.name}</h2>
          <p>Team: {player.team}</p>
          <p>Position: {player.position}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    let sortedAndFiltered = players.filter((player) =>
      player.name.toLowerCase().includes(query)
    );

    if (sortOrder === "asc") {
      sortedAndFiltered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      sortedAndFiltered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredPlayers(sortedAndFiltered);
  }, [sortOrder, query]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setQuery(value);
  };

  return (
    <div className="container">
      <div className={`row justify-content-evenly ${showModal ? 'blur-background' : ''}`}>
        <div className="filter col-md-3 box">
          <div className="mb-3">
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Default Order</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <div className="player-search col-md-8 box">
          <input
            className="form-control search mb-3"
            type="text"
            placeholder="Search for players..."
            value={query}
            onChange={handleSearch}
          />
          <ul className="player-list">
            {filteredPlayers.map((player) => (
              <li
                className="player-row"
                key={player.id}
                onClick={() => {
                  setSelectedPlayer(player);
                  setShowModal(true);
                }}
              >
                {player.name}
              </li>
            ))}
          </ul>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedPlayer?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Team: {selectedPlayer?.team}</p>
            <p>Position: {selectedPlayer?.position}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default PlayerList;
