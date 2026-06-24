import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { FaDumbbell, FaSearch, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';

const ExercisesScreen = () => {
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const userId = userInfo ? (userInfo.id || userInfo._id) : null;

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Sve');

  // NOVO: Stanja za modal sa detaljnim opisom vežbe
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeExercise, setActiveExercise] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/exercises?userId=${userId}`);
        if (data.success) {
          setExercises(data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Greška pri dobijanju vežbi:', err);
        setLoading(false);
      }
    };
    fetchExercises();
  }, [userId]);

  // Kategorije za filtriranje
  const categories = ['Sve', 'Grudi', 'Leđa', 'Noge', 'Ramena', 'Ruke', 'Trbušnjaci'];

  // Filtriranje vežbi na osnovu pretrage i izabrane kategorije
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Sve' || ex.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // NOVO: Funkcija koja otvara modal i postavlja podatke o izabranoj vežbi
  const handleOpenDetails = (exercise) => {
    setActiveExercise(exercise);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
        <p className="text-muted mt-3">Učitavam bazu vežbi...</p>
      </div>
    );
  }

  return (
    <Container className="py-4 text-light">
      <div className="mb-4">
        <h2 className="fw-bold text-white mb-1">Baza Vežbi</h2>
        <p className="text-muted">Izaberi vežbu da pogledaš detaljan opis i pravilno izvođenje</p>
      </div>

      {/* FILTERI I PRETRAGA */}
      <Card className="p-3 mb-4 border-0 shadow-sm" style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)' }}>
        <Row className="g-3">
          <Col xs={12} md={6}>
            <Form.Group className="d-flex align-items-center bg-dark rounded px-3 border border-secondary">
              <FaSearch className="text-muted me-2" />
              <Form.Control
                type="text"
                placeholder="Pretraži vežbe po nazivu..."
                className="bg-transparent text-white border-0 py-2 shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6} className="d-flex gap-2 overflow-auto pb-1" style={{ whiteSpace: 'nowrap' }}>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'outline-secondary'}
                className="fw-bold px-3 btn-sm text-capitalize"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </Col>
        </Row>
      </Card>

      {/* GRID SA VEŽBAMA */}
      <Row className="g-4">
        {filteredExercises.length === 0 ? (
          <Col xs={12} className="text-center py-5 text-muted">
            Nema pronađenih vežbi za unete kriterijume.
          </Col>
        ) : (
          filteredExercises.map((ex) => (
            <Col xs={12} sm={6} md={4} lg={3} key={ex._id}>
              {/* DODATO: style cursor: pointer i onClick koji otvara modal */}
              <Card 
                className="border-0 h-100 shadow text-center text-light" 
                style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => handleOpenDetails(ex)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Card.Body className="p-3 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="fw-bold text-white mb-2 text-capitalize">{ex.name}</h5>
                    <span className="text-muted small d-flex align-items-center justify-content-center gap-1 mb-3 text-capitalize">
                      <FaDumbbell className="text-primary" size={12} /> {ex.category}
                    </span>
                    
                    {ex.imageUrl && (
                      <div className="rounded overflow-hidden mb-3" style={{ height: '140px' }}>
                        <img 
                          src={ex.imageUrl} 
                          alt={ex.name} 
                          className="w-100 h-100" 
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    
                    <p className="text-white-50 small mb-0 text-start text-truncate-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {ex.description || 'Nema opisa za ovu vežbu.'}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* NOVO: MODAL ZA DETALJAN PRIKAZ OPISA VEŽBE */}
      <Modal 
        show={showDetailsModal} 
        onHide={() => setShowDetailsModal(false)} 
        centered 
        size="md"
        className="glass-modal"
      >
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title className="fw-bold text-capitalize d-flex align-items-center gap-2">
            <FaInfoCircle className="text-primary" /> {activeExercise?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light p-4">
          {activeExercise && (
            <div className="text-center">
              <span className="badge bg-primary px-3 py-2 text-capitalize mb-3 fs-6">
                <FaDumbbell size={14} className="me-1" /> {activeExercise.category}
              </span>
              
              {activeExercise.imageUrl && (
                <div className="rounded overflow-hidden mb-4 shadow border border-secondary" style={{ maxHeight: '260px' }}>
                  <img 
                    src={activeExercise.imageUrl} 
                    alt={activeExercise.name} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'contain', backgroundColor: '#0f172a' }}
                  />
                </div>
              )}
              
              <div className="text-start bg-slate p-3 rounded" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h6 className="fw-bold text-white mb-2">Opis i Izvođenje Vežbe:</h6>
                <p className="text-white-50 mb-0 style-scroll" style={{ whiteSpace: 'pre-line', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {activeExercise.description || 'Opis za ovu vežbu trenutno nije dostupan.'}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" className="fw-bold w-100" onClick={() => setShowDetailsModal(false)}>
            Zatvori
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ExercisesScreen;