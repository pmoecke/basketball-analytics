import React from 'react';
import TooltipOverlay from './TooltipOverlay'; // Import your custom TooltipOverlay component
import { FaInfoCircle } from 'react-icons/fa';
import './AiModelDropdown.css';

interface AiModelDropdownProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const AiModelDropdown: React.FC<AiModelDropdownProps> = ({ selectedModel, setSelectedModel }) => {
  const aiModels = ["GPT-4", "BERT", "T5", "XLNet"];
  const modelTooltips: { [key: string]: string } = {
    "GPT-4": "GPT-4 is the latest language model from OpenAI.",
    "BERT": "BERT is a transformer model designed for NLP tasks by Google.",
    "T5": "T5 is a text-to-text transformer model developed by Google.",
    "XLNet": "XLNet is a generalized autoregressive pretraining method for language understanding."
  };

  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedModel(eventKey);
    }
  };

  return (
    <div className="d-flex justify-content-end align-items-center w-100">
      <select
        className="form-select narrow-select"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        {aiModels.map((model, index) => (
          <option key={index} value={model}>
            {model}
          </option>
        ))}
      </select>
      <TooltipOverlay
        tooltipText={modelTooltips[selectedModel]}
        placement="left"
        showTitle={false}
      >
        <FaInfoCircle className="ms-2 larger-icon padded-icon" style={{ cursor: 'pointer' }} />
      </TooltipOverlay>
    </div>
  );
};

export default AiModelDropdown;
