import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaCheck, FaTimes, FaHistory } from 'react-icons/fa';
import axios from 'axios';

const ActiveWorkoutScreen = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const userId = userInfo ? (userInfo.id || userInfo._id) : null;

  // Stanja za trening
  const [workoutTitle, setWorkoutTitle] = useState(localStorage.getItem('fitflow_title') || 'Moj Trening');
  const [activeExercises, setActiveExercises] = useState(
    localStorage.getItem('fitflow_active_exercises') ? JSON.parse(localStorage.getItem('fitflow_active_exercises')) : []
  );
  const [seconds, setSeconds] = useState(Number(localStorage.getItem('fitflow_seconds')) || 0);

  // Stanja za izbor vežbi iz baze
  const [allDbExercises, setAllDbExercises] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Stanje za skladištenje istorije serija
  const [exerciseHistory, setExerciseHistory] = useState({});

  // Tajmer
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const nextSeconds = prev + 1;
        localStorage.setItem('fitflow_seconds', nextSeconds);
        return nextSeconds;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sinkronizacija vežbi sa localStorage-om pri svakoj izmeni
  useEffect(() => {
    localStorage.setItem('fitflow_active_exercises', JSON.stringify(activeExercises));
  }, [activeExercises]);

  // Učitavanje vežbi iz baze
  useEffect(() => {
    const fetchDbExercises = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/exercises?userId=${userId}`);
        if (data.success) {
          setAllDbExercises(data.data);
        }
      } catch (err) {
        console.error('Greška pri učitavanju vežbi:', err);
      }
    };
    fetchDbExercises();
  }, [userId]);

  // Funkcija za povlačenje istorije serija za specifičnu vežbu
  const fetchPreviousInfo = async (exerciseId) => {
    if (!userId || !exerciseId) return;
    try {
      const { data } = await axios.get(`http://localhost:5000/api/workouts/previous/${userId}/${exerciseId}`);
      if (data.success && data.data) {
        setExerciseHistory(prev => ({
          ...prev,
          [exerciseId]: data.data
        }));
      }
    } catch (err) {
      console.error('Greška pri učitavanju istorije za vežbu:', err);
    }
  };

  useEffect(() => {
    if (activeExercises.length > 0) {
      activeExercises.forEach(ex => {
        if (!exerciseHistory[ex.exerciseId]) {
          fetchPreviousInfo(ex.exerciseId);
        }
      });
    }
  }, [activeExercises]);

  // Formatiranje vremena (hh:mm:ss)
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // Dodavanje vežbe u trenutni trening
  const handleAddExerciseToWorkout = (exercise) => {
    const alreadyAdded = activeExercises.some(e => e.exerciseId === exercise._id);
    if (alreadyAdded) {
      alert('Ova vežba je već dodata u trening.');
      return;
    }

    const newExerciseEntry = {
      exerciseId: exercise._id,
      name: exercise.name,
      category: exercise.category,
      sets: [{ weight: '', reps: '', isCompleted: false }]
    };

    setActiveExercises([...activeExercises, newExerciseEntry]);
    fetchPreviousInfo(exercise._id);
    setShowAddModal(false);
  };

  // Uklanjanje cele vežbe iz treninga
  const handleRemoveExercise = (index) => {
    const updated = activeExercises.filter((_, i) => i !== index);
    setActiveExercises(updated);
  };

  // Dodavanje novog seta u vežbu
  const handleAddSet = (exerciseIndex) => {
    const updated = [...activeExercises];
    updated[exerciseIndex].sets.push({ weight: '', reps: '', isCompleted: false });
    setActiveExercises(updated);
  };

  // Uklanjanje poslednjeg seta iz vežbe
  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updated = [...activeExercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    setActiveExercises(updated);
  };

  // Izmena vrednosti unutar seta
  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updated = [...activeExercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setActiveExercises(updated);
  };

  // Funkcija za otkačivanje seta (Toggle check)
  const handleToggleSetComplete = (exerciseIndex, setIndex) => {
    const updated = [...activeExercises];
    const currentSet = updated[exerciseIndex].sets[setIndex];
    
    if (!currentSet.weight || !currentSet.reps) {
      alert('Molimo popunite kilažu i ponavljanja pre nego što označite set kao završen.');
      return;
    }
    
    currentSet.isCompleted = !currentSet.isCompleted;
    setActiveExercises(updated);
  };

  // FUNKCIJA ZA USPEŠAN ZAVRŠETAK TRENINGA
  const handleFinishWorkout = async () => {
    if (activeExercises.length === 0) {
      alert('Nemate dodatih vežbi u treningu.');
      return;
    }

    const filteredExercises = activeExercises
      .map(ex => {
        const completedSets = ex.sets.filter(s => s.isCompleted);
        return {
          ...ex,
          sets: completedSets
        };
      })
      .filter(ex => ex.sets.length > 0);

    if (filteredExercises.length === 0) {
      alert('Morate označiti (otkačiti) barem jedan završen set da biste sačuvali trening.');
      return;
    }

    try {
      const workoutData = {
        userId,
        title: workoutTitle,
        duration: String(Math.floor(seconds / 60)), 
        exercises: filteredExercises.map(ex => ({
          exercise: ex.exerciseId, 
          name: ex.name,
          sets: ex.sets.map(s => ({
            weight: Number(s.weight),
            reps: Number(s.reps)
          }))
        }))
      };

      const { data } = await axios.post('http://localhost:5000/api/workouts', workoutData);
      
      if (data.success) {
        alert('Trening je uspešno sačuvan!');
        
        localStorage.removeItem('fitflow_title');
        localStorage.removeItem('fitflow_active_exercises');
        localStorage.removeItem('fitflow_seconds');

        navigate('/history');
        window.location.reload();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Greška pri čuvanju treninga.');
    }
  };

  // FUNKCIJA ZA ODUSTAJANJE OD TRENINGA
  const handleCancelWorkout = () => {
    if (window.confirm('Da li ste sigurni da želite da prekinete trening? Svi nesačuvani podaci će biti zauvek obrisani.')) {
      localStorage.removeItem('fitflow_title');
      localStorage.removeItem('fitflow_active_exercises');
      localStorage.removeItem('fitflow_seconds');

      navigate('/exercises');
      window.location.reload();
    }
  };

  return (
    <Container className="py-4 text-light">
      {/* GLAVNE KONTROLE I TAJMER */}
      <Card className="p-4 mb-4 border-0 shadow" style={{ backgroundColor: '#1e293b' }}>
        <Row className="align-items-center g-3">
          <Col xs={12} md={5}>
            <Form.Group>
              <Form.Label className="text-white-50 small">Naziv Treninga</Form.Label>
              <Form.Control
                type="text"
                className="bg-secondary text-white border-0 fw-bold fs-4"
                value={workoutTitle}
                onChange={(e) => {
                  setWorkoutTitle(e.target.value);
                  localStorage.setItem('fitflow_title', e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col xs={6} md={3} className="text-center">
            <span className="text-white-50 small d-block">Vreme trajanja</span>
            <span className="fs-3 fw-bold text-primary">{formatTime(seconds)}</span>
          </Col>
          <Col xs={6} md={4} className="d-flex gap-2 justify-content-end">
            <Button variant="danger" className="fw-bold d-flex align-items-center gap-2" onClick={handleCancelWorkout}>
              <FaTimes /> Odustani
            </Button>
            <Button variant="success" className="fw-bold d-flex align-items-center gap-2 px-4" onClick={handleFinishWorkout}>
              <FaCheck /> Završi
            </Button>
          </Col>
        </Row>
      </Card>

      {/* LISTA DODATIH VEŽBI U TRENINGU */}
      <h3 className="fw-bold mb-3 text-white">Vežbe u treningu</h3>
      
      {activeExercises.length === 0 ? (
        <div className="text-center p-5 rounded border border-secondary border-dashed" style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)' }}>
          <p className="text-muted mb-3">Trenutno nemate dodatih vežbi za ovaj trening.</p>
          <Button variant="outline-primary" className="fw-bold" onClick={() => setShowAddModal(true)}>
            <FaPlus className="me-2" /> Dodaj prvu vežbu
          </Button>
        </div>
      ) : (
        <>
          {activeExercises.map((ex, exIdx) => {
            const historySets = exerciseHistory[ex.exerciseId] || [];

            return (
              <Card key={ex.exerciseId} className="mb-3 border-0 shadow" style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)' }}>
                <Card.Header className="bg-transparent border-secondary d-flex justify-content-between align-items-center py-3">
                  <div>
                    <h5 className="fw-bold text-white mb-0 text-capitalize">{ex.name}</h5>
                    <span className="badge bg-dark border border-secondary text-muted small mt-1">{ex.category}</span>
                  </div>
                  <Button variant="outline-danger" size="sm" onClick={() => handleRemoveExercise(exIdx)}>
                    <FaTrash /> Ukloni vežbu
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Row className="fw-bold text-white-50 small mb-2 text-center align-items-center">
                    <Col xs={1}>Set</Col>
                    <Col xs={4}>Kilaža (kg)</Col>
                    <Col xs={4}>Ponavljanja</Col>
                    <Col xs={3}>Status / Obriši</Col>
                  </Row>

                  {ex.sets.map((set, setIdx) => {
                    const prevSet = historySets[setIdx];

                    return (
                      <div key={setIdx} className="mb-3" style={{ opacity: set.isCompleted ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                        <Row className="text-center align-items-center g-2">
                          <Col xs={1}>
                            <span className="fw-bold text-white fs-5">{setIdx + 1}</span>
                          </Col>
                          <Col xs={4}>
                            <Form.Control
                              type="number"
                              placeholder="kg"
                              disabled={set.isCompleted}
                              className="bg-dark text-white border-secondary text-center fw-bold"
                              value={set.weight}
                              onChange={(e) => handleSetChange(exIdx, setIdx, 'weight', e.target.value)}
                            />
                          </Col>
                          <Col xs={4}>
                            <Form.Control
                              type="number"
                              placeholder="reps"
                              disabled={set.isCompleted}
                              className="bg-dark text-white border-secondary text-center fw-bold"
                              value={set.reps}
                              onChange={(e) => handleSetChange(exIdx, setIdx, 'reps', e.target.value)}
                            />
                          </Col>
                          
                          <Col xs={3} className="d-flex align-items-center justify-content-center gap-2">
                            <Button 
                              variant={set.isCompleted ? "success" : "outline-success"} 
                              size="sm"
                              className="fw-bold d-flex align-items-center justify-content-center"
                              style={{ width: '38px', height: '34px' }}
                              onClick={() => handleToggleSetComplete(exIdx, setIdx)}
                            >
                              <FaCheck />
                            </Button>
                            
                            {ex.sets.length > 1 && (
                              <Button variant="link" className="text-danger p-0 ms-1" onClick={() => handleRemoveSet(exIdx, setIdx)}>
                                <FaTrash />
                              </Button>
                            )}
                          </Col>
                        </Row>
                        
                        {prevSet && (
                          <Row className="text-center small mt-1">
                            <Col xs={1}></Col>
                            <Col xs={8} className="text-start ps-3">
                              <span style={{ color: '#a855f7', fontSize: '0.82rem' }} className="d-flex align-items-center gap-1">
                                <FaHistory size={10} /> Prethodno: <strong>{prevSet.weight} kg</strong> × <strong>{prevSet.reps} ponavljanja</strong>
                              </span>
                            </Col>
                            <Col xs={3}></Col>
                          </Row>
                        )}
                      </div>
                    );
                  })}

                  <Button variant="outline-light" size="sm" className="mt-2 fw-bold w-100" onClick={() => handleAddSet(exIdx)}>
                    <FaPlus className="me-1" /> Dodaj novi set
                  </Button>
                </Card.Body>
              </Card>
            );
          })}

          <div className="d-grid mt-4">
            <Button variant="primary" size="lg" className="fw-bold shadow" onClick={() => setShowAddModal(true)}>
              <FaPlus className="me-2" /> Dodaj još jednu vežbu
            </Button>
          </div>
        </>
      )}

      {/* MODAL ZA IZBOR VEŽBI */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="lg" className="glass-modal">
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title className="fw-bold">Izaberi vežbu za trening</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Row className="g-3">
            {allDbExercises.map((dbEx) => (
              <Col key={dbEx._id} xs={12} sm={6}>
                <Card 
                  className="p-3 border-secondary h-100 text-white option-card style-dark" 
                  style={{ backgroundColor: 'rgba(51, 65, 85, 0.4)', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onClick={() => handleAddExerciseToWorkout(dbEx)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold text-capitalize mb-1">{dbEx.name}</h6>
                      <span className="text-muted small">{dbEx.category}</span>
                    </div>
                    <Button variant="primary" size="sm" className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <FaPlus size={12} />
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ActiveWorkoutScreen;