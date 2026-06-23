import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, ListGroup, Table, Form } from 'react-bootstrap';
import { FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ActiveWorkoutScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const [activeExercises, setActiveExercises] = useState([]);
  const [allDbExercises, setAllDbExercises] = useState([]);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Učitavanje vežbi iz baze
  useEffect(() => {
    const fetchDbExercises = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/exercises');
        if (data.success) {
          setAllDbExercises(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDbExercises();
  }, []);

  // PROVERAVAMO DA LI JE STIGAO ŠABLON IZ ZAJEDNICE
  useEffect(() => {
    if (location.state && location.state.templateExercises) {
      const template = location.state.templateExercises.map((ex) => ({
        _id: ex.exerciseId || `custom_${Date.now()}_${Math.random()}`, // Generiše ID ako je kastom vežba
        name: ex.name,
        category: ex.category,
        previousSets: [],
        sets: ex.sets.map((s, idx) => ({
          setNum: idx + 1,
          weight: s.weight,
          reps: s.reps,
          done: false
        }))
      }));
      setActiveExercises(template);
    }
  }, [location.state]);

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

  const handleSelectExercise = async (exercise) => {
    if (activeExercises.some(e => e._id === exercise._id)) {
      setShowSelectModal(false);
      return;
    }

    let previousSetsArray = [];
    if (userInfo && !exercise._id.toString().startsWith('custom_')) {
      try {
        const userId = userInfo.id || userInfo._id;
        const { data } = await axios.get(`http://localhost:5000/api/workouts/previous/${userId}/${exercise._id}`);
        if (data.success && data.data) {
          previousSetsArray = data.data;
        }
      } catch (err) {
        console.error(err);
      }
    }

    const newWorkoutExercise = {
      ...exercise,
      previousSets: previousSetsArray, 
      sets: [{ setNum: 1, weight: '', reps: '', done: false }]
    };

    setActiveExercises([...activeExercises, newWorkoutExercise]);
    setShowSelectModal(false);
  };

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

  const removeExercise = (exerciseId) => {
    setActiveExercises(activeExercises.filter(ex => ex._id !== exerciseId));
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

  const handleFinishWorkout = async () => {
    if (activeExercises.length === 0) {
      alert('Morate dodati bar jednu vežbu.');
      return;
    }

    const formattedExercises = activeExercises.map(ex => ({
      exercise: ex._id.toString().startsWith('custom_') ? null : ex._id, // Sprečava pad baze za tuđe kastom vežbe
      name: ex.name,
      sets: ex.sets.map(s => ({
        weight: Number(s.weight) || 0,
        reps: Number(s.reps) || 0
      }))
    }));

    const workoutData = {
      user: userInfo.id || userInfo._id,
      duration: formatTime(seconds),
      exercises: formattedExercises
    };

    try {
      const { data } = await axios.post('http://localhost:5000/api/workouts', workoutData);
      if (data.success) {
        alert('Trening uspešno sačuvan! 🚀');
        navigate('/history');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Greška pri čuvanju treninga.');
    }
  };

  return (
    <Container className="py-4 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-0 text-white">Trening</h1>
          <p className="text-muted mb-0">Vreme: <span className="text-info fw-bold">{formatTime(seconds)}</span></p>
        </div>
        <Button variant="success" size="lg" className="fw-bold px-4" onClick={handleFinishWorkout}>
          Završi
        </Button>
      </div>

      {activeExercises.length === 0 ? (
        <div className="text-center p-5 rounded border border-secondary my-4" style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)' }}>
          <p className="text-white-50 fs-5 mb-0">Dodaj vežbe ili učitaj šablon.</p>
        </div>
      ) : (
        activeExercises.map((ex) => (
          <div key={ex._id} className="p-4 rounded border border-secondary mb-4 shadow position-relative" style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)' }}>
            <Button variant="link" className="text-danger position-absolute" style={{ top: '15px', right: '15px' }} onClick={() => removeExercise(ex._id)}>
              <FaTrash />
            </Button>

            <h4 className="text-primary fw-bold mb-3">{ex.name} <span className="text-muted small">({ex.category})</span></h4>
            
            <Table responsive borderless className="text-light text-center align-middle">
              <thead>
                <tr className="border-bottom border-secondary text-muted small">
                  <th style={{ width: '10%' }}>Set</th>
                  <th style={{ width: '30%' }}>Prethodno</th>
                  <th style={{ width: '25%' }}>kg</th>
                  <th style={{ width: '25%' }}>Reps</th>
                  <th style={{ width: '10%' }}><FaCheck /></th>
                </tr>
              </thead>
              <tbody>
                {ex.sets.map((set, idx) => {
                  const prevSet = ex.previousSets && ex.previousSets[idx];
                  const prevText = prevSet ? `${prevSet.weight} kg x ${prevSet.reps}` : "—";

                  return (
                    <tr key={idx} className={set.done ? "opacity-50" : ""}>
                      <td className="fw-bold text-white fs-5">{set.setNum}</td>
                      <td className="text-white-50">{prevText}</td>
                      <td>
                        <Form.Control 
                          type="number" 
                          value={set.weight}
                          disabled={set.done}
                          onChange={(e) => handleSetChange(ex._id, idx, 'weight', e.target.value)}
                          className="bg-secondary text-white border-0 text-center mx-auto"
                          style={{ maxWidth: '90px' }}
                        />
                      </td>
                      <td>
                        <Form.Control 
                          type="number" 
                          value={set.reps}
                          disabled={set.done}
                          onChange={(e) => handleSetChange(ex._id, idx, 'reps', e.target.value)}
                          className="bg-secondary text-white border-0 text-center mx-auto"
                          style={{ maxWidth: '90px' }}
                        />
                      </td>
                      <td>
                        <Button variant={set.done ? "success" : "outline-secondary"} size="sm" onClick={() => toggleSetDone(ex._id, idx)}>
                          <FaCheck />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Button variant="outline-primary" size="sm" className="w-100 fw-bold mt-2" onClick={() => addSet(ex._id)}>
              <FaPlus /> Dodaj Seriju
            </Button>
          </div>
        ))
      )}

      <div className="d-grid gap-3 mt-4">
        <Button variant="primary" size="lg" className="fw-bold py-3" onClick={() => setShowSelectModal(true)}>
          Dodaj Vežbu
        </Button>
      </div>

      <Modal show={showSelectModal} onHide={() => setShowSelectModal(false)} centered scrollable className="glass-modal">
        <Modal.Header closeButton className="border-secondary text-light">
          <Modal.Title className="fw-bold">Izaberi vežbu</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark p-0">
          <ListGroup variant="flush">
            {allDbExercises.map((exercise) => (
              <ListGroup.Item key={exercise._id} onClick={() => handleSelectExercise(exercise)} action className="bg-dark text-light border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
                <span className="fw-bold text-white">{exercise.name}</span>
                <span className="badge bg-secondary">{exercise.category}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ActiveWorkoutScreen;