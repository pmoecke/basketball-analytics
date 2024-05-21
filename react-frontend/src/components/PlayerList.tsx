// PlayerList.tsx
import React from 'react';
import { Player, PlayerArray } from '../types/player';
import { FaFlag } from 'react-icons/fa';
import TooltipOverlay from "./TooltipOverlay";
import { playerStatsFromId, PlayerStatsFromIdParams } from '../router/data';
// Styling
import "./PlayerList.css";

interface PlayerListProps {
    players: PlayerArray;
    setSelectedPlayer: (player: Player) => void;
    setShowModal: (show: boolean) => void;
    togglePlayerForComparison: (player: Player) => void;
    comparisonPlayers: PlayerArray;
    highlightedPlayer: Player | null;
    setHighlightedPlayer: (player: Player | null) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, setSelectedPlayer, setShowModal, togglePlayerForComparison, comparisonPlayers, highlightedPlayer, setHighlightedPlayer}) => {
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
                          console.log(player);  
                          setHighlightedPlayer(player);
                        }
                    })  
                          
                }}
                onMouseLeave={() => {
                    setHighlightedPlayer(null);
                    console.log(null); 
                }}
            >
            
                <div className='row-content'>
                    <TooltipOverlay tooltipText='Eff score = (PTS + REB + AST + STL + BLK − Missed FG − Missed FT - TO) / GP' placement="left">
                    {Math.round(player.efficiency_score).toFixed(2)} 
                    </TooltipOverlay>
                    : {player.player_name}
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
                            {comparisonPlayers.find(p => p.player_id === player.player_id) ? '-' : '+'}
                        </button>
                    </TooltipOverlay>
                 </div>
            </li>
            ))}
        </ul>
    );
};

export default PlayerList;
