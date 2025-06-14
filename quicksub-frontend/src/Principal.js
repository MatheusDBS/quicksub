import React, { useEffect, useState } from 'react';
import eyeIcon from './assets/eye.png';
import eyeOffIcon from './assets/eye-off.png';

function Principal({ onLogout }) {
  const [assinaturas, setAssinaturas] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [siteSelecionado, setSiteSelecionado] = useState('');
  const [planoId, setPlanoId] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(null);
  const [showPerfil, setShowPerfil] = useState(false);
  const [perfil, setPerfil] = useState({ username: '', email: '' });
  const [editando, setEditando] = useState(false);
  const [novoUsername, setNovoUsername] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [perfilMsg, setPerfilMsg] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [confirmarLogout, setConfirmarLogout] = useState(false);
  const [confirmarExclusaoConta, setConfirmarExclusaoConta] = useState(false);
  const [editandoAssinaturaId, setEditandoAssinaturaId] = useState(null);
  const [editAssinatura, setEditAssinatura] = useState({ servicoId: '', dataInicio: '', dataFim: '' });
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestNome, setRequestNome] = useState('');
  const [requestDescricao, setRequestDescricao] = useState('');
  const [requestMsg, setRequestMsg] = useState('');
  const [showRequestsUser, setShowRequestsUser] = useState(false);
  const [userRequests, setUserRequests] = useState([]);
  const [userRequestsMsg, setUserRequestsMsg] = useState('');

  // Busca assinaturas e serviços existentes
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
    const fetchServicos = async () => {
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
      } catch {}
    };
    fetchAssinaturas();
    fetchServicos();
  }, [sucesso]);

  // Lista de sites únicos
  const sitesUnicos = Array.from(new Set(servicos.map(s => s.nome)));
  // Planos filtrados pelo site selecionado
  const planosFiltrados = servicos.filter(s => s.nome === siteSelecionado);

  // Cadastro de assinatura
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Pegue o user_id do token JWT decodificando-o
      let user_id = null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user_id = payload.id;
      } catch {
        user_id = 1; // fallback para teste
      }
      // Buscar cliente_id ou cliente_nome a partir do serviço selecionado
      const servicoSelecionado = servicos.find(s => s.id == planoId);
      console.log('servicoSelecionado:', servicoSelecionado); // <-- log para debug
      let cliente_id = servicoSelecionado ? (servicoSelecionado.cliente_id || servicoSelecionado.id_cliente) : null;
      let cliente_nome = servicoSelecionado ? (servicoSelecionado.cliente_nome || servicoSelecionado.cliente || servicoSelecionado.nome_cliente) : null;
      // Solução temporária para teste: se não houver cliente, usa 1
      if (!cliente_id && !cliente_nome) {
        cliente_id = 1;
      }
      // Log dos dados enviados
      console.log('Enviando assinatura:', { cliente_id, cliente_nome, servico_id: planoId, data_inicio: dataInicio, data_fim: dataFim, user_id });
      if (!planoId || !dataInicio || !dataFim || !user_id) {
        setErro('Preencha todos os campos corretamente.');
        setLoading(false);
        return;
      }
      const body = {
        servico_id: planoId,
        data_inicio: dataInicio,
        data_fim: dataFim,
        user_id
      };
      if (cliente_id) body.cliente_id = cliente_id;
      else if (cliente_nome) body.cliente_nome = cliente_nome;
      const res = await fetch('http://localhost:5000/api/assinaturas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setSucesso('Assinatura registrada!');
        setSiteSelecionado(''); setPlanoId(''); setDataInicio(''); setDataFim('');
      } else {
        const erroApi = await res.json().catch(() => ({}));
        setErro(erroApi.message || 'Erro ao registrar assinatura');
      }
    } catch (err) {
      setErro('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    setErro('');
    setSucesso('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/assinaturas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setSucesso('Assinatura excluída!');
        setAssinaturas(assinaturas.filter(a => a.id !== id));
      } else {
        setErro('Erro ao excluir assinatura');
      }
    } catch {
      setErro('Erro de conexão');
    }
    setConfirmarExclusao(null);
  };

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

  // Função para excluir conta do usuário logado
  async function handleExcluirConta() {
    setPerfilMsg('');
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        localStorage.removeItem('token');
        window.location.reload();
      } else {
        setPerfilMsg('Erro ao excluir conta.');
      }
    } catch {
      setPerfilMsg('Erro ao excluir conta.');
    }
    setConfirmarExclusaoConta(false);
  }

  // Função para iniciar edição de assinatura
  const handleEditarAssinatura = (a) => {
    setEditandoAssinaturaId(a.id);
    setEditAssinatura({
      servicoId: a.servico_id,
      dataInicio: a.data_inicio ? a.data_inicio.slice(0, 10) : '',
      dataFim: a.data_fim ? a.data_fim.slice(0, 10) : ''
    });
  };

  // Função para salvar edição
  const handleSalvarEdicaoAssinatura = async () => {
    setErro('');
    setSucesso('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/assinaturas/${editandoAssinaturaId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          servico_id: editAssinatura.servicoId,
          data_inicio: editAssinatura.dataInicio,
          data_fim: editAssinatura.dataFim
        })
      });
      if (res.ok) {
        setSucesso('Assinatura atualizada!');
        setEditandoAssinaturaId(null);
        setEditAssinatura({ servicoId: '', dataInicio: '', dataFim: '' });
        // Atualiza lista
        const novasAssinaturas = assinaturas.map(a => a.id === editandoAssinaturaId ? { ...a, ...{
          servico_id: editAssinatura.servicoId,
          data_inicio: editAssinatura.dataInicio,
          data_fim: editAssinatura.dataFim
        }} : a);
        setAssinaturas(novasAssinaturas);
      } else {
        setErro('Erro ao atualizar assinatura');
      }
    } catch {
      setErro('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  // Função para calcular status da assinatura
  function calcularStatus(dataInicio, dataFim) {
    if (!dataInicio || !dataFim) return 'Indefinido';
    const hoje = new Date();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    if (hoje < inicio) return 'Inativa';
    if (hoje > fim) return 'Expirada';
    return 'Ativa';
  }

  // Função para enviar request de novo serviço
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/service-requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome_servico: requestNome, descricao: requestDescricao })
      });
      if (res.ok) {
        setRequestMsg('Solicitação enviada! Aguarde resposta do admin.');
        setRequestNome('');
        setRequestDescricao('');
      } else {
        setRequestMsg('Erro ao enviar solicitação.');
      }
    } catch {
      setRequestMsg('Erro de conexão.');
    }
  };

  // Buscar requests do usuário
  const fetchUserRequests = async () => {
    setUserRequestsMsg('');
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      // Busca apenas as requests não lidas do usuário
      const res = await fetch(`http://localhost:5000/api/service-requests/user/${userId}/nao-lidas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserRequests(data);
      } else {
        setUserRequestsMsg('Erro ao buscar solicitações.');
      }
    } catch {
      setUserRequestsMsg('Erro de conexão.');
    }
  };

  // Marcar request como lida pelo usuário
  const handleMarcarRequestLida = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/service-requests/${id}/lida`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserRequests(userRequests.filter(r => r.id !== id));
    } catch {}
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', background: 'var(--secondary)', padding: 24, borderRadius: 8 }}>
      <h2>Minhas Assinaturas</h2>
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
                <button style={{ marginTop: 8, width: '100%' }} onClick={() => setConfirmarLogout(true)}>Sair</button>
                <button style={{ marginTop: 8, width: '100%', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4 }} onClick={() => setConfirmarExclusaoConta(true)}>Excluir conta</button>
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
                {confirmarLogout && (
                  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 24, minWidth: 220, textAlign: 'center' }}>
                      <div style={{ marginBottom: 16 }}>Deseja realmente sair da conta?</div>
                      <button style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', marginRight: 8, cursor: 'pointer' }} onClick={onLogout}>Sim</button>
                      <button style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }} onClick={() => setConfirmarLogout(false)}>Não</button>
                    </div>
                  </div>
                )}
                {confirmarExclusaoConta && (
                  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 24, minWidth: 220, textAlign: 'center' }}>
                      <div style={{ marginBottom: 16 }}>Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.</div>
                      <button style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', marginRight: 8, cursor: 'pointer' }} onClick={async () => { await handleExcluirConta(); }}>Excluir</button>
                      <button style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }} onClick={() => setConfirmarExclusaoConta(false)}>Cancelar</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <input type="text" value={novoUsername} onChange={e => setNovoUsername(e.target.value)} style={{ width: '100%', marginBottom: 8, padding: 8 }} />
                <div style={{ position: 'relative', width: '100%', marginBottom: 12 }}>
                  <input
                    type={showNovaSenha ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={e => setNovaSenha(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', boxSizing: 'border-box', paddingRight: 40 }}
                    placeholder="Nova senha (opcional)"
                  />
                  <img
                    src={showNovaSenha ? eyeOffIcon : eyeIcon}
                    alt="Toggle Password Visibility"
                    onClick={() => setShowNovaSenha(!showNovaSenha)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, cursor: 'pointer', opacity: 0.7 }}
                  />
                </div>
                <div style={{ position: 'relative', width: '100%', marginBottom: 12 }}>
                  <input
                    type={showConfirmarSenha ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', boxSizing: 'border-box', paddingRight: 40 }}
                    placeholder="Confirmar nova senha"
                  />
                  <img
                    src={showConfirmarSenha ? eyeOffIcon : eyeIcon}
                    alt="Toggle Password Visibility"
                    onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, cursor: 'pointer', opacity: 0.7 }}
                  />
                </div>
                <button style={{ width: '100%' }} onClick={handlePerfilSalvar}>Salvar</button>
                <button style={{ marginTop: 8, width: '100%' }} onClick={() => setEditando(false)}>Cancelar</button>
                {perfilMsg && <div style={{ color: 'var(--primary)', marginTop: 8 }}>{perfilMsg}</div>}
              </>
            )}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <select value={siteSelecionado} onChange={e => { setSiteSelecionado(e.target.value); setPlanoId(''); }} required style={{ width: 280, marginBottom: 8, padding: 8 }}>
          <option value="">Selecione o site</option>
          {sitesUnicos.map(site => (
            <option key={site} value={site}>{site}</option>
          ))}
        </select>
        <select value={planoId} onChange={e => setPlanoId(e.target.value)} required style={{ width: 280, marginBottom: 8, padding: 8 }} disabled={!siteSelecionado}>
          <option value="">Selecione o plano</option>
          {planosFiltrados.map(s => (
            <option key={s.id} value={s.id}>{s.descricao} - R$ {s.preco}</option>
          ))}
        </select>
        <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} required style={{ width: 280, marginBottom: 8, padding: 8 }} placeholder="Data de início" />
        <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} required style={{ width: 280, marginBottom: 8, padding: 8 }} placeholder="Data de fim" />
        <button type="submit" style={{ width: 280 }} disabled={loading}>{loading ? 'Registrando...' : 'Registrar Assinatura'}</button>
      </form>
      {erro && <div style={{ color: 'var(--accent)', marginBottom: 8 }}>{erro}</div>}
      {sucesso && <div style={{ color: 'var(--primary)', marginBottom: 8 }}>{sucesso}</div>}
      <button style={{ width: 280, marginBottom: 8 }} type="button" onClick={() => setShowRequestModal(true)}>
        Solicitar novo serviço
      </button>
      {showRequestModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 24, minWidth: 320 }}>
            <h3>Solicitar novo serviço</h3>
            <form onSubmit={handleRequestSubmit}>
              <input type="text" value={requestNome} onChange={e => setRequestNome(e.target.value)} placeholder="Nome do serviço" required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
              <textarea value={requestDescricao} onChange={e => setRequestDescricao(e.target.value)} placeholder="Descrição (opcional)" style={{ width: '100%', marginBottom: 8, padding: 8, minHeight: 60 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }}>Enviar</button>
                <button type="button" style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }} onClick={() => { setShowRequestModal(false); setRequestMsg(''); }}>Cancelar</button>
              </div>
            </form>
            {requestMsg && <div style={{ color: 'var(--primary)', marginTop: 8 }}>{requestMsg}</div>}
          </div>
        </div>
      )}
      <button style={{ width: 280, marginBottom: 8 }} type="button" onClick={() => { setShowRequestsUser(true); fetchUserRequests(); }}>
        Minhas solicitações de serviço
      </button>
      {showRequestsUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 24, minWidth: 400, maxHeight: 600, overflowY: 'auto' }}>
            <h3>Minhas solicitações de serviço</h3>
            {userRequests.length === 0 && <div>Nenhuma solicitação enviada.</div>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {userRequests.map(r => (
                <li key={r.id} style={{ border: '1px solid #eee', borderRadius: 6, marginBottom: 12, padding: 12, background: '#fafafa' }}>
                  <b>Serviço:</b> {r.nome_servico} <br />
                  <b>Descrição:</b> {r.descricao || '-'} <br />
                  <b>Status:</b> {r.status} <br />
                  <b>Resposta admin:</b> {r.resposta_admin || '-'} <br />
                  {r.status !== 'pendente' && (
                    <button style={{ marginTop: 8 }} onClick={() => handleMarcarRequestLida(r.id)}>Marcar como lida</button>
                  )}
                </li>
              ))}
            </ul>
            <button style={{ marginTop: 8 }} onClick={() => setShowRequestsUser(false)}>Fechar</button>
            {userRequestsMsg && <div style={{ color: 'var(--primary)', marginTop: 8 }}>{userRequestsMsg}</div>}
          </div>
        </div>
      )}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {assinaturas.map((a, i) => {
          const servico = servicos.find(s => s.id === a.servico_id);
          const formatarData = (data) => {
            if (!data) return '';
            const d = new Date(data);
            if (isNaN(d)) return data;
            return d.toLocaleDateString('pt-BR');
          };
          const isEditando = editandoAssinaturaId === a.id;
          return (
            <li key={a.id || i} style={{ background: 'var(--primary)', margin: '12px 0', padding: 16, borderRadius: 6, position: 'relative' }}>
              {isEditando ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <select value={editAssinatura.servicoId} onChange={e => setEditAssinatura({ ...editAssinatura, servicoId: e.target.value })} style={{ padding: 8 }}>
                    <option value="">Selecione o plano</option>
                    {servicos.map(s => (
                      <option key={s.id} value={s.id}>{s.nome} - {s.descricao} - R$ {s.preco}</option>
                    ))}
                  </select>
                  <input type="date" value={editAssinatura.dataInicio} onChange={e => setEditAssinatura({ ...editAssinatura, dataInicio: e.target.value })} style={{ padding: 8 }} />
                  <input type="date" value={editAssinatura.dataFim} onChange={e => setEditAssinatura({ ...editAssinatura, dataFim: e.target.value })} style={{ padding: 8 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: '#52c41a', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }} onClick={handleSalvarEdicaoAssinatura} disabled={loading}>
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }} onClick={() => setEditandoAssinaturaId(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <strong>Serviço:</strong> {servico ? servico.nome : a.servico_id} <br />
                  <strong>Plano:</strong> {servico ? servico.descricao : ''} <br />
                  <strong>Preço:</strong> R$ {servico ? servico.preco : ''} <br />
                  <strong>Início:</strong> {formatarData(a.data_inicio)} <br />
                  <strong>Fim:</strong> {formatarData(a.data_fim)} <br />
                  <strong>Status:</strong> {calcularStatus(a.data_inicio, a.data_fim)}
                </div>
              )}
              {!isEditando && (
                <>
                  <button
                    style={{ position: 'absolute', top: 16, right: 16, background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => setConfirmarExclusao(a.id)}
                  >
                    Excluir
                  </button>
                  <button
                    style={{ position: 'absolute', top: 16, right: 90, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => handleEditarAssinatura(a)}
                  >
                    Editar
                  </button>
                </>
              )}
              {confirmarExclusao === a.id && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}>
                  <div style={{
                    background: '#fff',
                    color: '#222',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    padding: 24,
                    minWidth: 220,
                    textAlign: 'center'
                  }}>
                    <div style={{ marginBottom: 16 }}>Deseja realmente excluir?</div>
                    <button
                      style={{
                        background: '#ff4d4f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '6px 16px',
                        marginRight: 8,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleExcluir(a.id)}
                    >
                      Sim
                    </button>
                    <button
                      style={{
                        background: '#eee',
                        color: '#222',
                        border: 'none',
                        borderRadius: 4,
                        padding: '6px 16px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setConfirmarExclusao(null)}
                    >
                      Não
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {/* Total de gastos e médias */}
      {assinaturas.length > 0 && (() => {
        let totalAnual = 0;
        assinaturas.forEach(a => {
          const servico = servicos.find(s => s.id === a.servico_id);
          if (!servico || !servico.preco) return;
          if (a.data_inicio && a.data_fim) {
            const di = new Date(a.data_inicio);
            const df = new Date(a.data_fim);
            const diff = (df - di) / (1000 * 60 * 60 * 24); // dias
            if (diff >= 365 - 10) {
              // Plano anual
              totalAnual += Number(servico.preco);
            } else {
              // Plano mensal
              totalAnual += Number(servico.preco) * 12;
            }
          } else {
            // Se não tem datas, considera mensal
            totalAnual += Number(servico.preco) * 12;
          }
        });
        const mediaMensal = (totalAnual / 12).toFixed(2);
        const mediaAnual = totalAnual.toFixed(2);
        return (
          <div style={{ marginTop: 32, background: 'var(--primary)', color: '#fff', padding: 16, borderRadius: 8, fontWeight: 'bold', fontSize: 18, textAlign: 'right' }}>
            Média de gastos mensais (considerando 12 meses): R$ {mediaMensal}<br />
            Média de gastos anuais: R$ {mediaAnual}
          </div>
        );
      })()}
    </div>
  );
}

export default Principal;
