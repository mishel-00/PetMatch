import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginDebug = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simular login exitoso y guardar "uid" falso
    localStorage.setItem('uid', 'debug-uid-123');
    navigate('/home');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login DEBUG</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: 8, marginBottom: 12 }}
      />
      <br />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};

export default LoginDebug;
