// PlayerList.tsx
import React from 'react';
import { Player, PlayerArray } from '../types/player';
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
                    className="player-row"
                    key={`${player.player_id}-${index}`}
                    onClick={() => {
                        setSelectedPlayer(player);
                        setShowModal(true);
                    }}
                >
                    <div className='row-content'>
                        id: {player.player_id}, name: {player["player-name"]}, points: {player.points}, jersey_number: {player.jersey_number}
                    </div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent the li onClick from firing when the button is clicked
                            togglePlayerForComparison(player);
                        }}
                        className={`btn ml-3 ${
                            comparisonPlayers.find(p => p.player_id === player.player_id) ? 'btn-danger' : 
                            comparisonPlayers.length >= 2 ? 'btn-tertary' : 'btn-success'
                        }`}
                    >
                        {comparisonPlayers.find(p => p.player_id === player.player_id) ? 'Remove from Comparison' : 'Add to Comparison'}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default PlayerList;
