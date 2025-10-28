import React, { useState } from 'react';
import API from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('auth/login/', { username, password });
      setUserData(res.data);
      setError('');
      alert('✅ Login correcto');
    } catch (err) {
      setError('❌ Credenciales inválidas o CSRF bloqueado');
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: 'auto' }}>
      <h2>🔐 Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%' }}>Entrar</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {userData && (
        <pre style={{
          background: '#f5f5f5',
          padding: '10px',
          marginTop: '10px',
          borderRadius: '5px',
        }}>
          {JSON.stringify(userData, null, 2)}
        </pre>
      )}
    </div>
  );
}