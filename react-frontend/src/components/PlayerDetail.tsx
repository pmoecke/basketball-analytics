import React from 'react';
import { useParams } from 'react-router-dom';
import { Player } from '../types/player';
import { players } from '../data/players';

const PlayerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Use '0' or another appropriate default value as a fallback for 'id'
  const playerId = parseInt(id || '0', 10);

  const player = players.find((player) => player.id === playerId);

  if (!player) {
    return <div>Player not found</div>;
  }

  return (
    <div>
      <h2>{player.name}</h2>
      <p>Team: {player.team}</p>
      <p>Position: {player.position}</p>
      {/* Add more detailed stats here */}
    </div>
  );
};

export default PlayerDetail;
