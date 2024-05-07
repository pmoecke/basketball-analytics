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
}

const PlayerList: React.FC<PlayerListProps> = ({ players, setSelectedPlayer, setShowModal, togglePlayerForComparison, comparisonPlayers}) => {
    // Only show the first 100 players
    const slicedPlayers = players.slice(0, 100);
    return (
        <ul className="player-list">
            {slicedPlayers.map((player, index) => (
                <li
                className="player-row d-flex justify-content-between"
                key={`${player.player_id}-${index}`}
                onClick={() => {
                    const params: PlayerStatsFromIdParams = {
                        player_id: player.player_id
                      };
                    playerStatsFromId(params).then((data) => {
                        if (data !== undefined) {
                          console.log(data);
                          const player = data[0]
                          setSelectedPlayer(player);
                        }
                    }); 
                    setShowModal(true);
                }}
            >
            
                <div className='row-content'>
                    <TooltipOverlay tooltipText='Eff score = (PTS + REB + AST + STL + BLK − Missed FG − Missed FT - TO) / GP' placement="left">
                    {Math.round(player.efficiency_score).toFixed(2)} 
                    </TooltipOverlay>
                    : {player.player_name}
                </div>
              
                <div className="d-flex align-items-center">
                    
                    {player.games_played < 5 && ( // change value according to ml model
                        <TooltipOverlay tooltipText='Players with limited data are flagged; their stats may be inaccurate.' placement="left">
                            <FaFlag className='mx-3' style={{ color: 'red' }} />
                        </TooltipOverlay>
                    )}

                    <TooltipOverlay tooltipText='Add/remove from comparison' placement="left">  
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
