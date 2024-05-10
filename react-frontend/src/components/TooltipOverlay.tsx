import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface TooltipOverlayProps {
  tooltipText: string;
  placement: 'top' | 'right' | 'bottom' | 'left';
  children: any;
  showTitle?: boolean;
}

// Reusable OverlayTrigger component
const TooltipOverlay: React.FC<TooltipOverlayProps> = ({ tooltipText, placement, children , showTitle = true}) => {
    const [show, setShow] = useState(false);

    // Function to show tooltip
    const handleShow = () => setShow(true);

    // Function to hide tooltip
    const handleHide = () => setShow(false);

    return (
        <OverlayTrigger
            placement={placement}
            overlay={
                <Tooltip id={`tooltip-${tooltipText}`} onMouseOver={handleShow} onMouseOut={handleHide}>
                    <div style={{ textAlign: 'left' }}>
                    {showTitle && <div><strong>{children}</strong><br /></div>}
                        {tooltipText}
                    </div>
                </Tooltip>
            }
            show={show}
            onToggle={setShow}
            trigger={['hover', 'focus']} // Respond to hover and focus
            delay={{ show: 100, hide: 0 }} // Adjust timings as needed
        >
            <span onMouseOver={handleShow} onMouseOut={handleHide}>
                {children}
            </span>
        </OverlayTrigger>
    );
};

export default TooltipOverlay;
