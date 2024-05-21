import React, { useState } from 'react';
import './SidebarFilter.css'; // Make sure to import the CSS
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Filter from './Filter'
import FilterGraph from './FilterGraph'
import PlayerSearch from './PlayerSearch';

interface SidebarFilterProps {
    showAdvancedFilterModal: boolean;
    setShowAdvancedFilterModal: (value: boolean) => void;
    setPlayer_name: (name: string | undefined) => void; 
    league_id: number | undefined;
    setLeague_id: (value: number | undefined) => void;
    team_id: number | undefined;
    setTeam_id: (value: number | undefined) => void;
    setPlayerFilterValues: ((value:[number[], number[]]) => void)
    isOpen: boolean;
    handleClose: () => void;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
     showAdvancedFilterModal, 
     setShowAdvancedFilterModal,
     setPlayer_name,
     league_id,
     setLeague_id,
     team_id,
     setTeam_id,
     setPlayerFilterValues,
     isOpen,
     handleClose,
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
    <Modal
      show={isOpen}
      onHide={handleClose}
      className={`filter-modal ${showAdvancedFilterModal ? 'blur-background' : ''}`}
      size="lg"
    >   
      <Modal.Header closeButton className="filter-modal-header">
        <Modal.Title>
          {"Filter"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="filter-modal-body">

        
            <div className="filter">
                <div>
                    <h1 className="fs-3 text-center white mb-3">General Filter</h1>
                </div>
                <PlayerSearch setPlayer_name={setPlayer_name} />
                
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
                <FilterGraph min={min} max={max} setPlayerFilterValues={setPlayerFilterValues} handleClose={handleClose} />
            </div>
        
        </Modal.Body>
        <Modal.Footer className="filter-modal-footer">
        
      </Modal.Footer>
    </Modal> 
  );
};

export default SidebarFilter;
