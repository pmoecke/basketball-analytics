import React from 'react';

interface OrderProps {
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const Order: React.FC<OrderProps> = ({ sortOrder, setSortOrder }) => {
  return (
    <div className="my-3 row">
      <p className='col-md-3 white'>Ordering</p>
      <div className='col-md-9'>
        <select
          className="form-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Default</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default Order;
