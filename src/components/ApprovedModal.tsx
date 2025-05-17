import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ApprovedModalProps {
  show: boolean;
  onClose: () => void;
}

const ApprovedModal: React.FC<ApprovedModalProps> = ({ show, onClose }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Fields Confirmed</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Fields confirmed and processed successfully!
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={onClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ApprovedModal; 