import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaDumbbell, FaRedo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HistoryScreen = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  let userId = null;
  if (userInfo) {
    const rawId = userInfo.id || userInfo._id || '';
    if (typeof rawId === 'string' && rawId.length >= 24) {
      userId = rawId.substring(0, 24);
    }
  }

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId || userId.length !== 24) {
        setWorkouts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/workouts/user/${userId}`);
        if (data && data.success) {
          setWorkouts(data.data || []);
        }
        setLoading(false);
      } catch (err) {
        console.error('Greška pri učitavanju istorije u pozadini:', err);
        setWorkouts([]);
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  // FUNKCIJA ZA PONAVLJANJE TRENINGA
  const handleRepeatWorkout = (workout) => {
    if (window.confirm(`Da li želiš da pokreneš novi trening na osnovu šablona "${workout.title}"?`)) {
      // Prepakujemo vežbe i setove u format koji razume ActiveWorkoutScreen
      const templateExercises = workout.exercises.map(ex => ({
        exerciseId: ex.exercise._id || ex.exercise,
        name: ex.exercise.name || ex.name || 'Vežba',
        category: ex.exercise.category || '-',
        // Kopiramo stare serije i kilaže, ali im resetujemo status otkačenosti na false
        sets: ex.sets.map(s => ({
          weight: String(s.weight),
          reps: String(s.reps),
          isCompleted: false
        }))
      }));

      // Upisujemo sve podatke u localStorage da ih ActiveWorkoutScreen odmah učita
      localStorage.setItem('fitflow_title', `${workout.title} (Ponovljen)`);
      localStorage.setItem('fitflow_active_exercises', JSON.stringify(templateExercises));
      localStorage.setItem('fitflow_seconds', '0'); // Resetujemo štopericu na nulu za novi trening

      // Preusmeravamo korisnika na ekran za aktivan trening
      navigate('/workout/active');
      window.location.reload();
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <Container className="py-4 text-light">
      <div className="mb-5 mt-3">
        <h2 className="fw-bold text-white mb-1">Istorija Treninga</h2>
        <p className="text-muted mb-0">Pregled svih tvojih završenih treninga sačuvanih u bazi</p>
      </div>

      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" className="mb-2" />
          <p className="text-muted">Učitavam tvoju istoriju...</p>
        </div>
      ) : workouts.length === 0 ? (
        <div className="text-center p-5 rounded border border-secondary shadow-sm" style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)' }}>
          <p className="text-muted fs-5 mb-0">Još uvek nemaš sačuvanih treninga. Odradi svoj prvi trening!</p>
        </div>
      ) : (
        <Row className="g-4">
          {workouts.map((workout) => (
            <Col xs={12} key={workout._id}>
              <Card className="border-0 shadow" style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: '12px' }}>
                <Card.Header className="bg-transparent border-secondary py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <h4 className="fw-bold text-white mb-1 text-capitalize">{workout.title}</h4>
                    <div className="d-flex gap-4 text-white-50 small mt-2">
                      <span className="d-flex align-items-center gap-2">
                        <FaCalendarAlt className="text-primary" /> {formatDate(workout.createdAt)}
                      </span>
                      <span className="d-flex align-items-center gap-2">
                        <FaClock className="text-primary" /> {workout.duration} min
                      </span>
                    </div>
                  </div>
                  
                  {/* NOVO: Dugme za ponavljanje treninga */}
                  <Button 
                    variant="outline-primary" 
                    className="fw-bold d-flex align-items-center gap-2 shadow-sm"
                    onClick={() => handleRepeatWorkout(workout)}
                  >
                    <FaRedo size={12} /> Ponovi trening
                  </Button>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-4">
                    {workout.exercises.map((ex, exIdx) => {
                      const exerciseName = ex.exercise ? (ex.exercise.name || ex.name) : 'Obrisana vežba';
                      const exerciseCategory = ex.exercise ? (ex.exercise.category || '-') : '-';

                      return (
                        <Col xs={12} md={6} lg={4} key={exIdx}>
                          <div className="p-3 rounded h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h6 className="fw-bold text-white text-capitalize mb-1 d-flex align-items-center gap-2">
                              <FaDumbbell className="text-primary" size={14} /> {exerciseName}
                            </h6>
                            <span className="text-muted small d-block mb-3">{exerciseCategory}</span>
                            
                            <div className="d-flex flex-column gap-2">
                              {ex.sets.map((set, setIdx) => (
                                <div key={setIdx} className="d-flex justify-content-between text-white-50 small border-bottom border-secondary border-dashed pb-1">
                                  <span>Set {setIdx + 1}:</span>
                                  <span className="fw-bold text-light">
                                    {set.weight} kg × {set.reps} ponavljanja
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default HistoryScreen;