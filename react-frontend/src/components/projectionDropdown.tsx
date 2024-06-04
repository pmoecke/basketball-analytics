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
    "boxscore": "A boxscore provides the basic statistical summary of a basketball game, including points, rebounds, assists, and other key metrics.",
    "advanced_boxscore": "Advanced boxscore statistics include metrics like Player Efficiency Rating (PER), True Shooting Percentage (TS%), and other advanced analytics.",
    "additional_field_goal_data": "Additional field goal data includes detailed statistics on shot types, locations, and shooting efficiency.",
    "play_type_combinations": "Play type combinations describe how players perform in different play types such as pick-and-roll, isolation, and post-up plays.",
    "defense_against_play_type_combinations": "Defense against play type combinations measures how effectively a player or team defends against various offensive play types.",
    "drivers": "Drivers statistics track how often and effectively players drive to the basket, including drive frequency and success rate.",
    "drivers_defense": "Drivers defense measures how well a player or team defends against opponents' drives to the basket, including defensive success rate and impact."
  };

  return (
    <div className="d-flex justify-content-end align-items-center w-100">
      <TooltipOverlay
          tooltipText={projectionToolTips[projection!]}
          placement="left"
          showTitle={false}
        >
        <FaInfoCircle className="ms-2 larger-icon padded-icon" style={{ cursor: 'pointer' }} />
      </TooltipOverlay>
      <select
        className="form-select"
        value={projection}
        onChange={(e) => setProjection(e.target.value)}
        >
        {Object.entries(projectionOptions).map(([label, value]) => (
            <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
};

export default ProjectionDropdown;
