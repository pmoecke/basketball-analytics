import React from 'react';

interface ProjectionProps {
  projection: string | undefined;
  setProjection: (value: string) => void;
}

const Projection: React.FC<ProjectionProps> = ({ projection, setProjection }) => {
  const projectionOptions = {
    "Boxscore" : "boxscore",
    "Adv Boxscore" : "advanced_boxscore",
    "Additional Field Goal Data" : "additional_field_goal_data",
    "Play Type Combinations" : "play_type_combinations",
    "Defense Against Play Type Combinations" : "defense_against_play_type_combinations",
    "Drivers" : "drivers",
    "Drivers Defense" : "drivers_defense",

  }

  return (
    <div className="row">
    <h1 className="fs-3 white">Projection</h1>
    <div className='col-md-6'>
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
</div>
  );
};

export default Projection;
