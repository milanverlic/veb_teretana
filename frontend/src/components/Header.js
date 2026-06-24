import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHistory, FaUsers, FaShieldAlt, FaDumbbell, FaSignInAlt } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Izvlačenje podataka o ulogovanom korisniku
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  
  // Provera da li je ulogovani korisnik admin
  const isAdmin = userInfo && userInfo.email === 'verlicmilan@gmail.com';

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('fitflow_title');
    localStorage.removeItem('fitflow_active_exercises');
    localStorage.removeItem('fitflow_seconds');
    navigate('/login');
    window.location.reload();
  };

  // Funkcija za aktivnu rutu (svetljenje teksta)
  const isActive = (path) => location.pathname === path ? 'text-primary fw-bold' : 'text-white-50';

  return (
    <Navbar expand="lg" variant="dark" className="py-3 border-bottom border-secondary" style={{ backgroundColor: '#1e293b' }}>
      <Container>
        {/* LOGO */}
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }} className="fw-bold fs-3 text-white me-4">
          Fit<span className="text-primary">Flow</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-secondary" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* LEVA STRANA: Navigacija (Pametno filtrirana na osnovu login statusa) */}
          <Nav className="me-auto gap-3 my-2 my-lg-0 align-items-center">
            <Nav.Link onClick={() => navigate('/exercises')} className={`d-flex align-items-center gap-2 fs-5 ${isActive('/exercises')}`}>
              🏋️ Baza vežbi
            </Nav.Link>
            
            {/* Istorija i Zajednica se vide SAMO ako je korisnik ulogovan */}
            {userInfo && (
              <>
                <Nav.Link onClick={() => navigate('/history')} className={`d-flex align-items-center gap-2 fs-5 ${isActive('/history')}`}>
                  <FaHistory /> Istorija
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/community')} className={`d-flex align-items-center gap-2 fs-5 ${isActive('/community')}`}>
                  <FaUsers /> Zajednica
                </Nav.Link>
              </>
            )}
            
            {/* Dugme za aktivan trening vodi na tačnu rutu /workout/active */}
            {userInfo && localStorage.getItem('fitflow_active_exercises') && (
              <Nav.Link onClick={() => navigate('/workout/active')} className="text-warning fw-bold fs-5 animate-pulse">
                ⚡ Aktivan trening
              </Nav.Link>
            )}
          </Nav>

          {/* DESNA STRANA: Sređen uslov za Login / Korisničku kapsulu */}
          <Nav className="ms-auto align-items-center mt-2 mt-lg-0">
            {userInfo ? (
              /* AKO JE KORISNIK ULOGOVAN: Prikazuje se siva kapsula sa imenom i admin oznakom */
              <div 
                className="d-flex align-items-center gap-3 p-2 rounded-pill shadow-sm" 
                style={{ backgroundColor: 'rgba(51, 65, 85, 0.6)', border: '1px solid rgba(255,255,255,0.1)', minHeight: '46px' }}
              >
                <span className="text-white fw-bold d-flex align-items-center gap-1 ps-2 fs-5">
                  👋 {userInfo.name ? userInfo.name.split(' ')[0] : 'Korisnik'}
                </span>
                
                {isAdmin && (
                  <span 
                    className="badge d-flex align-items-center gap-1 border"
                    style={{ 
                      fontSize: '0.75rem', 
                      letterSpacing: '0.8px', 
                      padding: '5px 10px',
                      backgroundColor: 'rgba(220, 53, 69, 0.2)',
                      borderColor: '#dc3545',
                      color: '#ff6b6b',
                      borderRadius: '30px'
                    }}
                  >
                    <FaShieldAlt size={11} /> ADMIN
                  </span>
                )}
                
                <Button 
                  variant="link" 
                  className="text-danger p-0 pe-2 text-decoration-none fw-bold fs-5" 
                  onClick={handleLogout}
                  style={{ transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#ff6b6b'}
                  onMouseLeave={(e) => e.target.style.color = '#dc3545'}
                >
                  Odjavi se
                </Button>
              </div>
            ) : (
              /* VRACENO: AKO KORISNIK NIJE ULOGOVAN: Prikazuje se dugme za prijavu */
              <Button 
                variant="primary" 
                size="md" 
                className="fw-bold d-flex align-items-center gap-2 px-4 shadow-sm text-white"
                onClick={() => navigate('/login')}
              >
                <FaSignInAlt /> Prijavi se
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;