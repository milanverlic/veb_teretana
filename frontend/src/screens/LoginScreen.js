import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    // Ovde će ići Redux akcija za slanje podataka na backend
    console.log('Spremno za backend: ', { email, password });
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Col xs={12} md={6}>
        <Card className="p-4 shadow-sm">
          <h2 className="mb-4 text-center">Prijava</h2>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email adresa</Form.Label>
              <Form.Control type="email" placeholder="Unesi email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Lozinka</Form.Label>
              <Form.Control type="password" placeholder="Unesi lozinku" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 py-2">
              <FaSignInAlt className="me-2" /> Prijavi se
            </Button>
          </Form>

          <Row className="py-3 text-center">
            <Col>
              Nemaš nalog? <Link to="/register">Registruj se</Link>
            </Col>
          </Row>
        </Card>
      </Col>
    </Container>
  );
};

export default LoginScreen;