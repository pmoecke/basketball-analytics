import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import './MultiRangeSlider.css';

interface MultiRangeSliderProps {
  id: string; // Add an id prop
  min: number;
  max: number;
  onChange: (id: string, min: number, max: number) => void; // Update onChange to include id
}

const MultiRangeSlider: React.FC<MultiRangeSliderProps> = ({ id, min, max, onChange }) => {
  const [minVal, setMinVal] = useState<number>(min);
  const [maxVal, setMaxVal] = useState<number>(max);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = (value: number): number => ((value - min) / (max - min)) * 100;

  // Update the range styles when min or max values change
  useEffect(() => {
    if (range.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxVal);
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal]);

  // Handles the left thumb change
  const handleMinChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Math.min(Number(event.target.value), maxVal - 1);
    setMinVal(value);
    onChange(id, value, maxVal); // Pass id, minVal, and maxVal to onChange
  };

  // Handles the right thumb change
  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Math.max(Number(event.target.value), minVal + 1);
    setMaxVal(value);
    onChange(id, minVal, value); // Pass id, minVal, and maxVal to onChange
  };

  return (
    <div className="containr">
      <div className="slider">
        <div className="slider__track"></div>
        <div ref={range} className="slider__range"></div>
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          className="thumb thumb--left"
          style={{ zIndex: 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          className="thumb thumb--right"
          style={{ zIndex: 4 }}
        />
        <div className="slider__left-value">{minVal}</div>
        <div className="slider__right-value">{maxVal}</div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
