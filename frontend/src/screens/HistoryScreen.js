import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Table } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaDumbbell } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HistoryScreen = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Čitamo localStorage odmah na početku komponente
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const userId = userInfo ? (userInfo.id || userInfo._id) : null;

  useEffect(() => {
    // Ako korisnik nije ulogovan, odmah ga preusmeri na login
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/workouts/user/${userId}`);
        
        if (data.success) {
          setWorkouts(data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Greška pri učitavanju istorije treninga.');
        setLoading(false);
      }
    };

    fetchHistory();
    // U niz zavisnosti stavljamo samo userId i navigate kako bismo izbegli beskonačnu petlju
  }, [userId, navigate]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" role="status" style={{ width: '4rem', height: '4rem' }} />
        <p className="text-muted mt-3">Učitavanje istorije treninga...</p>
      </div>
    );
  }

  return (
    <Container className="py-4 text-light">
      <div className="mb-5">
        <h2 className="fw-bold text-white mb-1">Istorija Treninga</h2>
        <p className="text-muted">Pregled svih tvojih završenih treninga sačuvanih u bazi</p>
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {workouts.length === 0 ? (
        <div className="text-center p-5 rounded border border-secondary" style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)' }}>
          <p className="text-white-50 fs-5 mb-0">Još uvek nemaš sačuvanih treninga. Odradi svoj prvi trening!</p>
        </div>
      ) : (
        workouts.map((workout) => {
          const date = new Date(workout.createdAt).toLocaleDateString('sr-RS', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });

          return (
            <Card key={workout._id} className="mb-4 border-0 shadow-sm text-light" style={{ backgroundColor: 'rgba(30, 41, 59, 0.95)' }}>
              <Card.Header className="border-secondary d-flex justify-content-between align-items-center py-3" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                <div className="d-flex align-items-center gap-2 text-white-50">
                  <FaCalendarAlt className="text-primary" />
                  <span className="fw-bold text-white">{date}</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <FaClock className="text-info" />
                  <span>Trajanje: <strong className="text-light">{workout.duration}</strong></span>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="g-4">
                  {workout.exercises && workout.exercises.map((ex, index) => (
                    <Col key={index} xs={12} lg={6}>
                      <div className="p-3 rounded border border-secondary h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.3)' }}>
                        <h5 className="text-primary fw-bold mb-2 d-flex align-items-center gap-2">
                          <FaDumbbell size={16} /> 
                          {ex.exercise ? ex.exercise.name : (ex.name || 'Kastom Vežba')}
                        </h5>
                        <Table responsive borderless className="text-light text-center mb-0">
                          <thead>
                            <tr className="text-muted small border-bottom border-secondary">
                              <th>Serija</th>
                              <th>Težina</th>
                              <th>Ponavljanja</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ex.sets && ex.sets.map((set, sIdx) => (
                              <tr key={sIdx}>
                                <td className="fw-bold text-white-50">{sIdx + 1}</td>
                                <td>{set.weight} kg</td>
                                <td>{set.reps} reps</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          );
        })
      )}
    </Container>
  );
};

export default HistoryScreen;