import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { name, username, email, password, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      if (res.data.success) {
        setMessage('Uspešna registracija! Ulazak u FitFlow...');
        
        // AUTOMATSKI LOGIN: Čim se registruje, odmah ga upisujemo u memoriju
        // Tako da ne mora dvaput da kuca podatke!
        localStorage.setItem('userInfo', JSON.stringify({
          id: res.data.data.id,
          name: res.data.data.name,
          username: res.data.data.username,
          email: res.data.data.email,
          role: res.data.data.role
        }));

        setFormData({ name: '', username: '', email: '', password: '', role: 'user' });
        
        // Vodi ga pravo na glavnu stranicu nakon 1.5 sekunde
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Došlo je do greške.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-white shadow border-0" style={{ borderRadius: '15px', backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)' }}>
            <div className="card-body p-5">
              <h2 className="text-center mb-4 fw-bold text-white">Kreiraj Nalog 🏋️‍♂️</h2>
              
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label text-white-50">Ime i prezime</label>
                  <input type="text" className="form-control bg-secondary text-white border-0" name="name" value={name} onChange={onChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white-50">Korisničko ime (Username)</label>
                  <input type="text" className="form-control bg-secondary text-white border-0" name="username" value={username} onChange={onChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white-50">Email adresa</label>
                  <input type="email" className="form-control bg-secondary text-white border-0" name="email" value={email} onChange={onChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white-50">Lozinka</label>
                  <input type="password" className="form-control bg-secondary text-white border-0" name="password" value={password} onChange={onChange} minLength="6" required />
                </div>
                <div className="mb-4">
                  <label className="form-label text-white-50">Uloga u sistemu</label>
                  <select className="form-select bg-secondary text-white border-0" name="role" value={role} onChange={onChange}>
                    <option value="user">Korisnik (Trening mod)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mb-3" style={{ borderRadius: '8px' }}>
                  Registruj se
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-white-50">Već imate nalog? </span>
                <Link to="/login" className="text-info text-decoration-none fw-bold">Prijavite se</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;