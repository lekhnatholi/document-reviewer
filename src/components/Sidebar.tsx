import React from 'react';
import { Dropdown, Form, Button } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { getBadgeColor, getInitials } from '../utils/colors';
import type { Section } from '../types';

interface SidebarProps {
  section: Section;
  selectedIds?: number[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onSelectAll: () => void;
  allSelected: boolean;
  onHover?: (id?: number) => void;
  onConfirm: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  section,
  selectedIds,
  onToggle,
  onRemove,
  onSelectAll,
  allSelected,
  onHover,
  onConfirm,
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Fields</div>
      <div>
        {section.children.map((field:any, idx:any) => (
          <div
            className={`field-card d-flex align-items-center mb-2${selectedIds?.includes(field.id) ? ' selected' : ''}`}
            key={field.id}
            onMouseEnter={() => onHover && onHover(field.id)}
            onMouseLeave={() => onHover && onHover(undefined)}
          >
            <div
              className="badge-initials"
              style={{ background: getBadgeColor(idx) }}
            >
              {getInitials(field.label)}
            </div>
            <div className="flex-grow-1">
              <div className="fw-bold text-truncate">{field.label}</div>
              <div className="text-truncate" style={{ color: '#b0b8be', fontSize: '0.95em' }}>
                {String(field.content.value)}
              </div>
            </div>
            <div className='d-flex justify-content-center gap-2'>
            <Form.Check
              type="checkbox"
              checked={selectedIds?.includes(field.id)}
              onChange={() => onToggle(field.id)}
              className="ms-2"
            />
            <div className="action-icons">
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  as="span"
                  className="three-dots-toggle"
                >
                  <ThreeDotsVertical className='mb-1' color="#b0b8be" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => onRemove(field.id)}>
                    Remove
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            </div>

          </div>
        ))}
      </div>
      <div className="mt-auto d-flex justify-content-between align-items-center pt-3 action-footer">
        <Button
          variant={allSelected ? 'secondary' : 'outline-secondary'}
          size="sm"
          onClick={onSelectAll}
        >
          Select all
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={selectedIds?.length ? selectedIds?.length < 1 : false}
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar; 