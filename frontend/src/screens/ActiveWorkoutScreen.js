import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, ListGroup, Table, Form } from 'react-bootstrap';
import { FaPlus, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ActiveWorkoutScreen = () => {
  const navigate = useNavigate();
  
  // Podaci o korisniku
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  // Stanja za trening
  const [activeExercises, setActiveExercises] = useState([]); // Počinje PRAZNO!
  const [allDbExercises, setAllDbExercises] = useState([]); // Sve vežbe iz baze za izbor
  const [showSelectModal, setShowSelectModal] = useState(false);
  
  // Timer stanje
  const [seconds, setSeconds] = useState(0);

  // 1. Učitaj sve vežbe iz baze za Modal na klik "Dodaj Vežbu"
  useEffect(() => {
    const fetchDbExercises = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/exercises');
        if (data.success) {
          setAllDbExercises(data.data);
        }
      } catch (err) {
        console.error('Greška pri učitavanju vežbi za trening', err);
      }
    };
    fetchDbExercises();
  }, []);

  // 2. Timer štoperica
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 3. Dodavanje nove vežbe iz modala u trenutni trening
  const handleSelectExercise = async (exercise) => {
    // Provera da li je vežba već dodata
    if (activeExercises.some(e => e._id === exercise._id)) {
      setShowSelectModal(false);
      return;
    }

    let previousSetsText = 'Nema podataka';

    // Ako imamo ulogovanog korisnika, vučemo njegovu istoriju za OVOJ vežbu
    if (userInfo) {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/workouts/previous/${userInfo.id}/${exercise._id}`);
        if (data.success && data.data && data.data.length > 0) {
          // Uzimamo prvu (ili najjaču) seriju iz prethodnog puta kao referencu
          previousSetsText = `${data.data[0].weight} kg x ${data.data[0].reps}`;
        }
      } catch (err) {
        console.error('Greška pri preuzimanju istorije serija', err);
      }
    }

    const newWorkoutExercise = {
      ...exercise,
      previousInfo: previousSetsText, // Čuvamo "Prethodno" dinamički!
      sets: [{ setNum: 1, weight: '', reps: '', done: false }]
    };

    setActiveExercises([...activeExercises, newWorkoutExercise]);
    setShowSelectModal(false);
  };

  // 4. Upravljanje serijama (Dodaj seriju, izmena polja)
  const addSet = (exerciseId) => {
    setActiveExercises(activeExercises.map(ex => {
      if (ex._id === exerciseId) {
        return {
          ...ex,
          sets: [...ex.sets, { setNum: ex.sets.length + 1, weight: '', reps: '', done: false }]
        };
      }
      return ex;
    }));
  };

  const handleSetChange = (exerciseId, index, field, value) => {
    setActiveExercises(activeExercises.map(ex => {
      if (ex._id === exerciseId) {
        const updatedSets = [...ex.sets];
        updatedSets[index][field] = value;
        return { ...ex, sets: updatedSets };
      }
      return ex;
    }));
  };

  const toggleSetDone = (exerciseId, index) => {
    setActiveExercises(activeExercises.map(ex => {
      if (ex._id === exerciseId) {
        const updatedSets = [...ex.sets];
        updatedSets[index].done = !updatedSets[index].done;
        return { ...ex, sets: updatedSets };
      }
      return ex;
    }));
  };

  // 5. Čuvanje kompletnog treninga u bazu podataka
  const handleFinishWorkout = async () => {
    if (activeExercises.length === 0) {
      alert('Nemate dodatih vežbi na ovom treningu.');
      return;
    }

    const workoutData = {
      user: userInfo ? userInfo.id : null,
      duration: formatTime(seconds),
      exercises: activeExercises.map(ex => ({
        exercise: ex._id,
        sets: ex.sets.map(s => ({
          weight: Number(s.weight) || 0,
          reps: Number(s.reps) || 0
        }))
      }))
    };

    try {
      await axios.post('http://localhost:5000/api/workouts', workoutData);
      alert('Trening uspešno završen i sačuvan u istoriju! 💪');
      navigate('/history');
    } catch (err) {
      alert('Greška prilikom čuvanja treninga.');
    }
  };

  return (
    <Container className="py-4 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-0 text-white">Trening</h1>
          <p className="text-muted">Vreme: <span className="text-info fw-bold">{formatTime(seconds)}</span></p>
        </div>
        <Button variant="success" size="lg" className="fw-bold px-4" onClick={handleFinishWorkout}>
          Završi
        </Button>
      </div>

      {/* Ako nema vežbi, ispiši poruku */}
      {activeExercises.length === 0 ? (
        <div className="text-center p-5 rounded border border-secondary my-4" style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)' }}>
          <p className="text-white-50 fs-5 mb-0">Trening je prazan. Klikni na dugme ispod da dodaš prvu vežbu iz baze podataka!</p>
        </div>
      ) : (
        activeExercises.map((ex) => (
          <div key={ex._id} className="p-4 rounded border border-secondary mb-4 shadow" style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)' }}>
            <h4 className="text-primary fw-bold mb-3">{ex.name} <span className="text-muted small">({ex.category})</span></h4>
            
            <Table responsive borderless className="text-light text-center align-middle">
              <thead>
                <tr className="border-bottom border-secondary text-muted small">
                  <th style={{ width: '10%' }}>Set</th>
                  <th style={{ width: '25%' }}>Prethodno</th>
                  <th style={{ width: '25%' }}>kg</th>
                  <th style={{ width: '25%' }}>Reps</th>
                  <th style={{ width: '15%' }}><FaCheck /></th>
                </tr>
              </thead>
              <tbody>
                {ex.sets.map((set, idx) => (
                  <tr key={idx} className={set.done ? "opacity-50" : ""}>
                    <td className="fw-bold text-white fs-5">{set.setNum}</td>
                    <td className="text-white-50">{idx === 0 ? ex.previousInfo : "—"}</td>
                    <td>
                      <Form.Control 
                        type="number" 
                        placeholder="0"
                        value={set.weight}
                        disabled={set.done}
                        onChange={(e) => handleSetChange(ex._id, idx, 'weight', e.target.value)}
                        className="bg-secondary text-white border-0 text-center mx-auto"
                        style={{ maxWidth: '90px', borderRadius: '6px' }}
                      />
                    </td>
                    <td>
                      <Form.Control 
                        type="number" 
                        placeholder="0"
                        value={set.reps}
                        disabled={set.done}
                        onChange={(e) => handleSetChange(ex._id, idx, 'reps', e.target.value)}
                        className="bg-secondary text-white border-0 text-center mx-auto"
                        style={{ maxWidth: '90px', borderRadius: '6px' }}
                      />
                    </td>
                    <td>
                      <Button 
                        variant={set.done ? "success" : "outline-secondary"}
                        size="sm"
                        onClick={() => toggleSetDone(ex._id, idx)}
                        style={{ borderRadius: '6px' }}
                      >
                        <FaCheck />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="outline-primary" size="sm" className="w-100 fw-bold mt-2 py-2" onClick={() => addSet(ex._id)}>
              <FaPlus className="me-1" /> Dodaj Seriju
            </Button>
          </div>
        ))
      )}

      {/* Glavne akcije na dnu */}
      <div className="d-grid gap-3 mt-4">
        <Button variant="primary" size="lg" className="fw-bold py-3" onClick={() => setShowSelectModal(true)}>
          Dodaj Vežbu
        </Button>
        <Button variant="danger" size="lg" className="fw-bold py-2 opacity-75" onClick={() => navigate('/')}>
          Otkaži Trenig
        </Button>
      </div>

      {/* DINO MODAL: Izbor vežbe direktno iz MongoDB Atlasa */}
      <Modal show={showSelectModal} onHide={() => setShowSelectModal(false)} centered scrollable size="md" className="glass-modal">
        <Modal.Header closeButton className="border-secondary text-light">
          <Modal.Title className="fw-bold">Izaberi vežbu iz baze</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark p-0">
          <ListGroup variant="flush">
            {allDbExercises.map((exercise) => (
              <ListGroup.Item 
                key={exercise._id}
                onClick={() => handleSelectExercise(exercise)}
                action
                className="bg-dark text-light border-bottom border-secondary d-flex justify-content-between align-items-center py-3 px-4"
              >
                <span className="fw-bold text-white">{exercise.name}</span>
                <span className="badge bg-secondary text-white-50" style={{ backgroundColor: '#475569' }}>{exercise.category}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default ActiveWorkoutScreen;