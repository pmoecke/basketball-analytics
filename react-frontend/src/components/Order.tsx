import React, { ChangeEvent } from 'react';
import { Player, OrderKeyValuePair, orderKeyValues } from '../types/player';
import { Button } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './Order.css';

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
  
  return (
    <div className="d-flex justify-content-left">
      <div className='me-0'>
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
