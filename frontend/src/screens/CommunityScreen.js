import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col, Spinner, Modal, Table } from 'react-bootstrap';
import { FaShareAlt, FaEye, FaDumbbell, FaClock, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CommunityScreen = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  const [posts, setPosts] = useState([]);
  const [myWorkouts, setMyWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stanje za novu objavu
  const [description, setDescription] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [posting, setPosting] = useState(false);

  // Stanje za Modal "Pogledaj šablon"
  const [showModal, setShowModal] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Povuci sve objave iz zajednice
        const { data: postsData } = await axios.get('http://localhost:5000/api/posts');
        if (postsData.success) setPosts(postsData.data);

        // 2. Ako je korisnik ulogovan, povuci njegovu istoriju treninga za padajući meni
        if (userInfo) {
          const userId = userInfo.id || userInfo._id;
          const { data: workoutsData } = await axios.get(`http://localhost:5000/api/workouts/user/${userId}`);
          if (workoutsData.success) setMyWorkouts(workoutsData.data);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!selectedWorkout || !description.trim()) {
      alert('Molimo odaberite trening i unesite opis objave.');
      return;
    }

    try {
      setPosting(true);
      const postData = {
        userId: userInfo.id || userInfo._id,
        description,
        workoutId: selectedWorkout
      };

      const { data } = await axios.post('http://localhost:5000/api/posts', postData);
      if (data.success) {
        setPosts([data.data, ...posts]); // Dodaj novu objavu na vrh odmah
        setDescription('');
        setSelectedWorkout('');
        alert('Trening uspešno podeljen sa zajednicom! 🏋️‍♂️🔥');
      }
      setPosting(false);
    } catch (err) {
      console.error(err);
      alert('Greška pri kreiranju objave.');
      setPosting(false);
    }
  };

  const openTemplateModal = (template) => {
    setActiveTemplate(template);
    setShowModal(true);
  };

  const handleUseTemplate = (template) => {
    setShowModal(false);
    // Šaljemo vežbe i serije pravo u ActiveWorkoutScreen
    navigate('/workout', { state: { templateExercises: template.exercises } });
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
        <p className="text-muted mt-3">Učitavanje zajednice...</p>
      </div>
    );
  }

  return (
    <Container className="py-4 text-light">
      <div className="mb-4">
        <h2 className="fw-bold text-white mb-1">Zajednica</h2>
        <p className="text-muted">Podeli svoje uspehe i koristi treninge drugih korisnika</p>
      </div>

      {/* FORMA ZA OBJAVU SOPSTVENOG TRENINGA (Vidljiva samo ulogovanima) */}
      {userInfo && (
        <Card className="mb-5 border-secondary border" style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)' }}>
          <Card.Body className="p-4">
            <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
              <FaShareAlt className="text-primary" /> Podeli svoj trening
            </h5>
            <Form onSubmit={handleCreatePost}>
              <Form.Group className="mb-3">
                <Form.Label className="text-white-50 small">Izaberi trening iz svoje istorije</Form.Label>
                <Form.Select 
                  className="bg-dark text-light border-secondary"
                  value={selectedWorkout}
                  onChange={(e) => setSelectedWorkout(e.target.value)}
                >
                  <option value="">-- Odaberi trening --</option>
                  {myWorkouts.map((w) => {
                    const date = new Date(w.createdAt).toLocaleDateString('sr-RS', { day: 'numeric', month: 'short' });
                    return (
                      <option key={w._id} value={w._id}>
                        {date} ({w.duration}) - {w.exercises.length} vežbe
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-white-50 small">Napiši utiske o treningu</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={2} 
                  placeholder="Kako je prošao trening? Jesi li pao neki PR? 🚀"
                  className="bg-dark text-light border-secondary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <div className="text-end">
                <Button type="submit" variant="primary" className="fw-bold px-4" disabled={posting}>
                  {posting ? 'Objavljivanje...' : 'Objavi'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* FEED SA OBJAVAMA KORISNIKA */}
      <Row>
        {posts.length === 0 ? (
          <div className="text-center text-muted p-5">Još uvek nema objava u zajednici. Probaj ti prvi!</div>
        ) : (
          posts.map((post) => (
            <Col xs={12} className="mb-4" key={post._id}>
              <Card className="border-0 text-light shadow-sm" style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary rounded-circle p-2 text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <FaUser size={18} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0 text-white">{post.user ? post.user.name : 'Atletski Korisnik'}</h6>
                        <span className="text-muted small">
                          {new Date(post.createdAt).toLocaleDateString('sr-RS', { day: 'numeric', month: 'long' })}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline-info" 
                      size="sm" 
                      className="fw-bold d-flex align-items-center gap-1"
                      onClick={() => openTemplateModal(post.workoutTemplate)}
                    >
                      <FaEye /> Pogledaj šablon
                    </Button>
                  </div>

                  <p className="fs-5 text-white-50 mb-0 ps-1" style={{ whiteSpace: 'pre-line' }}>
                    {post.description}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* MODAL ZA "POGLEDAJ ŠABLON" */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="glass-modal">
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title className="fw-bold">Šablon Treninga</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light p-4">
          {activeTemplate && (
            <>
              <div className="d-flex align-items-center gap-3 mb-4 text-muted border-bottom border-secondary pb-3">
                <div className="d-flex align-items-center gap-1">
                  <FaClock className="text-info" /> Trajanje šablona: <strong className="text-white">{activeTemplate.duration}</strong>
                </div>
              </div>

              <Row className="g-3 mb-4">
                {activeTemplate.exercises.map((ex, index) => (
                  <Col key={index} xs={12} md={6}>
                    <div className="p-3 rounded border border-secondary h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                      <h6 className="text-primary fw-bold mb-2 d-flex align-items-center gap-1">
                        <FaDumbbell /> {ex.name} <span className="text-muted small">({ex.category})</span>
                      </h6>
                      <Table size="sm" borderless responsive className="text-light text-center mb-0">
                        <thead>
                          <tr className="text-muted small border-bottom border-secondary">
                            <th>Serija</th>
                            <th>Kilaža</th>
                            <th>Ponavljanja</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ex.sets.map((s, sIdx) => (
                            <tr key={sIdx}>
                              <td>{sIdx + 1}</td>
                              <td className="text-info">{s.weight} kg</td>
                              <td className="text-warning">{s.reps} reps</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                ))}
              </Row>

              <div className="d-grid">
                <Button 
                  variant="success" 
                  size="lg" 
                  className="fw-bold"
                  onClick={() => handleUseTemplate(activeTemplate)}
                >
                  ⚡ Koristi šablon
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CommunityScreen;