import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

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
        style={{ width: 220, marginBottom: 12, padding: 8 }}
        autoComplete="username"
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ width: 220, marginBottom: 12, padding: 8 }}
        autoComplete="current-password"
      />
      <button type="submit" style={{ width: 220 }} disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      {erro && <div style={{ color: 'var(--accent)', marginTop: 8 }}>{erro}</div>}
    </form>
  );
}

export default Login;
