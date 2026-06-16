import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGastos } from '../context/GastosContext'
import { buscarUsuarios } from '../services/api'

const CATEGORIAS = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Lazer', 'Outros']

const COR_CAT = {
  Alimentação: '#e8f8f2',
  Moradia: '#e6f1fb',
  Transporte: '#faeeda',
  Saúde: '#fbeaf0',
  Lazer: '#f0eafb',
  Outros: '#f1efe8',
}

export default function Inicio() {
  const { gastos, total } = useGastos()
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState([])
  const [loadingApi, setLoadingApi] = useState(true)
  const [erroApi, setErroApi] = useState(false)

  useEffect(() => {
    buscarUsuarios()
      .then(setUsuarios)
      .catch(() => setErroApi(true))
      .finally(() => setLoadingApi(false))
  }, [])

  // Totais por categoria
  const porCategoria = CATEGORIAS.map(cat => ({
    cat,
    valor: gastos.filter(g => g.categoria === cat).reduce((s, g) => s + parseFloat(g.valor), 0),
  })).filter(c => c.valor > 0)

  const maiorGasto = gastos.length > 0
    ? gastos.reduce((a, b) => parseFloat(a.valor) > parseFloat(b.valor) ? a : b)
    : null

  return (
    <div>
      <div className="hero">
        <h1>Controle seus<br />gastos pessoais.</h1>
        <p>Cadastre despesas, acompanhe por categoria e visualize o total mensal.</p>
        <button className="btn btn-branco" onClick={() => navigate('/cadastro')}>
          + Adicionar gasto
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total de gastos</div>
          <div className="stat-valor">{gastos.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Categorias ativas</div>
          <div className="stat-valor">{porCategoria.length}</div>
        </div>
        <div className="stat-card destaque">
          <div className="stat-label">Total gasto</div>
          <div className="stat-valor">R$ {total.toFixed(2).replace('.', ',')}</div>
        </div>
      </div>

      {porCategoria.length > 0 && (
        <div className="secao">
          <p className="secao-titulo">Por categoria</p>
          <div className="cat-grid">
            {porCategoria.map(({ cat, valor }) => (
              <div key={cat} className="cat-card" style={{ background: COR_CAT[cat] }}>
                <div className="cat-nome">{cat}</div>
                <div className="cat-valor">R$ {valor.toFixed(2).replace('.', ',')}</div>
                <div className="cat-barra-wrap">
                  <div
                    className="cat-barra"
                    style={{ width: `${Math.min((valor / total) * 100, 100)}%` }}
                  />
                </div>
                <div className="cat-pct">{((valor / total) * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {maiorGasto && (
        <div className="secao">
          <p className="secao-titulo">Maior gasto</p>
          <div className="destaque-card">
            <div>
              <div className="gasto-desc">{maiorGasto.descricao}</div>
              <div className="gasto-meta">{maiorGasto.categoria} · {maiorGasto.data}</div>
            </div>
            <div className="gasto-valor-grande">
              R$ {parseFloat(maiorGasto.valor).toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>
      )}

      {/* Dados da API REST */}
      <div className="secao">
        <p className="secao-titulo">Usuários da API <span className="api-badge">reqres.in</span></p>
        {loadingApi && <p className="loading-txt">Carregando dados da API...</p>}
        {erroApi && <p className="erro-txt">Não foi possível conectar à API.</p>}
        {!loadingApi && !erroApi && (
          <div className="usuarios-grid">
            {usuarios.map(u => (
              <div key={u.id} className="usuario-card">
                <img src={u.avatar} alt={u.first_name} className="avatar" />
                <div>
                  <div className="usuario-nome">{u.first_name} {u.last_name}</div>
                  <div className="usuario-email">{u.email}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
