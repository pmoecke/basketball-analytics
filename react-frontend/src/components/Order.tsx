import React, { ChangeEvent } from 'react';
import { Player, OrderKeyValuePair, orderKeyValues } from '../types/player';
import { Button } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown, FaInfoCircle } from 'react-icons/fa';
import './Order.css';
import TooltipOverlay from './TooltipOverlay';

interface OrderProps {
  sortOrder: string;
  setSortOrder: (order: string) => void;
  orderValue: OrderKeyValuePair;
  setOrderValue: (value: OrderKeyValuePair) => void;
}

const Order: React.FC<OrderProps> = ({ sortOrder, setSortOrder, orderValue, setOrderValue }) => {
  
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedText = e.target.options[e.target.selectedIndex].text;
    const selectedValue = e.target.value as keyof Player;

    setOrderValue({ key: selectedText, value: selectedValue });

    console.log(`Selected text: ${selectedText}`);
    console.log(`Selected value: ${selectedValue}`);
  };

  const orderToolTips: { [key: string]: string } = {
    "off_score_1": "'Playing in the Paint' considers the following features: posts up made and attempted, cuts made and attempted, 2-pt field goals made and attempted and screen assists",
    "off_score_2": "'Perimeter Offense' considers the following features: 3-pt field goals made and attempted, assists, isolations made and attempted, catch and shoot made and attempted",
    "off_score_3": "'Driving Offense' considers the following features: catch and drive made and attempted, PnR handlers made and attempted, drives made and drives with shot",
    "def_score": "'Defensive Performance Indicator (DPI)' is calculated according to: DPI = blocks + fouls drawn - fouls + steals - turnovers + points off screen assists + assists to turnover ratio",
    "reb_score": "'Reboudning' is simply the rebounding score of a player",
  };
  
  return (
    <div className='d-flex '>
      <TooltipOverlay
            tooltipText={orderToolTips[orderValue["value"]]}
            placement="left"
            showTitle={false}
          >
          <FaInfoCircle className="ms-2 larger-icon padded-icon" style={{ cursor: 'pointer' }} />
        </TooltipOverlay>
      <div className="justify-content-left">
        <div>
          <select
            className="form-select no-right-round-corners"
            value={orderValue["value"]}
            onChange={(e) => handleChange(e)}
          >
            {orderKeyValues.map(keyValues => (
              <option key={keyValues["key"]} value={keyValues["value"]}>{keyValues["key"]}</option>
            ))}
          </select>
          </div>
      </div>
      <Button
        variant="secondary"
        className="no-left-round-corners"
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
        </Button>
    </div>
    
  );
};

export default Order;
