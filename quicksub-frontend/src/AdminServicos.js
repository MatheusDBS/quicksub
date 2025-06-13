import React, { useState, useEffect } from 'react';

function AdminServicos() {
  const [servicos, setServicos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editPreco, setEditPreco] = useState('');
  const [showPerfil, setShowPerfil] = useState(false);
  const [perfil, setPerfil] = useState({ username: '', email: '' });
  const [editando, setEditando] = useState(false);
  const [novoUsername, setNovoUsername] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [perfilMsg, setPerfilMsg] = useState('');

  useEffect(() => {
    fetchServicos();
  }, []);

  useEffect(() => {
    if (showPerfil) {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setPerfil({ username: payload.username, email: payload.email || payload.email });
        setNovoUsername(payload.username);
      } catch {}
    }
  }, [showPerfil]);

  const fetchServicos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/servicos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        let data = await res.json();
        // Ordena alfabeticamente pelo nome
        data = data.sort((a, b) => a.nome.localeCompare(b.nome));
        setServicos(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/servicos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, descricao, preco })
      });
      if (res.ok) {
        setMsg('Serviço adicionado!');
        setNome(''); setDescricao(''); setPreco('');
        fetchServicos();
      } else {
        setMsg('Erro ao adicionar serviço.');
      }
    } catch {
      setMsg('Erro de conexão.');
    }
    setLoading(false);
  };

  const handleEditar = (servico) => {
    setEditandoId(servico.id);
    setEditNome(servico.nome);
    setEditDescricao(servico.descricao);
    setEditPreco(servico.preco);
  };

  const handleSalvarEdicao = async (id) => {
    setMsg('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/servicos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: editNome, descricao: editDescricao, preco: editPreco })
      });
      if (res.ok) {
        setMsg('Serviço atualizado!');
        setEditandoId(null);
        fetchServicos();
      } else {
        setMsg('Erro ao atualizar serviço.');
      }
    } catch {
      setMsg('Erro de conexão.');
    }
    setLoading(false);
  };

  const handleExcluir = async (id) => {
    setMsg('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/servicos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setMsg('Serviço excluído!');
        fetchServicos();
      } else {
        setMsg('Erro ao excluir serviço.');
      }
    } catch {
      setMsg('Erro de conexão.');
    }
    setLoading(false);
  };

  const handlePerfilSalvar = async () => {
    setPerfilMsg('');
    if (novaSenha && novaSenha !== confirmarSenha) {
      setPerfilMsg('As senhas não coincidem.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: novoUsername, password: novaSenha })
      });
      if (res.ok) {
        setPerfilMsg('Informações atualizadas! Faça login novamente.');
        setPerfil({ username: novoUsername, email: perfil.email });
        setEditando(false);
        setNovaSenha('');
        setConfirmarSenha('');
        setTimeout(() => { window.location.reload(); }, 1500);
      } else {
        setPerfilMsg('Erro ao atualizar informações.');
      }
    } catch {
      setPerfilMsg('Erro de conexão.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: 'var(--secondary)', padding: 24, borderRadius: 8 }}>
      <h2>Administração de Serviços</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do serviço" required style={{ width: 280, marginBottom: 8, padding: 8 }} />
        <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição do plano" required style={{ width: 280, marginBottom: 8, padding: 8 }} />
        <input type="number" value={preco} onChange={e => setPreco(e.target.value)} placeholder="Preço" required min="0" step="0.01" style={{ width: 280, marginBottom: 8, padding: 8 }} />
        <button type="submit" style={{ width: 280 }} disabled={loading}>{loading ? 'Adicionando...' : 'Adicionar Serviço'}</button>
        {msg && <div style={{ color: 'var(--primary)', marginTop: 8 }}>{msg}</div>}
      </form>
      <h3>Serviços cadastrados</h3>
      {loading ? <div>Carregando...</div> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {servicos.map(s => (
            <li key={s.id} style={{ background: 'var(--primary)', color: '#fff', margin: '8px 0', padding: 12, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {editandoId === s.id ? (
                <>
                  <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} style={{ width: 100, marginRight: 8, padding: 4 }} />
                  <input type="text" value={editDescricao} onChange={e => setEditDescricao(e.target.value)} style={{ width: 120, marginRight: 8, padding: 4 }} />
                  <input type="number" value={editPreco} onChange={e => setEditPreco(e.target.value)} style={{ width: 70, marginRight: 8, padding: 4 }} />
                  <button style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', marginRight: 4 }} onClick={() => handleSalvarEdicao(s.id)}>Salvar</button>
                  <button style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 4, padding: '4px 10px' }} onClick={() => setEditandoId(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  <span><b>{s.nome}</b> - {s.descricao} - R$ {s.preco}</span>
                  <span>
                    <button style={{ background: '#2196f3', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', marginRight: 4 }} onClick={() => handleEditar(s)}>Editar</button>
                    <button style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px' }} onClick={() => handleExcluir(s.id)}>Excluir</button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <div style={{ position: 'fixed', top: 24, right: 32, zIndex: 100, display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <button onClick={() => setShowPerfil(v => !v)} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '50%', width: 44, height: 44, fontSize: 22, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Perfil">
          <span role="img" aria-label="perfil">👤</span>
        </button>
        {showPerfil && (
          <div style={{ position: 'absolute', top: 54, right: 0, background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 24, minWidth: 260 }}>
            <h3 style={{ marginTop: 0 }}>Meu Perfil</h3>
            {!editando ? (
              <>
                <div><b>Usuário:</b> {perfil.username}</div>
                <button style={{ marginTop: 16, width: '100%' }} onClick={() => setEditando(true)}>Editar</button>
                <button style={{ marginTop: 8, width: '100%' }} onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Sair</button>
                <button style={{ marginTop: 8, width: '100%' }} onClick={() => setShowPerfil(false)}>Fechar</button>
                {perfilMsg && <div style={{ color: 'var(--primary)', marginTop: 8 }}>{perfilMsg}</div>}
              </>
            ) : (
              <>
                <input type="text" value={novoUsername} onChange={e => setNovoUsername(e.target.value)} style={{ width: '100%', marginBottom: 8, padding: 8 }} />
                <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} style={{ width: '100%', marginBottom: 8, padding: 8 }} placeholder="Nova senha (opcional)" />
                <input type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} style={{ width: '100%', marginBottom: 8, padding: 8 }} placeholder="Confirmar nova senha" />
                <button style={{ width: '100%' }} onClick={handlePerfilSalvar}>Salvar</button>
                <button style={{ marginTop: 8, width: '100%' }} onClick={() => setEditando(false)}>Cancelar</button>
                {perfilMsg && <div style={{ color: 'var(--primary)', marginTop: 8 }}>{perfilMsg}</div>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminServicos;
