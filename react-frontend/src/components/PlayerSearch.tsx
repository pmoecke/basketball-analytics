import React from 'react';

interface PlayerSearchProps {
  player_search: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ player_search, handleSearch }) => {
  return (
    <input
      className="form-control search mb-3"
      type="text"
      placeholder="Search for players..."
      value={player_search}
      onChange={handleSearch}
    />
  );
};

export default PlayerSearch;
