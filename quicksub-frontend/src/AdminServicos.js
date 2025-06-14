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
  // Novo: lista de planos para cadastro múltiplo
  const [planos, setPlanos] = useState([{ descricao: '', preco: '' }]);
  // Estado para controlar quais grupos estão abertos
  const [abertos, setAbertos] = useState({});
  const [requests, setRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [requestMsg, setRequestMsg] = useState('');
  const [resposta, setResposta] = useState('');
  const [respostaStatus, setRespostaStatus] = useState('pendente');
  const [selectedRequest, setSelectedRequest] = useState(null);

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

  // Buscar requests de novos serviços
  const fetchRequests = async () => {
    setRequestMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/service-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        setRequestMsg('Erro ao buscar solicitações.');
      }
    } catch {
      setRequestMsg('Erro de conexão.');
    }
  };

  // Adiciona novo campo de plano
  const adicionarPlano = () => {
    setPlanos([...planos, { descricao: '', preco: '' }]);
  };

  // Remove um campo de plano
  const removerPlano = (idx) => {
    setPlanos(planos.filter((_, i) => i !== idx));
  };

  // Atualiza valor de um campo de plano
  const handlePlanoChange = (idx, field, value) => {
    setPlanos(planos.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  // Novo handleAdd para múltiplos planos
  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      for (const plano of planos) {
        if (!plano.descricao || !plano.preco) continue;
        const res = await fetch('http://localhost:5000/api/servicos', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nome, descricao: plano.descricao, preco: plano.preco })
        });
        if (!res.ok) {
          setMsg('Erro ao adicionar serviço.');
          setLoading(false);
          return;
        }
      }
      setMsg('Serviço(s) adicionado(s)!');
      setNome('');
      setPlanos([{ descricao: '', preco: '' }]);
      fetchServicos();
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

  // Agrupa os serviços por nome
  const servicosAgrupados = servicos.reduce((acc, servico) => {
    if (!acc[servico.nome]) acc[servico.nome] = [];
    acc[servico.nome].push(servico);
    return acc;
  }, {});

  // Alterna o grupo aberto/fechado
  const toggleGrupo = (nomeGrupo) => {
    setAbertos(prev => ({ ...prev, [nomeGrupo]: !prev[nomeGrupo] }));
  };

  // Marcar request como respondida pelo admin (ao responder)
  const handleResponderRequest = async (id) => {
    setRequestMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/service-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: respostaStatus, resposta_admin: resposta })
      });
      if (res.ok) {
        setRequestMsg('Resposta enviada!');
        setResposta('');
        setRespostaStatus('pendente');
        setSelectedRequest(null);
        // Remove da lista após resposta
        setRequests(requests.filter(r => r.id !== id));
      } else {
        setRequestMsg('Erro ao responder solicitação.');
      }
    } catch {
      setRequestMsg('Erro de conexão.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: 'var(--secondary)', padding: 24, borderRadius: 8 }}>
      <h2>Administração de Serviços</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do serviço" required style={{ width: 280, marginBottom: 8, padding: 8 }} />
        {planos.map((plano, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input type="text" value={plano.descricao} onChange={e => handlePlanoChange(idx, 'descricao', e.target.value)} placeholder="Descrição do plano" required style={{ width: 140, padding: 8 }} />
            <input type="number" value={plano.preco} onChange={e => handlePlanoChange(idx, 'preco', e.target.value)} placeholder="Preço" required min="0" step="0.01" style={{ width: 90, padding: 8 }} />
            {planos.length > 1 && <button type="button" onClick={() => removerPlano(idx)} style={{ background: '#ff4d4f', color: '#fff', padding: '4px 10px' }}>Remover</button>}
          </div>
        ))}
        <button type="button" onClick={adicionarPlano} style={{ width: 280, marginBottom: 8, background: '#2196f3' }}>Adicionar outro plano</button>
        <button type="submit" style={{ width: 280 }} disabled={loading}>{loading ? 'Adicionando...' : 'Adicionar Serviço(s)'}</button>
        {msg && <div style={{ color: 'var(--primary)', marginTop: 8 }}>{msg}</div>}
      </form>
      <h3>Serviços cadastrados</h3>
      {loading ? <div>Carregando...</div> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {Object.entries(servicosAgrupados).map(([nomeGrupo, planos]) => (
            <li key={nomeGrupo} style={{ background: 'var(--primary)', color: '#fff', margin: '12px 0', padding: 16, borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => toggleGrupo(nomeGrupo)}>
                <span style={{ fontWeight: 'bold', fontSize: 18 }}>{nomeGrupo}</span>
                <span style={{ fontSize: 22, marginLeft: 8 }}>{abertos[nomeGrupo] ? '▼' : '▶'}</span>
              </div>
              {abertos[nomeGrupo] && (
                <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
                  {planos.map((plano) => (
                    <li key={plano.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                      {editandoId === plano.id ? (
                        <>
                          <input type="text" value={editDescricao} onChange={e => setEditDescricao(e.target.value)} style={{ width: 120, marginRight: 8, padding: 4 }} />
                          <input type="number" value={editPreco} onChange={e => setEditPreco(e.target.value)} style={{ width: 70, marginRight: 8, padding: 4 }} />
                          <button style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', marginRight: 4 }} onClick={() => handleSalvarEdicao(plano.id)}>Salvar</button>
                          <button style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 4, padding: '4px 10px' }} onClick={() => setEditandoId(null)}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <span style={{ minWidth: 120 }}>{plano.descricao}</span> - R$ {plano.preco}
                          <button style={{ background: '#2196f3', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', marginLeft: 8, marginRight: 4 }} onClick={e => { e.stopPropagation(); setEditandoId(plano.id); setEditDescricao(plano.descricao); setEditPreco(plano.preco); }}>Editar</button>
                          <button style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px' }} onClick={e => { e.stopPropagation(); handleExcluir(plano.id); }}>Excluir</button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
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
                {/* Botão X para fechar no canto superior direito */}
                <button
                  onClick={() => setShowPerfil(false)}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'transparent',
                    border: 'none',
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: '#888',
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1
                  }}
                  title="Fechar"
                  aria-label="Fechar"
                >
                  ×
                </button>
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
      <button style={{ width: 280, marginBottom: 8 }} type="button" onClick={() => { setShowRequests(true); fetchRequests(); }}>
        Solicitações de novos serviços
      </button>
      {showRequests && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 24, minWidth: 400, maxHeight: 600, overflowY: 'auto' }}>
            <h3>Solicitações de novos serviços</h3>
            {requests.length === 0 && <div>Nenhuma solicitação.</div>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {requests.map(r => (
                <li key={r.id} style={{ border: '1px solid #eee', borderRadius: 6, marginBottom: 12, padding: 12, background: '#fafafa' }}>
                  <b>Usuário:</b> {r.username || r.user_id} <br />
                  <b>Serviço:</b> {r.nome_servico} <br />
                  <b>Descrição:</b> {r.descricao || '-'} <br />
                  <b>Status:</b> {r.status} <br />
                  <b>Resposta admin:</b> {r.resposta_admin || '-'} <br />
                  {selectedRequest && selectedRequest.id === r.id ? (
                    <div style={{ marginTop: 12 }}>
                      <h4>Responder solicitação</h4>
                      <div><b>Serviço:</b> {selectedRequest.nome_servico}</div>
                      <textarea value={resposta} onChange={e => setResposta(e.target.value)} placeholder="Resposta do admin" style={{ width: '100%', marginBottom: 8, padding: 8, minHeight: 60 }} />
                      <select value={respostaStatus} onChange={e => setRespostaStatus(e.target.value)} style={{ width: '100%', marginBottom: 8, padding: 8 }}>
                        <option value="aprovado">Aprovar</option>
                        <option value="rejeitado">Rejeitar</option>
                        <option value="pendente">Pendente</option>
                      </select>
                      <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer', marginRight: 8 }} onClick={() => handleResponderRequest(selectedRequest.id)}>Enviar resposta</button>
                      <button style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }} onClick={() => setSelectedRequest(null)}>Cancelar</button>
                    </div>
                  ) : (
                    r.status === 'pendente' && (
                      <button style={{ marginTop: 8 }} onClick={() => { setSelectedRequest(r); setResposta(r.resposta_admin || ''); setRespostaStatus('aprovado'); }}>Responder</button>
                    )
                  )}
                </li>
              ))}
            </ul>
            <button style={{ marginTop: 8 }} onClick={() => setShowRequests(false)}>Fechar</button>
            {requestMsg && <div style={{ color: 'var(--primary)', marginTop: 8 }}>{requestMsg}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminServicos;
