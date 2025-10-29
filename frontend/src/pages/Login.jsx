import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/Login.css'; // 👈 agregaremos este archivo de estilos

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('auth/login/', { username, password });
      window.location.href = '/'; // Redirige al inicio si todo va bien
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Inicia sesión en Project Tracker</h2>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre de usuario"
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
            />
          </div>

          <button type="submit" className="login-btn">Iniciar sesión</button>
        </form>

        <p className="footer-text">
          ¿Olvidaste tu contraseña? <a href="#">Recupérala</a>
        </p>
      </div>
    </div>
  );
}