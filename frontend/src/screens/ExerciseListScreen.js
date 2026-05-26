import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import ExerciseCard from '../components/ExerciseCard';
import exercises from '../exercises';

const ExerciseListScreen = () => {
  return (
    <Container className="py-4">
      <h2 className="my-4 fw-bold">Baza Vežbi</h2>
      <h5 className="text-muted mb-4">Pronađi inspiraciju ili dodaj svoju omiljenu vežbu</h5>
      
      {/* Ovde će ići forma za dodavanje vežbe za ulogovane */}
      
      <Row>
        {exercises.map((exercise) => (
          <Col key={exercise._id} sm={12} md={6} lg={4} xl={3}>
            <ExerciseCard exercise={exercise} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ExerciseListScreen;