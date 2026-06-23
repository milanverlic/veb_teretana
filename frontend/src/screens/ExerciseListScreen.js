import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Button, Modal, Form, Spinner, Card } from 'react-bootstrap';
import { FaPlus, FaDumbbell, FaBullseye, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const ExerciseListScreen = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Stanje za Modal nove vežbe
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState('Grudi');
  const [newExerciseDescription, setNewExerciseDescription] = useState('');

  // STANJE ZA OPIS VEŽBE: Pamti koja je vežba kliknuta za prikaz opisa
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const categories = ['Grudi', 'Leđa', 'Noge', 'Ramena', 'Ruke', 'Trbušnjaci', 'Kardio'];

  // Učitavanje vežbi iz baze prilikom otvaranja ekrana
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/exercises');
        if (data.success) {
          setExercises(data.data);
        }
        setLoading(false);
      } catch (err) {
        setError('Greška prilikom učitavanja vežbi iz baze.');
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Otvaranje detalja o vežbi na klik kartice
  const handleCardClick = (exercise) => {
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (newExerciseName.trim()) {
      const newEx = {
        _id: Date.now().toString(),
        name: newExerciseName,
        category: newExerciseCategory,
        description: newExerciseDescription || 'Korisnički opis...',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=500&auto=format&fit=crop' 
      };
      
      setExercises([newEx, ...exercises]);
      setNewExerciseName('');
      setNewExerciseDescription('');
      setShowAddModal(false);
    }
  };

  return (
    <Container className="py-4 app-background-overlay">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="mb-0 fw-bold text-light">Baza Vežbi</h2>
          <p className="text-muted mb-0">Izgradi savršenu formu uz detaljan vodič kroz vežbe snage i oblikovanja</p>
        </div>
        <Button variant="primary" size="lg" className="d-flex align-items-center px-4 shadow" onClick={() => setShowAddModal(true)}>
          <FaPlus className="me-2" /> Dodaj Svoju
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" role="status" style={{ width: '4rem', height: '4rem' }} />
          <p className="text-muted mt-3">Učitavanje baze vežbi...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <Row className="g-4">
          {exercises.map((exercise) => (
            <Col key={exercise._id} sm={12} md={6} lg={4} xl={3}>
              {/* Kartica postaje kliktava i okida prikaz detalja */}
              <Card 
                onClick={() => handleCardClick(exercise)}
                className="my-3 p-2 rounded shadow-sm h-100 d-flex flex-column border-0"
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Card.Body className="d-flex flex-column pb-1 text-center">
                  <Card.Title as="h5" className="fw-bold mb-2 text-light">
                    <strong>{exercise.name}</strong>
                  </Card.Title>
                  <Card.Text as="div" className="mb-2 text-light small">
                    <FaDumbbell className="me-1 text-primary" /> {exercise.category}
                  </Card.Text>
                </Card.Body>
                
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
            </Col>
          ))}
        </Row>
      )}

      {/* NOVI MODAL: Prikaz detalja i opisa kliknute vežbe */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="lg" className="glass-modal">
        {selectedExercise && (
          <>
            <Modal.Header closeButton className="border-secondary text-light">
              <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                <span>🏋️‍♂️</span> {selectedExercise.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-light bg-dark-custom p-4" style={{ backgroundColor: '#1e293b' }}>
              <Row className="align-items-center g-4">
                <Col md={5} className="text-center">
                  <div className="p-3 bg-black rounded border border-secondary d-flex align-items-center justify-content-center" style={{ height: '220px', background: 'rgba(0,0,0,0.3)' }}>
                    <img src={selectedExercise.imageUrl} alt={selectedExercise.name} className="img-fluid rounded" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                </Col>
                <Col md={7}>
                  <div className="d-flex gap-2 mb-3">
                    <span className="badge bg-primary px-3 py-2 d-flex align-items-center gap-1" style={{ borderRadius: '6px' }}>
                      <FaDumbbell /> {selectedExercise.category}
                    </span>
                    <span className="badge bg-secondary px-3 py-2 d-flex align-items-center gap-1" style={{ borderRadius: '6px', backgroundColor: '#475569' }}>
                      <FaBullseye className="text-warning" /> Mišićni Fokus
                    </span>
                  </div>
                  <h5 className="fw-bold text-primary mb-2">Uputstvo za izvođenje:</h5>
                  <p className="text-white-50" style={{ lineHeight: '1.6', fontSize: '1.05rem' }}>
                    {selectedExercise.description}
                  </p>
                  <div className="mt-3 p-2 rounded border border-info" style={{ backgroundColor: 'rgba(14, 116, 144, 0.1)', fontSize: '0.9rem' }}>
                    <span className="text-info fw-bold d-block">💡 Savet:</span>
                    <span className="text-white-50">Radite pokret kontrolisano. Fokusirajte se na kontrakciju ciljanog mišića, a ne samo na pomeranje težine.</span>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className="border-secondary">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)} className="fw-bold">
                Zatvori
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* POSTOJEĆI MODAL: Forma za dodavanje nove vežbe */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered className="glass-modal">
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
              <Form.Select 
                value={newExerciseCategory} 
                onChange={(e) => setNewExerciseCategory(e.target.value)}
                className="glass-input"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-dark bg-light">
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="newExerciseDescription">
              <Form.Label className="text-muted small">Kratak opis</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2}
                placeholder="Opišite izvođenje vežbe..." 
                value={newExerciseDescription} 
                onChange={(e) => setNewExerciseDescription(e.target.value)} 
                className="glass-input"
              />
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