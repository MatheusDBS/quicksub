import React, { useState, useEffect } from 'react';
import Login from './Login';
import Cadastro from './Cadastro';
import Principal from './Principal';
import AdminServicos from './AdminServicos';
import './App.css';
import logo from './assets/Logo.png.png';

function App() {
  const [tela, setTela] = useState('login');
  const [logado, setLogado] = useState(!!localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(payload.username === 'admin');
      } catch {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [logado]);

  const handleLogin = () => {
    setLogado(true);
    setTela('principal');
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLogado(false);
    setTela('login');
  };

  return (
    <div className="App" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #8000ff 0%, #a259ff 50%, #ff6a00 100%)' }}>
      <header className="App-header" style={{ background: 'transparent', minHeight: 'unset', padding: '2rem 0 1rem 0', boxShadow: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={logo} alt="QuickSub logo" style={{ height: 80, marginBottom: 8 }} />
        <h1 style={{ fontWeight: 700, fontSize: 36, margin: 0, color: '#fff', letterSpacing: 1 }}>QuickSub</h1>
        <span style={{ color: '#fff', fontSize: 18, fontWeight: 400, marginTop: 4 }}>O melhor gerenciador de assinaturas</span>
      </header>
      <main style={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
        {isAdmin && logado ? (
          <AdminServicos />
        ) : (
          <>
            {!logado && tela === 'login' && (
              <>
                <Login onLogin={handleLogin} />
                <p style={{ color: 'var(--text)' }}>Não tem conta? <button style={{ background: 'none', color: '#fff', textDecoration: 'underline', padding: 0 }} onClick={() => setTela('cadastro')}>Cadastre-se</button></p>
              </>
            )}
            {!logado && tela === 'cadastro' && (
              <>
                <Cadastro onCadastro={() => setTela('login')} />
                <p style={{ color: 'var(--text)' }}>Já tem conta? <button style={{ background: 'none', color: '#fff', textDecoration: 'underline', padding: 0 }} onClick={() => setTela('login')}>Entrar</button></p>
              </>
            )}
            {logado && <Principal onLogout={handleLogout} />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
