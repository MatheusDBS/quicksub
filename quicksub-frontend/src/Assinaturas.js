import React, { useEffect, useState } from 'react';

function Assinaturas({ onLogout }) {
  const [assinaturas, setAssinaturas] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchAssinaturas = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/assinaturas', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAssinaturas(data);
        } else {
          setErro('Erro ao buscar assinaturas');
        }
      } catch {
        setErro('Erro de conexão');
      }
    };
    fetchAssinaturas();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: 'var(--secondary)', padding: 24, borderRadius: 8 }}>
      <h2>Minhas Assinaturas</h2>
      <button onClick={onLogout} style={{ float: 'right', marginBottom: 16 }}>Sair</button>
      {erro && <div style={{ color: 'var(--accent)' }}>{erro}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {assinaturas.map(a => (
          <li key={a._id} style={{ background: 'var(--primary)', margin: '12px 0', padding: 16, borderRadius: 6 }}>
            <strong>{a.nome}</strong><br />
            Valor: R$ {a.valor}<br />
            Vencimento: {a.vencimento}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Assinaturas;
