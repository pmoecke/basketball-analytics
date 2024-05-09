import React, { useState } from 'react';
import './SidebarFilter.css'; // Make sure to import the CSS
import Filter from './Filter'
import FilterGraph from './FilterGraph'

interface SidebarFilterProps {
    showAdvancedFilterModal: boolean;
    setShowAdvancedFilterModal: (value: boolean) => void;
    league_id: number | undefined;
    setLeague_id: (value: number | undefined) => void;
    team_id: number | undefined;
    setTeam_id: (value: number | undefined) => void;
    isOpen: boolean;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
     showAdvancedFilterModal : boolean, 
     setShowAdvancedFilterModal,
     league_id,
     setLeague_id,
     team_id,
     setTeam_id,
     isOpen
    })  => {

  const leagueOptions = [
    { value: 1, label: "Basket League" },
    { value: 2, label: "LEB Oro" },
  ];

  const teamOptions = [
    { value: 1, label: "Larisa BC" },
    { value: 4, label: "Olympiacos BC" },
  ];

  // Filter graph values
  const [min] = useState([65, 65, 65, 65, 65]);
  const [max] = useState([85, 85, 85, 85, 85]);

  return (
    <div>
        
            <div className="filter">
                <div>
                    <h1 className="fs-3 text-center white">General Filter</h1>
                </div>
                
                <Filter
                label="League"
                value={league_id}
                onChange={setLeague_id}
                options={leagueOptions}
                />
                <Filter
                label="Team"
                value={team_id}
                onChange={setTeam_id}
                options={teamOptions}
                />
            </div>
            <div className="pentagon">
                <h1 className="fs-3 text-center white">Player Filter</h1>
                <FilterGraph min={min} max={max} />
            </div>
            <div className="advanced">
                <button
                className="btn text-center btn-secondary w-100"
                onClick={() => {
                    setShowAdvancedFilterModal(true);
                }}
                //style={{ backgroundColor: 'grey' }}  // Replace colors as needed
                >
                Advanced Filter
                </button>
            </div>
      
    </div> 
  );
};

export default SidebarFilter;
