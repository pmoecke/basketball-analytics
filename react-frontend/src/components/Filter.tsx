import React from 'react';

interface FilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

const Filter: React.FC<FilterProps> = ({ label, value, onChange, options }) => {
  return (
    <div className="my-3 row">
      <p className="col-md-3 white">{label}</p>
      <div className="col-md-9">  {/* Changed from col-md-4 to col-md-8 for better spacing */}
        <select
          className="form-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">-------</option>
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
