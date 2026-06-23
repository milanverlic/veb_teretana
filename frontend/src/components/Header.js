import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  // Čitamo ulogovanog korisnika
  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary p-3">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center text-white text-decoration-none fs-3">
          <span className="me-2">📊</span> FitFlow
        </Link>
        
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav align-items-center gap-3">
            <li className="nav-item">
              <Link to="/exercises" className="nav-link text-white-50 d-flex align-items-center text-decoration-none">
                <span className="me-1">🏋️‍♂️</span> Vežbe
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/history" className="nav-link text-white-50 d-flex align-items-center text-decoration-none">
                <span className="me-1">🕒</span> Istorija
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/community" className="nav-link text-white-50 d-flex align-items-center text-decoration-none">
                <span className="me-1">👥</span> Zajednica
              </Link>
            </li>

            {/* Ako je korisnik ulogovan, ispiši njegovo ime i dugme za Odjavu */}
            {userInfo ? (
              <li className="nav-item d-flex align-items-center gap-2 bg-secondary px-3 py-1" style={{ borderRadius: '20px' }}>
                <span className="text-white fw-bold">👋 {userInfo.name}</span>
                <button onClick={logoutHandler} className="btn btn-sm btn-outline-danger border-0 fw-bold ms-2">
                  Odjavi se
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="btn btn-primary fw-bold text-white px-4" style={{ borderRadius: '8px' }}>
                  Prijavi se
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;