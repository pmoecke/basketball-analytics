// PlayerList.tsx
import React from 'react';
import { Player, PlayerArray } from '../types/player';
// Styling
import "./PlayerList.css";

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
                    id: {player.player_id}, name: {player["player-name"]}, points: {player.points}, jersey_number: {player.jersey_number}
                </li>
            ))}
        </ul>
    );
};

export default PlayerList;
