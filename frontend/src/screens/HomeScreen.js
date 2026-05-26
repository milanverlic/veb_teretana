import React from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import TemplateCard from '../components/TemplateCard';
import workoutTemplates from '../workoutTemplates';
import { FaPlus, FaBook } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';

const HomeScreen = () => {
  // Ovo će kasnije biti pravi uslov (da li je korisnik ulogovan)
  const isUserLoggedIn = true; 

  return (
    <Container className="py-4">
      {/* Sekcija za Brzi Start */}
      <Row className="mb-5 text-center justify-content-center">
        <Col md={10} lg={8}>
          <h1 className="mb-4 display-5 fw-bold">FitFlow Centar</h1>
          <h4 className="text-muted mb-4">Započni novi trening ili nastavi sa šablonom</h4>
          
          {isUserLoggedIn ? (
            <Row className="gy-3 justify-content-center">
              <Col md={10}>
                <LinkContainer to="/workout/active">
                  <Button variant="primary" size="lg" className="w-100 py-3 shadow d-flex align-items-center justify-content-center fs-4">
                    <FaPlus className="me-3" /> Započni PRAZAN trening
                  </Button>
                </LinkContainer>
              </Col>
            </Row>
          ) : (
            <Row className="gy-3 justify-content-center">
              <Col md={10}>
                <LinkContainer to="/login">
                  <Button variant="outline-primary" size="lg" className="w-100 py-3 d-flex align-items-center justify-content-center fs-4">
                     Prijavi se za početak treninga
                  </Button>
                </LinkContainer>
              </Col>
            </Row>
          )}
        </Col>
      </Row>

      {/* Sekcija za Šablone */}
      <h2 className="mb-4">Popularni Šabloni</h2>
      <Row className="g-4">
        {workoutTemplates.map((template) => (
          <Col key={template._id} sm={12} md={6} lg={4}>
            <TemplateCard template={template} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomeScreen;