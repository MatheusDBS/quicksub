import React, { useState } from 'react';
import eyeIcon from './assets/eye.png'; // ajuste o caminho conforme o local onde você salvou
import eyeOffIcon from './assets/eye-off.png'; // ajuste o caminho conforme o local onde você salvou

function Cadastro({ onCadastro }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc', boxSizing: 'border-box' }}
        autoComplete="username"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc', boxSizing: 'border-box' }}
        autoComplete="email"
      />
      <div style={{ position: 'relative', width: '100%', marginBottom: 12 }}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', boxSizing: 'border-box', paddingRight: 40 }}
          autoComplete="new-password"
        />
        <img
          src={showPassword ? eyeOffIcon : eyeIcon}
          alt="Toggle Password Visibility"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 24,
            height: 24,
            cursor: 'pointer',
            opacity: 0.7
          }}
        />
      </div>
      <button type="submit" style={{ width: 220 }} disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
      {erro && <div style={{ color: 'var(--accent)', marginTop: 8 }}>{erro}</div>}
      {sucesso && <div style={{ color: 'var(--primary)', marginTop: 8 }}>{sucesso}</div>}
    </form>
  );
}

export default Cadastro;
