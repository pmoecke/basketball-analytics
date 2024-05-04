// PlayerList.tsx
import React from 'react';
import { Player, PlayerArray } from '../types/player';
import { FaFlag } from 'react-icons/fa';
// Styling
import "./PlayerList.css";

interface PlayerListProps {
    players: PlayerArray;
    setSelectedPlayer: (player: Player) => void;
    setShowModal: (show: boolean) => void;
    togglePlayerForComparison: (player: Player) => void;
    comparisonPlayers: PlayerArray;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, setSelectedPlayer, setShowModal, togglePlayerForComparison, comparisonPlayers}) => {
    return (
        <ul className="player-list">
            {players.map((player, index) => (
                <li
                className="player-row d-flex justify-content-between"
                key={`${player.player_id}-${index}`}
                onClick={() => {
                    setSelectedPlayer(player);
                    setShowModal(true);
                }}
            >
                <div className='row-content'>
                    {Math.round(player.efficiency_score).toFixed(2)} : {player.player_name}
                </div>

                <div className="d-flex align-items-center">
                    
                    {player.games_played < 5 && ( // change value according to ml model
                        <FaFlag className='mx-3' style={{ color: 'red' }} />
                    )}

                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            togglePlayerForComparison(player);
                        }}
                        className={`btn ${
                            comparisonPlayers.find(p => p.player_id === player.player_id) ? 'btn-danger' : 
                            comparisonPlayers.length >= 2 ? 'btn-tertary' : 'btn-success'
                        }`}
                    >
                        {comparisonPlayers.find(p => p.player_id === player.player_id) ? 'Remove from Comparison' : 'Add to Comparison'}
                    </button>
                   
                 </div>
            </li>
            ))}
        </ul>
    );
};

export default PlayerList;
