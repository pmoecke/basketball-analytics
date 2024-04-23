import React from 'react';
import { PlayerArray } from '../types/player';
import { Player } from '../types/player';

interface ComparisonViewProps {
  comparisonPlayers: PlayerArray;
  togglePlayerForComparison: (player: Player) => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ comparisonPlayers, togglePlayerForComparison }) => {
  return (
    <div className="player-comparison col-md-2 box">
        <div className="fs-2 text-center white mb-3">
              Comparison
        </div>
        <ul>
        {comparisonPlayers.map((player: Player) => (
            <li key={player.player_id} className="fs-5 player-row white d-flex justify-content-between align-items-center">
            {player["player-name"]}
            <button 
                className="btn btn-danger btn-sm ml-3" 
                onClick={() => togglePlayerForComparison(player)}
            >
                -
            </button>
            </li>
        ))}
        </ul>
        {comparisonPlayers.length === 2 && <button className="btn text-center btn-primary">Compare</button>}
    </div>
    
  );
};

export default ComparisonView;
