import React, { useState } from 'react';

function Cadastro({ onCadastro }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSucesso('Cadastro realizado! Faça login.');
        setUsername('');
        setEmail('');
        setPassword('');
        if (onCadastro) onCadastro();
      } else {
        setErro(data.message || 'Erro ao cadastrar');
      }
    } catch (err) {
      setErro('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, width: '100%', margin: '2rem auto', background: 'var(--secondary)', padding: 24, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Cadastro</h2>
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
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ width: 220, marginBottom: 12, padding: 8 }}
        autoComplete="email"
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ width: 220, marginBottom: 12, padding: 8 }}
        autoComplete="new-password"
      />
      <button type="submit" style={{ width: 220 }} disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
      {erro && <div style={{ color: 'var(--accent)', marginTop: 8 }}>{erro}</div>}
      {sucesso && <div style={{ color: 'var(--primary)', marginTop: 8 }}>{sucesso}</div>}
    </form>
  );
}

export default Cadastro;
