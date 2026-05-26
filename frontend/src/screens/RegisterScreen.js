import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Lozinke se ne poklapaju!');
    } else {
      // Priprema za backend
      console.log('Spremno za backend registraciju: ', { name, email, password });
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Col xs={12} md={6}>
        <Card className="p-4 shadow-sm">
          <h2 className="mb-4 text-center">Registracija</h2>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Ime i prezime</Form.Label>
              <Form.Control type="text" placeholder="Unesi ime" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email adresa</Form.Label>
              <Form.Control type="email" placeholder="Unesi email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Lozinka</Form.Label>
              <Form.Control type="password" placeholder="Unesi lozinku" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Label>Potvrdi lozinku</Form.Label>
              <Form.Control type="password" placeholder="Ponovi lozinku" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 py-2">
              <FaUserPlus className="me-2" /> Registruj se
            </Button>
          </Form>

          <Row className="py-3 text-center">
            <Col>
              Već imaš nalog? <Link to="/login">Prijavi se</Link>
            </Col>
          </Row>
        </Card>
      </Col>
    </Container>
  );
};

export default RegisterScreen;