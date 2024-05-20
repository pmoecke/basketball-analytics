import React from 'react';
import TooltipOverlay from './TooltipOverlay'; // Import your custom TooltipOverlay component
import { FaInfoCircle } from 'react-icons/fa';
import './projectionDropdown.css';

interface ProjectionProps {
  projection: string | undefined;
  setProjection: (value: string) => void;
}

const ProjectionDropdown: React.FC<ProjectionProps> = ({ projection, setProjection }) => {
  const projectionOptions = {
    "Boxscore" : "boxscore",
    "Adv Boxscore" : "advanced_boxscore",
    "Additional Field Goal Data" : "additional_field_goal_data",
    "Play Type Combinations" : "play_type_combinations",
    "Defense Against Play Type Combinations" : "defense_against_play_type_combinations",
    "Drivers" : "drivers",
    "Drivers Defense" : "drivers_defense",

  }
  const projectionToolTips: { [key: string]: string } = {
    "boxscore": "GPT-4 is the latest language model from OpenAI.",
    "advanced_boxscore": "BERT is a transformer model designed for NLP tasks by Google.",
    "additional_field_goal_data": "T5 is a text-to-text transformer model developed by Google.",
    "play_type_combinations": "XLNet is a generalized autoregressive pretraining method for language understanding.",
    "defense_against_play_type_combinations": "BERT is a transformer model designed for NLP tasks by Google.",
    "drivers": "T5 is a text-to-text transformer model developed by Google.",
    "drivers_defense": "XLNet is a generalized autoregressive pretraining method for language understanding.",
  };

  

  return (
    <div className="d-flex justify-content-end align-items-center w-100">
    <select
        className="form-select"
        value={projection}
        onChange={(e) => setProjection(e.target.value)}
        >
        {Object.entries(projectionOptions).map(([label, value]) => (
            <option key={value} value={value}>{label}</option>
        ))}
        </select>
      <TooltipOverlay
        tooltipText={projectionToolTips[projection!]}
        placement="left"
        showTitle={false}
      >
        <FaInfoCircle className="ms-2 larger-icon padded-icon" style={{ cursor: 'pointer' }} />
      </TooltipOverlay>
    </div>
  );
};

export default ProjectionDropdown;
