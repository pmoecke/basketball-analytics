import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Nav, Tab, Button } from 'react-bootstrap';
import MultiRangeSlider from "./MultiRangeSlider";
import { statDictionary } from "./statDictionary";
import "./AdvancedFilterModal.css";
import TooltipOverlay from "./TooltipOverlay";
import { tooltipTexts } from "./tooltipTexts";
import { statMapping } from "./statMapping";

interface AdvancedFilterModalProps {
  showModal: boolean;
  handleClose: () => void;
}

const categoryNames: { [key: string]: string } = {
  "AdditionalData": "Additional Data",
  "Boxscore": "Boxscore",
  "DefenseAgainstShootingCombinations": "Defense Against Shooting",
  "Drives": "Drives",
  "DrivesDefense": "Drives Defense",
  "Efficiency": "Efficiency",
  "PlayTypeCombinations": "Play Type Combinations",
  "Stats": "Stats"
};

const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  showModal,
  handleClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(Object.keys(statDictionary)[0]);
  const [sliderValues, setSliderValues] = useState<{ [key: string]: { min: number, max: number } }>({});

  useEffect(() => {
    const initialSliderValues: { [key: string]: { min: number, max: number } } = {};
    Object.keys(statDictionary).forEach(category => {
      statDictionary[category].forEach(subCategory => {
        initialSliderValues[subCategory] = { min: 0, max: 100 }; // Initialize with default values
      });
    });
    setSliderValues(initialSliderValues);
  }, []);

  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedCategory(eventKey);
    }
  };

  const handleSliderChange = (id: string, min: number, max: number) => {
    setSliderValues(prevValues => ({
      ...prevValues,
      [id]: { min, max }
    }));
  };

  const handlePrintValues = () => {
    const lines = Object.entries(sliderValues).map(
      ([id, values]) => `${id}:(${values.min},${values.max})`
    );
    console.log(lines.join('\n'));
  };

  const categories = Object.keys(statDictionary);

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      className="advanced-filter-modal"
      size="xl"
    >
      <Modal.Header closeButton className="advanced-filter-modal-header">
        <Modal.Title>Advanced Filter</Modal.Title>
      </Modal.Header>
      <Modal.Body className="advanced-filter-modal-body">
        <Tab.Container id="left-tabs-example" activeKey={selectedCategory} onSelect={handleSelect}>
          <Nav variant="tabs" activeKey={selectedCategory} onSelect={handleSelect} className="mb-0">
            {categories.map((category) => (
              <Nav.Item key={category}>
                <Nav.Link eventKey={category}>{categoryNames[category]}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Tab.Content>
            {categories.map((category) => (
              <Tab.Pane eventKey={category} key={category}>
                <div className="container">
                  <div className="row">
                    {statDictionary[category].map((subCategory) => (
                      <div className="col-md-3 mt-3" key={subCategory}>
                        <div className="text-center strong">
                          <TooltipOverlay
                            tooltipText={tooltipTexts[statMapping[subCategory]]}
                            placement="top"
                            children={statMapping[subCategory]}
                          />
                        </div>
                        <MultiRangeSlider
                          id={subCategory}
                          min={0}
                          max={100}
                          onChange={handleSliderChange}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer className="advanced-filter-modal-footer">
        <Button variant="primary" onClick={handlePrintValues}>Print Slider Values</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdvancedFilterModal;
