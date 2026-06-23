import React from 'react';
import { Card } from 'react-bootstrap';
import { FaDumbbell } from 'react-icons/fa';

const ExerciseCard = ({ exercise }) => {
  return (
    <Card className="my-3 p-2 rounded shadow-sm h-100 d-flex flex-column border-0">
      <Card.Body className="d-flex flex-column pb-1 text-center">
        <Card.Title as="h5" className="fw-bold mb-2 text-light">
          <strong>{exercise.name}</strong>
        </Card.Title>
        <Card.Text as="div" className="mb-2 text-light small">
          <FaDumbbell className="me-1 text-primary" /> {exercise.category}
        </Card.Text>
      </Card.Body>
      
      {/* Sekcija za sliku/GIF vežbe povučenu direktno iz MongoDB baze */}
      <div className="p-2 bg-dark rounded border border-secondary mx-2 mb-2 text-center d-flex align-items-center justify-content-center" style={{ height: '140px', background: 'rgba(0,0,0,0.4)' }}>
        <Card.Img 
          src={exercise.imageUrl} 
          variant="bottom" 
          alt={`Slika za ${exercise.name}`} 
          className="img-fluid"
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
        />
      </div>
    </Card>
  );
};

export default ExerciseCard;