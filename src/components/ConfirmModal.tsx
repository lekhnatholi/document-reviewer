import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  selectedCount: number;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ show, onConfirm, onCancel, selectedCount }) => (
  <Modal show={show} onHide={onCancel} centered>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Selection</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Are you sure you want to confirm the {selectedCount} selected field{selectedCount > 1 ? 's' : ''}?
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onConfirm}>
        Confirm
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmModal; 