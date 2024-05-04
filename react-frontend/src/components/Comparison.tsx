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
        <div className="player-info">
          <span>{comparisonPlayers[0].player_name}</span>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => togglePlayerForComparison(comparisonPlayers[0])}
          >
            -
          </button>
        </div>
      ) : (
        <div className="player-info"></div>
      )}

      <button
        className="btn m-5 text-center btn-primary"
        onClick={() => {
          setShowComparisonModal(true);
        }}
        disabled={isCompareButtonDisabled}
      >
        Compare
      </button>

      {comparisonPlayers[1] ? (
        <div className="player-info">
          <span>{comparisonPlayers[1].player_name}</span>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => togglePlayerForComparison(comparisonPlayers[1])}
          >
            -
          </button>
        </div>
      ) : (
        <div className="player-info"></div>
      )}
    </div>
  );
};

export default ComparisonView;
