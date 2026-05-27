import React, { useState } from 'react';
import { Container, Card, Form, Button, Table, Modal, ListGroup } from 'react-bootstrap';
import { FaCheck, FaPlus } from 'react-icons/fa';
import exercisesData from '../exercises'; // Importujemo našu lažnu bazu vežbi
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ActiveWorkoutScreen = () => {
  const [workout, setWorkout] = useState({
    name: 'Večernji Trening',
    duration: '0:00',
    exercises: [
      {
        id: 1,
        name: 'Čučanj',
        sets: [
          { setNumber: 1, previous: '20 kg x 8', kg: '', reps: '', isCompleted: false },
        ]
      }
    ]
  });

  const navigate = useNavigate();
  // Stanje za kontrolu da li je Modal (prozor za biranje vežbi) otvoren
  const [showModal, setShowModal] = useState(false);

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

  // Funkcija koja dodaje novu vežbu iz baze u trenutni trening
  const addNewExerciseToWorkout = (exerciseTemplate) => {
    const newExercise = {
      id: Date.now(), // Koristimo trenutno vreme kao privremeni jedinstveni ID
      name: exerciseTemplate.name,
      sets: [
        { setNumber: 1, previous: '-', kg: '', reps: '', isCompleted: false }
      ]
    };
    
    setWorkout({ ...workout, exercises: [...workout.exercises, newExercise] });
    setShowModal(false); // Zatvaramo Modal nakon odabira
  };

 const finishWorkout = () => {
  // Ovde će kasnije ići prava Redux akcija za slanje na backend
  console.log('Trening završen, spremno za slanje na backend:', workout);
  
  // Prikazuje lepu zelenu poruku u uglu ekrana
  toast.success('Trening je uspešno završen i sačuvan!'); 
  
  // Automatski te vraća nazad na početnu stranu
  navigate('/'); 
};

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold">{workout.name}</h2>
          <small className="text-muted">Vreme: {workout.duration}</small>
        </div>
        <Button variant="success" onClick={finishWorkout}>Završi</Button>
      </div>

      {workout.exercises.map((exercise) => (
        <Card key={exercise.id} className="mb-4 shadow-sm border-0">
          <Card.Body>
            <h5 className="text-primary mb-3 fw-bold">{exercise.name}</h5>
            <Table responsive borderless className="align-middle mb-0">
              <thead>
                <tr className="text-muted small">
                  <th>Set</th>
                  <th>Prethodno</th>
                  <th>kg</th>
                  <th>Reps</th>
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
         {/* Klik na ovo dugme sada otvara Modal */}
         <Button variant="primary" size="lg" onClick={() => setShowModal(true)}>
           Dodaj Vežbu
         </Button>
      </div>
      <div className="d-grid gap-2">
         <Button variant="danger" size="lg" className="opacity-75" onClick={() => navigate('/')}>
  Otkaži Trening
</Button>
      </div>

      {/* Modal komponenta za odabir vežbe */}
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