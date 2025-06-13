import React, { useEffect, useState } from 'react';

function Principal({ onLogout }) {
  const [assinaturas, setAssinaturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [status, setStatus] = useState('ativa');
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

  // Busca assinaturas, clientes e serviços existentes
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
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/clientes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setClientes(data);
        }
      } catch {}
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
    fetchClientes();
    fetchServicos();
  }, [sucesso]);

  // Filtra os serviços conforme o cliente selecionado
  const planosFiltrados = servicos.filter(s => {
    const cliente = clientes.find(c => c.id === Number(clienteId));
    return cliente && s.nome === cliente.nome;
  });

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
      const res = await fetch('http://localhost:5000/api/assinaturas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cliente_id: clienteId,
          servico_id: servicoId,
          data_inicio: dataInicio,
          data_fim: dataFim,
          status,
          user_id
        })
      });
      if (res.ok) {
        setSucesso('Assinatura registrada!');
        setClienteId(''); setServicoId(''); setDataInicio(''); setDataFim(''); setStatus('ativa');
      } else {
        setErro('Erro ao registrar assinatura');
      }
    } catch {
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
                <button style={{ marginTop: 8, width: '100%' }} onClick={onLogout}>Sair</button>
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
      <form onSubmit={handleSubmit} style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <select value={clienteId} onChange={e => setClienteId(e.target.value)} required style={{ width: 280, marginBottom: 8, padding: 8 }}>
          <option value="">Selecione o cliente</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <select value={servicoId} onChange={e => setServicoId(e.target.value)} required style={{ width: 280, marginBottom: 8, padding: 8 }} disabled={!clienteId}>
          <option value="">Selecione o plano</option>
          {planosFiltrados.map(s => (
            <option key={s.id} value={s.id}>
              {s.descricao ? `${s.descricao} - R$ ${s.preco}` : `${s.plano || ''} - R$ ${s.preco}`}
            </option>
          ))}
        </select>
        <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} required style={{ width: 280, marginBottom: 8, padding: 8 }} placeholder="Data de início" />
        <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} required style={{ width: 280, marginBottom: 8, padding: 8 }} placeholder="Data de fim" />
        <select value={status} onChange={e => setStatus(e.target.value)} required style={{ width: 280, marginBottom: 8, padding: 8 }}>
          <option value="ativa">Ativa</option>
          <option value="inativa">Inativa</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <button type="submit" style={{ width: 280 }} disabled={loading}>{loading ? 'Registrando...' : 'Registrar Assinatura'}</button>
      </form>
      {erro && <div style={{ color: 'var(--accent)', marginBottom: 8 }}>{erro}</div>}
      {sucesso && <div style={{ color: 'var(--primary)', marginBottom: 8 }}>{sucesso}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {assinaturas.map((a, i) => {
          const servico = servicos.find(s => s.id === a.servico_id);
          const cliente = clientes.find(c => c.id === a.cliente_id);
          const formatarData = (data) => {
            if (!data) return '';
            const d = new Date(data);
            if (isNaN(d)) return data;
            return d.toLocaleDateString('pt-BR');
          };
          return (
            <li key={a.id || i} style={{ background: 'var(--primary)', margin: '12px 0', padding: 16, borderRadius: 6, position: 'relative' }}>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <strong>Cliente:</strong> {cliente ? cliente.nome : a.cliente_id} <br />
                <strong>Plano:</strong> {servico ? servico.descricao : ''} <br />
                <strong>Preço:</strong> R$ {servico ? servico.preco : ''} <br />
                <strong>Início:</strong> {formatarData(a.data_inicio)} <br />
                <strong>Fim:</strong> {formatarData(a.data_fim)} <br />
                <strong>Status:</strong> {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
              </div>
              <button
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: '#ff4d4f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '6px 12px',
                  cursor: 'pointer'
                }}
                onClick={() => setConfirmarExclusao(a.id)}
              >
                Excluir
              </button>
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
