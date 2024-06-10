import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Nav, Tab, Button } from 'react-bootstrap';
import MultiRangeSlider from "./MultiRangeSlider";
import { statDictionary } from "./statDictionary";
import "./AdvancedFilterModal.css";
import TooltipOverlay from "./TooltipOverlay";
import { tooltipTexts } from "./tooltipTexts";
import { statMapping } from "./statMapping";

interface AdvancedFilterModalProps {
  showModal: boolean;
  handleClose: () => void;
  setProjectionCols: (value: string[]) => void;
}

const COLUMNS = ["games-played", "minutes", "points", "points-per-player-possession",
"field-goals-made", "field-goals-attempted", "field-goals-pct",
"3-pt-field-goals-made", "3-pt-field-goals-attempted",
"3-pt-field-goals-pct", "free-throws-made", "free-throws-attempted",
"free-throws-pct", "rebounds", "offensive-rebounds",
"defensive-rebounds", "assists", "steals", "turnovers", "blocks",
"fouls", "fouls-drawn", "plus/minus", "2-pt-field-goals-made",
"2-pt-field-goals-attempted", "2-pt-field-goals-pct",
"points-off-assists", "screen-assist", "points-off-screen-assists",
"number-of-player-possessions", "team-points-with-player",
"offensive-rating", "opponent-possessions-played",
"opponent-points-with-player", "defensive-rating", "net-rating",
"assists-to-turnovers", "steals-to-turnovers", "draw-foul-rate",
"true-shooting-percentage", "effective-field-goal-percentage",
"uncontested-field-goals-made", "uncontested-field-goals",
"uncontested-field-goals-pct", "contested-field-goals-made",
"contested-field-goals", "contested-field-goals-pct",
"opponent-field-goals-made", "opponent-field-goals-attempted",
"opponent-field-goals-pct", "transitions-made",
"transitions-attempted", "transition-attacks-pct",
"catch-and-shoot-made", "catch-and-shoot-attempted",
"catch-and-shoot-shots-made-pct", "catch-and-drive-made",
"catch-and-drive-attempted", "catch-and-drive-shots-made-pct",
"screens-off-made", "screens-off-attempted", "screens-off-pct",
"posts-up-made", "posts-up-attempted", "post-up-pct",
"isolations-made", "isolations-attempted", "isolation-pct",
"hand-off-made", "hand-off-attempted", "hand-off-pct", "cuts-made",
"cuts-attempted", "cuts-pct", "pnr-handlers-made",
"pnr-handlers-attempted", "pr-handler-pct", "pnr-rollers-made",
"pnr-rollers-attempted", "pr-roller-pct", "pnp-made",
"pnp-attempted", "pick-n-pops-pct", "opp-transition-shots-made",
"opp-transition-shots", "opponent-transition-shots-made-pct",
"opp-catch-and-shoot-shots-made", "opp-catch-and-shoot-shots",
"opp-catch-and-shoot-shots-made-pct",
"opp-catch-and-drive-shots-made", "opp-catch-and-drive-shots",
"opp-catch-and-drive-shots-made-pct", "opp-screens-off-shots-made",
"opp-screens-off-shots", "opponent-screens-off-shots-made-pct",
"opp-post-up-shots-made", "opp-post-up-shots",
"opponent-post-up-shots-made-pct", "opp-isolations-shots-made",
"opp-isolations-shots", "opponent-isolation-shots-made-pct",
"opp-hand-off-shots-made", "opp-hand-off-shots",
"opponent-hand-off-shots-made-pct", "opp-cuts-shots-made",
"opp-cuts-shots", "opponent-cuts-shots-made-pct",
"opp-pick-n-roll-shots-made", "opp-pick-n-roll-shots",
"opponent-pick-n-roll-shots-made-pct", "opp-pick-n-pop-shots-made",
"opp-pick-n-pop-shots", "opponent-pick-n-pop-shots-made-pct",
"drives-made", "drives-with-shot", "drives-pct",
"right-drives-made", "right-drives", "right-drives-made-pct",
"left-drives-made", "left-drives", "left-drives-made-pct",
"opp-drives-shots-made", "opp-drives-shots",
"opponent-drives-shots-made-pct"]

const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  showModal,
  handleClose,
  setProjectionCols,
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    
    setSelectedAttributes(prevSelectedAttributes => {
      if (checked) {
        // Add the checked category to the state
        return [...prevSelectedAttributes, id];
      } else {
        // Remove the unchecked category from the state
        return prevSelectedAttributes.filter(attribute => attribute !== id);
      }
    });
  };

  const applyCheckedValues = () => {
    selectedAttributes.forEach(attribute => console.log(attribute));
    setProjectionCols(selectedAttributes)
    handleClose()
  };
 
  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      className="advanced-filter-modal"
      size="xl"
    >
      <Modal.Header closeButton className="advanced-filter-modal-header">
        <Modal.Title>Configure Custom Projection</Modal.Title>
      </Modal.Header>
      <Modal.Body className="advanced-filter-modal-body">
        <div className="container">
          <div className="row">
            {COLUMNS.map((attribute, index) => (
              <div className="col-md-4" key={attribute}>
                <label className="sliding-checkbox">
                  <input
                    type="checkbox"
                    id={attribute}
                    checked={selectedAttributes.includes(attribute)}
                    onChange={handleCheckboxChange}
                  />
                  {attribute}
                </label>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="advanced-filter-modal-footer">
        <Button variant="primary" onClick={applyCheckedValues}>Apply Configuration</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdvancedFilterModal;
