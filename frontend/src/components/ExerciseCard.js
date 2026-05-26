import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ExerciseCard = ({ exercise }) => {
  return (
    <Card className="my-3 p-3 rounded shadow-sm">
      <Card.Body>
        <Link to={`/exercise/${exercise._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card.Title as="h5">
            <strong>{exercise.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div" className="mb-2 text-muted">
          Kategorija: {exercise.category}
        </Card.Text>
        <Card.Text as="div">
          <span className={`badge ${exercise.difficulty === 'Teško' ? 'bg-danger' : 'bg-warning text-dark'}`}>
            {exercise.difficulty}
          </span>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ExerciseCard;