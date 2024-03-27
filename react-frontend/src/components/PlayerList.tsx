import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Player } from '../types/player';
import { players } from '../data/players';
import './PlayerList.css';

const PlayerList: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>(players);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setQuery(value);
    const filtered = players.filter(player =>
      player.name.toLowerCase().includes(value)
    );
    setFilteredPlayers(filtered);
  };

  return (
    <div className='player-search'>
      <input
        type="text"
        placeholder="Search for players..."
        value={query}
        onChange={handleSearch}
      />
      <ul className='player-list'>
      {filteredPlayers.map(player => (
        <li className='player-row' key={player.id}>
            <Link to={`/player/${player.id}`}>{player.name}</Link>
        </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
