import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import TooltipOverlay from "./TooltipOverlay";
import "./AdvancedFilterModal.css";
import MultiRangeSlider from "./MultiRangeSlider";

interface AdvancedFilterModalProps {
  showModal: boolean;
  handleClose: () => void;
}

const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  showModal,
  handleClose,
}) => {
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
      <Modal.Body className="advanced-filter-modal-body rows">
        <div className="col-md-2">
          <TooltipOverlay
            tooltipText="This is an advanced dual range slider"
            placement="top"
          >
            Filter
          </TooltipOverlay>
          <MultiRangeSlider min={0} max={100} />

          <TooltipOverlay
            tooltipText="Kinda neat huh ^^"
            placement="top"
          >
            Filter2
          </TooltipOverlay>
          <MultiRangeSlider min={0} max={100} />
        </div>
        <div className="col-md-2">
          <TooltipOverlay
            tooltipText="This is an advanced dual range slider"
            placement="top"
          >
            Filter a
          </TooltipOverlay>
          <MultiRangeSlider min={0} max={100} />
        </div>
        <div className="col-md-2">
          <TooltipOverlay
            tooltipText="This is an advanced dual range slider"
            placement="top"
          >
            Filter b
          </TooltipOverlay>
          <MultiRangeSlider min={0} max={100} />
        </div>
        <div className="col-md-2">
          <TooltipOverlay
            tooltipText="This is an advanced dual range slider"
            placement="top"
          >
            Filter c
          </TooltipOverlay>
          <MultiRangeSlider min={0} max={100} />
        </div>
        <div className="col-md-2">
          <TooltipOverlay
            tooltipText="This is an advanced dual range slider"
            placement="top"
          >
            Filter d
          </TooltipOverlay>
          <MultiRangeSlider min={0} max={100} />
        </div>
      </Modal.Body>
      <Modal.Footer className="advanced-filter-modal-footer"></Modal.Footer>
    </Modal>
  );
};

export default AdvancedFilterModal;
