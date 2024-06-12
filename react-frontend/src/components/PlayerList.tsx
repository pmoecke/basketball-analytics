// PlayerList.tsx
import React from 'react';
import { Player, PlayerArray, OrderKeyValuePair } from '../types/player';
import TooltipOverlay from "./TooltipOverlay";
import { playerStatsFromId, PlayerStatsFromIdParams } from '../router/data';
// Styling
import "./PlayerList.css";

interface PlayerListProps {
    players: PlayerArray;
    setSelectedPlayer: (player: Player) => void;
    setShowModal: (show: boolean) => void;
    orderValue: OrderKeyValuePair;
    togglePlayerForComparison: (player: Player) => void;
    comparisonPlayers: PlayerArray;
    highlightedPlayer: Player | null;
    setHighlightedPlayer: (player: Player | null) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ 
    players, 
    setSelectedPlayer, 
    setShowModal, 
    orderValue,
    togglePlayerForComparison, 
    comparisonPlayers, 
    highlightedPlayer, 
    setHighlightedPlayer
}) => {

    // Only show the first 100 players
    return (
        <ul className="player-list">
            {players.map((player, index) => (
                <li
                className="player-row d-flex justify-content-between"
                key={`${player.player_id}-${index}`}
                onClick={() => {
                    const params: PlayerStatsFromIdParams = {
                        player_id: [player.player_id]
                      };
                    playerStatsFromId(params).then((data) => {
                        if (data !== undefined) {
                          const player = data[0]
                          setSelectedPlayer(player);
                        }
                    }); 
                    setShowModal(true);
                }}
                onMouseEnter={() => {
                    const params: PlayerStatsFromIdParams = {
                        player_id: [player.player_id]
                      };
                    playerStatsFromId(params).then((data) => {
                        if (data !== undefined) {
                          const player = data[0] 
                          setHighlightedPlayer(player);
                        }
                    })  
                          
                }}
                onMouseLeave={() => {
                    setHighlightedPlayer(null);
                    // console.log(null); 
                }}
                >
                <div className='row-content'>
                    {(player[orderValue["value"]] as number).toFixed(2)} - {player.player_name}
                </div>
                <div className="d-flex align-items-center">
                    <TooltipOverlay tooltipText='Add/remove from comparison' placement="left" showTitle={false}>  
                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                togglePlayerForComparison(player);
                            }}
                            className={`btn ${
                                comparisonPlayers.find(p => p.player_id === player.player_id) ? 'btn-danger' : 
                                comparisonPlayers.length >= 2 ? 'btn-tertary' : 'btn-success'
                            }`}
                            style={{ display: comparisonPlayers.find(p => p.player_id === player.player_id) ? 'block' : comparisonPlayers.length >= 2 ? 'none' : 'block' }}
                        >
                            {comparisonPlayers.find(p => p.player_id === player.player_id) ? 'Remove Compare' : 'Add Compare'}
                        </button>
                    </TooltipOverlay>
                 </div>
            </li>
            ))}
        </ul>
    );
};

export default PlayerList;
