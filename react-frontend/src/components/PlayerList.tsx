import React, { useState, useEffect } from "react";

import { Player } from "../types/player";
import "./PlayerList.css";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const PlayerList: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]); // This will hold the data fetched from the API
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [sortOrder, setSortOrder] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player[] | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/players/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(typeof(data))
        console.log(data[0])
        console.log(data[1])
        setPlayers(data);
        setFilteredPlayers(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    let sortedAndFiltered = players.filter((player) =>
      player["Player name"].toLowerCase().includes(query)
    );

    if (sortOrder === "asc") {
      sortedAndFiltered.sort((a, b) => a["Player name"].localeCompare(b["Player name"]));
    } else if (sortOrder === "desc") {
      sortedAndFiltered.sort((a, b) => b["Player name"].localeCompare(a["Player name"]));
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
            {filteredPlayers.map((player, index) => (
              <li
                className="player-row"
                key={`${player.player_id}-${index}`}
              >
                {player["Player name"]},
                {player["Team name"]},
                {player.Points}
              </li>
            ))}
          </ul>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedPlayer}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
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
