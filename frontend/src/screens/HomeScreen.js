import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaPlay, FaDumbbell } from 'react-icons/fa';
import axios from 'axios';

const HomeScreen = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const userId = userInfo ? (userInfo.id || userInfo._id) : null;

  const [dbExercises, setDbExercises] = useState([]);

  // Učitavamo sve vežbe iz baze kako bismo mapirali šablone na prave ID-jeve
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/exercises?userId=${userId}`);
        if (data.success) {
          setDbExercises(data.data);
        }
      } catch (err) {
        console.error('Greška pri učitavanju vežbi na početnoj:', err);
      }
    };
    if (userId) {
      fetchExercises();
    }
  }, [userId]);

  // Definicija tri popularna šablona sa tvoje početne stranice
  const templates = [
    {
      title: 'Gornji deo tela A (Fokus Snaga)',
      subtitle: 'Gornji deo',
      exercises: [
        { searchName: 'benč pres', category: 'grudi', fallbackName: 'Potisak na benču', setsCount: 4 },
        { searchName: 'zgibovi', category: 'leđa', fallbackName: 'Zgibovi (Pull-ups)', setsCount: 3 },
        { searchName: 'veslanje u pretklonu', category: 'leđa', fallbackName: 'Veslanje dvoručnim tegom', setsCount: 3 }
      ]
    },
    {
      title: 'Donji deo tela B (Fokus Mobilnost)',
      subtitle: 'Donji deo',
      exercises: [
        { searchName: 'čučanj', category: 'noge', fallbackName: 'Čučanj sa dvoručnim tegom', setsCount: 3 },
        { searchName: 'rumunsko mrtvo dizanje', category: 'noge', fallbackName: 'Rumunsko mrtvo dizanje', setsCount: 3 },
        { searchName: 'iskoraci sa bučicama', category: 'noge', fallbackName: 'Iskoraci', setsCount: 3 }
      ]
    },
    {
      title: 'Strong 5x5 - Trening A',
      subtitle: 'Celo telo',
      exercises: [
        { searchName: 'čučanj', category: 'noge', fallbackName: 'Čučanj 5x5', setsCount: 5 },
        { searchName: 'benč pres', category: 'grudi', fallbackName: 'Benč pres 5x5', setsCount: 5 },
        { searchName: 'dvoručno veslanje', category: 'leđa', fallbackName: 'Dvoručno veslanje 5x5', setsCount: 5 }
      ]
    }
  ];

  // Pokretanje praznog treninga
  const handleStartEmptyWorkout = () => {
    if (!userInfo) {
      alert('Morate biti ulogovani da biste započeli trening.');
      navigate('/login');
      return;
    }
    localStorage.setItem('fitflow_title', 'Prazan Trening');
    localStorage.setItem('fitflow_active_exercises', JSON.stringify([]));
    localStorage.setItem('fitflow_seconds', '0');
    navigate('/workout/active');
    window.location.reload();
  };

  // FUNKCIJA ZA AKTIVIRANJE ŠABLONA
  const handleUseTemplate = (template) => {
    if (!userInfo) {
      alert('Morate biti ulogovani da biste pokrenuli šablon.');
      navigate('/login');
      return;
    }

    // Proveravamo bazu i sklapamo vežbe
    const selectedExercises = template.exercises.map(templateEx => {
      // 1. Pokušavamo da nađemo vežbu po tačnom nazivu (ignorišemo mala/velika slova)
      let found = dbExercises.find(dbEx => 
        dbEx.name.toLowerCase().includes(templateEx.searchName.toLowerCase())
      );

      // 2. Ako je nema, tražimo bilo koju drugu vežbu iz iste kategorije
      if (!found) {
        found = dbExercises.find(dbEx => 
          dbEx.category.toLowerCase() === templateEx.category.toLowerCase()
        );
      }

      // 3. Ako je baza skroz prazna, pravimo privremeni ID i objekat da aplikacija ne pukne
      const exerciseId = found ? found._id : '000000000000000000000000';
      const finalName = found ? found.name : templateEx.fallbackName;
      const finalCategory = found ? found.category : templateEx.category;

      // Generišemo prazne serije prema šablonu
      const sets = [];
      for (let i = 0; i < templateEx.setsCount; i++) {
        sets.push({ weight: '', reps: '', isCompleted: false });
      }

      return {
        exerciseId,
        name: finalName,
        category: finalCategory,
        sets
      };
    });

    // Upisujemo šablon u localStorage
    localStorage.setItem('fitflow_title', template.title);
    localStorage.setItem('fitflow_active_exercises', JSON.stringify(selectedExercises));
    localStorage.setItem('fitflow_seconds', '0');

    // Preusmeravanje na trening ekran
    navigate('/workout/active');
    window.location.reload();
  };

  return (
    <Container className="py-5 text-light">
      {/* HERO HERO SECTION */}
      <div className="text-center my-5">
        <h1 className="fw-bold text-white display-4 mb-2">FitFlow Centar</h1>
        <p className="text-muted fs-5">Započni novi trening ili nastavi sa šablonom</p>
        
        <Button 
          variant="primary" 
          size="lg" 
          className="fw-bold px-5 py-3 mt-4 shadow-sm d-inline-flex align-items-center gap-2"
          onClick={handleStartEmptyWorkout}
        >
          <FaPlus /> Započni PRAZAN trening
        </Button>
      </div>

      {/* POPULARNI ŠABLONI */}
      <div className="mt-5">
        <h3 className="fw-bold text-white mb-4">Popularni Šabloni</h3>
        <Row className="g-4">
          {templates.map((template, idx) => (
            <Col xs={12} md={4} key={idx}>
              <Card 
                className="border-0 h-100 shadow-sm" 
                style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: '12px' }}
              >
                <Card.Body className="p-4 d-flex flex-column justify-content-between">
                  <div>
                    <span className="text-muted small d-flex align-items-center gap-1 mb-2 text-capitalize">
                      <FaDumbbell size={12} className="text-primary" /> {template.subtitle}
                    </span>
                    <h5 className="fw-bold text-white mb-3">{template.title}</h5>
                    
                    <ul className="list-unstyled text-white-50 small mb-4">
                      {template.exercises.map((ex, exIdx) => (
                        <li key={exIdx} className="mb-1 text-capitalize">
                          - {ex.searchName} ({ex.setsCount}x)
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    variant="outline-primary" 
                    className="fw-bold w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <FaPlay size={10} /> Koristi šablon
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default HomeScreen;