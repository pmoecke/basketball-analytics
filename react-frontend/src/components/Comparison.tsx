import React from "react";
import { PlayerArray } from "../types/player";
import { Player } from "../types/player";

import "./Comparison.css"

interface ComparisonViewProps {
  comparisonPlayers: PlayerArray;
  togglePlayerForComparison: (player: Player) => void;
  setShowComparisonModal: (show: boolean) => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  comparisonPlayers,
  togglePlayerForComparison,
  setShowComparisonModal,
}) => {
  const isCompareButtonDisabled = comparisonPlayers.length !== 2;

  return (
    <div className="player-comparison d-flex ">
      
      {comparisonPlayers[0] ? (
        <div className="player-info col-md-4 box">
          <span>{comparisonPlayers[0].player_name}</span>
          <button
            className="btn btn-danger btn-sm btn-remove"
            onClick={() => togglePlayerForComparison(comparisonPlayers[0])}
          >
            -
          </button>
        </div>
      ) : (
        <div className="player-info col-md-4 box"></div>
      )}

      

      <button
        className="btn text-center btn-primary col-md-3 box"
        onClick={() => {
          setShowComparisonModal(true);
        }}
        disabled={isCompareButtonDisabled}
      >
        Compare
      </button>

      {comparisonPlayers[1] ? (
        <div className="player-info col-md-4 box">
          <span>{comparisonPlayers[1].player_name}</span>
          <button
            className="btn btn-danger btn-sm btn-remove"
            onClick={() => togglePlayerForComparison(comparisonPlayers[1])}
          >
            -
          </button>
        </div>
      ) : (
        <div className="player-info col-md-4 box"></div>
      )}
    </div>
  );
};

export default ComparisonView;
