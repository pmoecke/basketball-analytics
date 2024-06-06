import React from 'react';
import { Player, playerKeys2 } from '../types/player';
import { Button } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './Order2.css';

interface OrderProps {
  sortOrder: string;
  setSortOrder: (order: string) => void;
  orderValue: keyof Player;
  setOrderValue: (value: keyof Player) => void;
}

const Order2: React.FC<OrderProps> = ({ sortOrder, setSortOrder, orderValue, setOrderValue }) => {
  return (
    <div className="d-flex justify-content-center">
      <div className='me-0'>
        <select
          className="form-select no-left-round-corners no-right-round-corners"
          value={orderValue}
          onChange={(e) => setOrderValue(e.target.value as keyof Player)}
        >
          {playerKeys2.map(key => (
            <option key={key} value={key}>{key.replace(/_/g, ' ').replace(/-/g, ' ').replace(/%/g, '% ')}</option>
          ))}
        </select>
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

export default Order2;
