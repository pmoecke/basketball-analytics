import React from 'react';
import { Player, playerKeys } from '../types/player';

interface OrderProps {
  sortOrder: string;
  setSortOrder: (order: string) => void;
  orderValue: keyof Player;
  setOrderValue: (value: keyof Player) => void;
}

const Order: React.FC<OrderProps> = ({ sortOrder, setSortOrder, orderValue, setOrderValue }) => {
  return (
    <div>
       <div className="my-3 row">
        <p className='col-md-3 white'>Value:</p>
        <div className='col-md-9'>
          <select
            className="form-select"
            value={orderValue}
            onChange={(e) => setOrderValue(e.target.value as keyof Player)}
          >
            {playerKeys.map(key => (
              <option key={key} value={key}>{key.replace(/_/g, ' ').replace(/-/g, ' ').replace(/%/g, '% ')}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="my-3 row">
        <p className='col-md-3 white'>Order:</p>
        <div className='col-md-9'>
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Order;
