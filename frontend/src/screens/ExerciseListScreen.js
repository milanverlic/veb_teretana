import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { FaPlus, FaDumbbell, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';

const ExerciseListScreen = () => {
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const userId = userInfo ? (userInfo.id || userInfo._id) : null;
  
  const isAdmin = userInfo && userInfo.email === 'verlicmilan@gmail.com';

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/exercises?userId=${userId}`);
      if (data.success) {
        setExercises(data.data);
      }
      setLoading(false);
    } catch (err) {
      setError('Greška prilikom učitavanja vežbi iz baze.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !description) {
      alert('Molimo popunite sva obavezna polja.');
      return;
    }

    try {
      const exerciseData = {
        name,
        category,
        description,
        image: isAdmin ? image : '', 
        userId
      };

      const { data } = await axios.post('http://localhost:5000/api/exercises', exerciseData);
      if (data.success) {
        setShowModal(false);
        setName('');
        setCategory('');
        setDescription('');
        setImage('');
        fetchExercises();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Greška pri dodavanju vežbe.');
    }
  };

  return (
    <Container className="py-4 text-light position-relative">

      <div className="d-flex justify-content-between align-items-center mb-5 mt-3">
        <div>
          <h2 className="fw-bold text-white mb-1">Baza Vežbi</h2>
          <p className="text-muted mb-0">Izgradi savršenu formu uz detaljan vodič kroz vežbe snage i oblikovanja</p>
        </div>
        {userInfo && (
          <Button variant="primary" size="lg" className="fw-bold d-flex align-items-center gap-2 shadow" onClick={() => setShowModal(true)}>
            <FaPlus /> {isAdmin ? 'Dodaj Globalnu Vežbu' : 'Dodaj Svoju'}
          </Button>
        )}
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {loading ? (
        <div className="text-center my-5">Učitavanje baze vežbi...</div>
      ) : (
        <Row className="g-4">
          {exercises.map((ex) => {
            // PAMETNA LOGIKA ZA SLIKU: Traži bilo koje polje iz baze, ako nema ničeg, stavlja default sliku teretane
            const exerciseImage = ex.image || ex.imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=500';

            return (
              <Col key={ex._id} xs={12} sm={6} md={4} lg={3}>
                <Card className="h-100 border-0 text-light text-center position-relative shadow" style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: '12px' }}>
                  <Card.Body className="p-3 d-flex flex-column justify-content-between">
                    <div>
                      <h4 className="fw-bold text-white mb-1 mt-2 text-capitalize">{ex.name}</h4>
                      <p className="text-muted small mb-2"><FaDumbbell className="text-primary me-1" /> {ex.category}</p>
                      
                      <div className="overflow-hidden rounded mb-2 mx-auto" style={{ width: '100%', height: '140px', maxWidth: '220px' }}>
                        <img 
                          src={exerciseImage} 
                          alt={ex.name} 
                          className="w-100 h-100" 
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=500';
                          }}
                        />
                      </div>
                      <p className="text-white-50 small mt-2 px-1 text-truncate" title={ex.description}>
                        {ex.description || 'Nema opisa.'}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* MODAL ZA KREIRANJE VEŽBE */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="glass-modal">
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title className="fw-bold">Dodaj Novu Vežbu</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 small">Naziv vežbe *</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="npr. Potisak bučicama"
                className="bg-secondary text-white border-0"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 small">Mišićna grupa / Kategorija *</Form.Label>
              <Form.Select 
                className="bg-secondary text-white border-0"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">-- Izaberi --</option>
                <option value="Grudi">Grudi</option>
                <option value="Leđa">Leđa</option>
                <option value="Noge">Noge</option>
                <option value="Ramena">Ramena</option>
                <option value="Ruke">Ruke</option>
                <option value="Trbušnjaci">Trbušnjaci</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 small">Opis / Instrukcije *</Form.Label>
              <Form.Control 
                as="textarea"
                rows={2}
                placeholder="Unesite kratke instrukcije..."
                className="bg-secondary text-white border-0"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            {isAdmin && (
              <Form.Group className="mb-3 border border-danger p-2 rounded" style={{ backgroundColor: 'rgba(220, 53, 69, 0.05)' }}>
                <Form.Label className="text-danger small fw-bold">URL Slike (Samo za Admina)</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="https://link-do-slike.com/slika.jpg"
                  className="bg-secondary text-white border-0"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </Form.Group>
            )}

            <div className="d-grid mt-4">
              <Button type="submit" variant={isAdmin ? "danger" : "primary"} size="lg" className="fw-bold">
                Sačuvaj Vežbu
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ExerciseListScreen;