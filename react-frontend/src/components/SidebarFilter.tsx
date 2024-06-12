import React, { useState } from 'react';
import './SidebarFilter.css'; // Make sure to import the CSS
import Modal from "react-bootstrap/Modal";
import Filter from './Filter'
import FilterGraph from './FilterGraph'
import PlayerSearch from './PlayerSearch';

interface SidebarFilterProps {
    setPlayer_name: (name: string | undefined) => void; 
    season: string | undefined;
    setSeason: (value: string | undefined) => void;
    setPlayerFilterValues: ((value:[number[], number[]]) => void)
    isOpen: boolean;
    handleClose: () => void;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
     setPlayer_name,
     season,
     setSeason,
     setPlayerFilterValues,
     isOpen,
     handleClose,
    })  => {

  const [tempPlayerName, setTempPlayerName] = useState<string | undefined>(undefined);
  const [tempSeason, setTempSeason] = useState<string | undefined>(undefined);
  const [tempPlayerFilterValues, setTempPlayerFilterValues] = useState<[number[], number[]]>([[0, 0, 0, 0, 0], [100, 100, 100, 100, 100]]);
  
  const handleApplyFilters = () => {
    setPlayer_name(tempPlayerName);
    setSeason(tempSeason);
    setPlayerFilterValues(tempPlayerFilterValues);
    console.log("Filters Applied:", { player_name: tempPlayerName, season: tempSeason, playerFilterValues: tempPlayerFilterValues });
  };

  const seasonOptions = [
    { value: '2020-2021', label: '2020-2021' },
    { value: '2021-2022', label: '2021-2022' },
    { value: '2022-2023', label: '2022-2023' },
  ];

  // Filter graph values
  const [min] = useState([65, 65, 65, 65, 65]);
  const [max] = useState([85, 85, 85, 85, 85]);

  
  return (
    <Modal
      show={isOpen}
      onHide={handleClose}
      className="filter-modal"
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
                <PlayerSearch 
                  tempPlayerName={tempPlayerName}
                  setTempPlayerName={setTempPlayerName} 
                />
                
                <Filter
                  label="Season"
                  value={tempSeason}
                  onChange={setTempSeason}
                  options={seasonOptions}
                />
            </div>
            <div className="pentagon mt-4">
                <h1 className="fs-3 text-center white">Player Filter</h1>
                <FilterGraph 
                  min={min} 
                  max={max} 
                  setTempPlayerFilterValues={setTempPlayerFilterValues} 
                  handleApplyFilters={handleApplyFilters}
                  handleClose={handleClose} 
                />
            </div>
        </Modal.Body>
        <Modal.Footer className="filter-modal-footer">
      </Modal.Footer>
    </Modal> 
  );
};

export default SidebarFilter;
