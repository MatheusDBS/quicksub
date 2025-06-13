import React, { useState } from 'react';
import eyeIcon from './assets/eye.png'; // ajuste o caminho conforme o local onde você salvou
import eyeOffIcon from './assets/eye-off.png'; // ajuste o caminho conforme o local onde você salvou
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        onLogin();
      } else {
        setErro(data.message || 'Erro ao fazer login');
      }
    } catch (err) {
      setErro('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, width: '100%', margin: '2rem auto', background: 'var(--secondary)', padding: 24, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc', boxSizing: 'border-box' }}
        autoComplete="username"
      />
      <div style={{ position: 'relative', width: '100%', marginBottom: 12 }}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', boxSizing: 'border-box', paddingRight: 40 }}
          autoComplete="current-password"
        />
        <img
          src={showPassword ? eyeOffIcon : eyeIcon}
          alt="Toggle Password Visibility"
          onClick={() => setShowPassword(!showPassword)}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, cursor: 'pointer', opacity: 0.7 }}
        />
      </div>
      <button type="submit" style={{ width: 220 }} disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      {erro && <div style={{ color: 'var(--accent)', marginTop: 8 }}>{erro}</div>}
    </form>
  );
}

export default Login;
