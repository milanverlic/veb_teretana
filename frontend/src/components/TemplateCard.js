import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaPlay, FaDumbbell } from 'react-icons/fa';

const TemplateCard = ({ template }) => {
  return (
    <Card className="my-3 p-3 rounded shadow-sm bg-light text-dark h-100 d-flex flex-column">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex align-items-center mb-2 text-muted">
          <FaDumbbell className="me-2" />
          <span>{template.category}</span>
        </div>
        <Card.Title as="h5">
          <strong>{template.name}</strong>
        </Card.Title>
        <Card.Text as="div" className="my-2">
          {template.exercises.map((ex, index) => (
            <div key={index} className="text-secondary small">
              - {ex}
            </div>
          ))}
        </Card.Text>
        <div className="mt-auto pt-3">
          <Button variant="outline-primary" className="w-100 d-flex align-items-center justify-content-center py-2">
            <FaPlay className="me-2" /> Koristi šablon
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TemplateCard;