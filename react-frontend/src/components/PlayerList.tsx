// PlayerList.tsx
import React from 'react';

// Assuming you have defined these types somewhere else in your project.
// If not, you need to define them appropriately based on how players are structured.
import { Player, PlayerArray } from '../types/player';

interface PlayerListProps {
    players: PlayerArray;
    setSelectedPlayer: (player: Player) => void;
    setShowModal: (show: boolean) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, setSelectedPlayer, setShowModal }) => {
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
                    {Math.round(player.efficiency_score).toFixed(2)}, {player.player_name}
                </li>
            ))}
        </ul>
    );
};

export default PlayerList;
