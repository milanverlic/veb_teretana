import React, { useState } from 'react';
import { Row, Col, Container, Card, Button, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaDumbbell } from 'react-icons/fa';
import exercisesData, { muscleGroups } from '../exercises'; // Importujemo podatke i master listu grupa

const ExerciseListScreen = () => {
  // Stanje za listu vežbi (kako bismo mogli da dodajemo nove lokalno)
  const [exercises, setExercises] = useState(exercisesData);
  
  // Stanje za kontrolu Modal forme
  const [showModal, setShowModal] = useState(false);
  
  // Stanje za formu nove vežbe
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState(muscleGroups[0]); // Podrazumevana prva grupa

  // Funkcija za dodavanje nove vežbe (lokalna simulacija, kasnije Redux/Backend)
  const handleAddExercise = (e) => {
    e.preventDefault();
    if (newExerciseName.trim()) {
      const newEx = {
        _id: Date.now().toString(), // Privremeni jedinstveni ID
        name: newExerciseName,
        category: newExerciseCategory,
        description: 'Opis koji je korisnik dodao prilikom kreiranja...',
        // Koristimo generic skicu za nove vežbe dok korisnik ne ubaci pravu
        imageSketch: '/images/anatomija_placeholder.png' 
      };
      
      setExercises([newEx, ...exercises]); // Dodajemo novu vežbu na vrh liste
      setNewExerciseName(''); // Resetujemo formu
      setShowModal(false); // Zatvaramo formu
    }
  };

  return (
    <Container className="py-4 app-background-overlay">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="mb-0 fw-bold text-light">Baza Vežbi</h2>
          <p className="text-muted mb-0">Pronađi inspiraciju ili dodaj svoju omiljenu vežbu</p>
        </div>
        {/* Dugme za dodavanje nove vežbe */}
        <Button variant="primary" size="lg" className="d-flex align-items-center px-4 shadow" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" /> Dodaj Svoju
        </Button>
      </div>

      <Row className="g-4">
        {exercises.map((exercise) => (
          <Col key={exercise._id} sm={12} md={6} lg={4} xl={3}>
            {/* Kartica vežbe sa Glassmorphism efektom (CSS već imamo u index.css) */}
            <Card className="my-3 p-2 rounded shadow-sm h-100 d-flex flex-column border-0">
              <Card.Body className="d-flex flex-column pb-1 text-center">
                <Card.Title as="h5" className="fw-bold mb-2 text-light">
                  <strong>{exercise.name}</strong>
                </Card.Title>
                <Card.Text as="div" className="mb-2 text-light small">
                  <FaDumbbell className="me-1 text-primary" /> {exercise.category}
                </Card.Text>
              </Card.Body>
              
              {/* Sekcija za skicu vežbe na dnu kartice */}
              <div className="p-2 bg-dark rounded border border-secondary mx-2 mb-2 text-center d-flex align-items-center justify-content-center" style={{height: '140px', background: 'rgba(0,0,0,0.4) !important'}}>
                {/* Fallback na placeholder ako slika fali u bazi */}
                <Card.Img 
                  src={exercise.imageSketch} 
                  variant="bottom" 
                  alt={`Skica za ${exercise.name}`} 
                  className="img-fluid"
                  style={{maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal Forma za dodavanje nove vežbe */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="glass-modal">
        <Modal.Header closeButton>
          <Modal.Title className="text-light fw-bold">Dodaj Svoju Vežbu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddExercise}>
            <Form.Group className="mb-3" controlId="newExerciseName">
              <Form.Label className="text-muted small">Ime vežbe</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Npr. Potisak bučicama" 
                value={newExerciseName} 
                onChange={(e) => setNewExerciseName(e.target.value)} 
                required
                className="glass-input"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="newExerciseCategory">
              <Form.Label className="text-muted small">Mišićna grupa / Deo tela</Form.Label>
              {/* Napredni Padajući Meni sa spojenim grupama */}
              <Form.Select 
                value={newExerciseCategory} 
                onChange={(e) => setNewExerciseCategory(e.target.value)}
                className="glass-input"
              >
                {muscleGroups.map((group) => (
                  <option key={group} value={group} className="text-dark bg-light">
                    {group}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" size="lg">
                <FaPlus className="me-2" /> Sačuvaj u bazu
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default ExerciseListScreen;