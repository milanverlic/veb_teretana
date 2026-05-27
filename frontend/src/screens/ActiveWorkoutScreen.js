import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Modal, ListGroup } from 'react-bootstrap';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import exercisesData from '../exercises';

const ActiveWorkoutScreen = () => {
  const navigate = useNavigate();
  
  // 1. Logika za štopericu
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval); // Gasi sat kada izađemo sa stranice
  }, []);

  // Formatiranje vremena (MM:SS ili HH:MM:SS)
  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // 2. Stanje treninga (Sada je ime samo "Trening")
  const [workout, setWorkout] = useState({
    name: 'Trening',
    exercises: [
      {
        id: 1,
        name: 'Čučanj (Barbell)',
        sets: [
          { setNumber: 1, previous: '20 kg x 8', kg: '', reps: '', isCompleted: false },
        ]
      }
    ]
  });

  const [showModal, setShowModal] = useState(false);

  const handleNameChange = (e) => {
    setWorkout({ ...workout, name: e.target.value });
  };

  const handleSetChange = (exerciseId, setIndex, field, value) => {
    const updatedExercises = workout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        const updatedSets = [...ex.sets];
        updatedSets[setIndex][field] = value;
        return { ...ex, sets: updatedSets };
      }
      return ex;
    });
    setWorkout({ ...workout, exercises: updatedExercises });
  };

  const toggleSetCompletion = (exerciseId, setIndex) => {
    const updatedExercises = workout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        const updatedSets = [...ex.sets];
        updatedSets[setIndex].isCompleted = !updatedSets[setIndex].isCompleted;
        return { ...ex, sets: updatedSets };
      }
      return ex;
    });
    setWorkout({ ...workout, exercises: updatedExercises });
  };

  const addSet = (exerciseId) => {
    const updatedExercises = workout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        const newSetNumber = ex.sets.length + 1;
        return {
          ...ex,
          sets: [...ex.sets, { setNumber: newSetNumber, previous: '-', kg: '', reps: '', isCompleted: false }]
        };
      }
      return ex;
    });
    setWorkout({ ...workout, exercises: updatedExercises });
  };

  const addNewExerciseToWorkout = (exerciseTemplate) => {
    const newExercise = {
      id: Date.now(),
      name: exerciseTemplate.name,
      sets: [
        { setNumber: 1, previous: '-', kg: '', reps: '', isCompleted: false }
      ]
    };
    setWorkout({ ...workout, exercises: [...workout.exercises, newExercise] });
    setShowModal(false);
  };

  const finishWorkout = () => {
    console.log('Trening završen, spremno za backend:', { ...workout, duration: formatTime(secondsElapsed) });
    toast.success('Trening je uspešno završen i sačuvan!');
    navigate('/');
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="flex-grow-1 me-3">
          {/* Polje za izmenu imena treninga */}
          <Form.Control 
            type="text" 
            value={workout.name} 
            onChange={handleNameChange}
            className="workout-title-input"
            placeholder="Unesi ime treninga..."
          />
          <small className="text-muted d-block mt-1">
            Vreme: <span className="text-primary fw-bold">{formatTime(secondsElapsed)}</span>
          </small>
        </div>
        <Button variant="success" onClick={finishWorkout}>Završi</Button>
      </div>

      {workout.exercises.map((exercise) => (
        <Card key={exercise.id} className="mb-4 shadow-sm border-0">
          <Card.Body>
            <h5 className="text-primary mb-3 fw-bold">{exercise.name}</h5>
            <Table responsive borderless className="align-middle mb-0">
              <thead>
                <tr className="text-muted small border-bottom border-secondary">
                  <th>Set</th>
                  <th>Prethodno</th>
                  <th className="text-center">kg</th>
                  <th className="text-center">Reps</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets.map((set, index) => (
                  <tr key={index} className={set.isCompleted ? 'opacity-50' : ''}>
                    <td className="fw-bold">{set.setNumber}</td>
                    <td className="text-muted small">{set.previous}</td>
                    <td>
                      <Form.Control 
                        type="number" 
                        size="sm" 
                        className="text-center" 
                        value={set.kg} 
                        onChange={(e) => handleSetChange(exercise.id, index, 'kg', e.target.value)}
                        disabled={set.isCompleted}
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <Form.Control 
                        type="number" 
                        size="sm" 
                        className="text-center" 
                        value={set.reps} 
                        onChange={(e) => handleSetChange(exercise.id, index, 'reps', e.target.value)}
                        disabled={set.isCompleted}
                        placeholder="0"
                      />
                    </td>
                    <td className="text-end">
                      <Button 
                        variant={set.isCompleted ? 'success' : 'outline-secondary'} 
                        size="sm" 
                        onClick={() => toggleSetCompletion(exercise.id, index)}
                      >
                        <FaCheck />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-grid gap-2 mt-3">
              <Button variant="outline-primary" size="sm" onClick={() => addSet(exercise.id)}>
                <FaPlus className="me-1" /> Dodaj Seriju
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}

      <div className="d-grid gap-2 mb-3">
         <Button variant="primary" size="lg" onClick={() => setShowModal(true)}>
           Dodaj Vežbu
         </Button>
      </div>
      <div className="d-grid gap-2">
         <Button variant="danger" size="lg" className="opacity-75" onClick={() => navigate('/')}>
           Otkaži Trening
         </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Izaberi vežbu iz baze</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            {exercisesData.map((ex) => (
              <ListGroup.Item 
                key={ex._id} 
                action 
                onClick={() => addNewExerciseToWorkout(ex)}
                className="d-flex justify-content-between align-items-center"
              >
                <strong>{ex.name}</strong>
                <span className="badge bg-secondary">{ex.category}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ActiveWorkoutScreen;