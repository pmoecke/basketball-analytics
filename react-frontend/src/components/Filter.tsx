import React from 'react';

interface FilterProps {
  label: string;
  value: any | undefined;  // Allow value to be number or null
  onChange: (value: any | undefined) => void;  // Handler also must accept number or null
  options: Array<{ value: any; label: string }>;
}

const Filter: React.FC<FilterProps> = ({ label, value, onChange, options }) => {
  return (
    <div className='mt-3'>
      <div>{label}</div>
      <div>  {/* Changed from col-md-4 to col-md-8 for better spacing */}
      
        <select
          className="form-select"
          value={value === undefined ? "all" : value}
          onChange={(e) => onChange(e.target.value === 'all' ? undefined : e.target.value)}
        >
          <option value="all">-------</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;
