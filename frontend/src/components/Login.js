import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      if (res.data.success) {
        setMessage(`Dobrodošli nazad! Uspešna prijava.`);
        
        // PAŽNJA: Čuvamo podatke o korisniku u brauzer da ostanu zapamćeni!
        localStorage.setItem('userInfo', JSON.stringify(res.data.user));

        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Ovo će osvežiti Header da odmah vidi promenu!
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Pogrešan email ili lozinka.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-white shadow border-0" style={{ borderRadius: '15px', backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)' }}>
            <div className="card-body p-5">
              <h2 className="text-center mb-4 fw-bold text-white">Prijava na Nalog 🔐</h2>
              
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label text-white-50">Email adresa</label>
                  <input type="email" className="form-control bg-secondary text-white border-0" name="email" value={email} onChange={onChange} required />
                </div>
                <div className="mb-4">
                  <label className="form-label text-white-50">Lozinka</label>
                  <input type="password" className="form-control bg-secondary text-white border-0" name="password" value={password} onChange={onChange} required />
                </div>
                <button type="submit" className="btn btn-success w-100 fw-bold py-2 mb-3" style={{ borderRadius: '8px' }}>
                  Prijavi se
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-white-50">Nemate nalog? </span>
                <Link to="/register" className="text-info text-decoration-none fw-bold">Registrujte se</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;