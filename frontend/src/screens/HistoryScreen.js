import React from 'react';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import { FaClock, FaWeightHanging, FaTrophy } from 'react-icons/fa';
import historyData from '../historyData';

const HistoryScreen = () => {
  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">Istorija Treninga</h2>
      
      {historyData.map((workout) => (
        <Card key={workout._id} className="mb-4 shadow-sm border-0 bg-light">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h5 className="fw-bold mb-0">{workout.name}</h5>
            </div>
            <p className="text-muted small mb-3">{workout.date}</p>

            <Row className="mb-3 text-muted small">
              <Col xs={4} className="d-flex align-items-center">
                <FaClock className="me-1" /> {workout.duration}
              </Col>
              <Col xs={4} className="d-flex align-items-center">
                <FaWeightHanging className="me-1" /> {workout.volume}
              </Col>
              <Col xs={4} className="d-flex align-items-center text-success">
                <FaTrophy className="me-1" /> {workout.prs} PRs
              </Col>
            </Row>

            <div className="border-top pt-3">
              <Row className="fw-bold text-muted small mb-2">
                <Col xs={7}>Vežba</Col>
                <Col xs={5}>Najbolji Set</Col>
              </Row>
              {workout.exercises.map((ex, index) => (
                <Row key={index} className="small mb-1 align-items-center">
                  <Col xs={7}>
                    <span className="fw-bold">{ex.summary.split(' ')[0]} x </span> 
                    {ex.name}
                  </Col>
                  <Col xs={5}>{ex.best}</Col>
                </Row>
              ))}
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default HistoryScreen;