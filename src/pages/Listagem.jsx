import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGastos } from '../context/GastosContext'

const CATEGORIAS = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Lazer', 'Outros']

const COR_CAT = {
  Alimentação: { bg: '#e8f8f2', color: '#0d6e4a' },
  Moradia:     { bg: '#e6f1fb', color: '#185fa5' },
  Transporte:  { bg: '#faeeda', color: '#854f0b' },
  Saúde:       { bg: '#fbeaf0', color: '#993556' },
  Lazer:       { bg: '#f0eafb', color: '#6b3599' },
  Outros:      { bg: '#f1efe8', color: '#5f5e5a' },
}

export default function Listagem() {
  const { gastos, removerGasto, total } = useGastos()
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [ordenar, setOrdenar] = useState('data')

  const filtrados = gastos
    .filter(g => {
      const buscaOk = g.descricao.toLowerCase().includes(busca.toLowerCase())
      const catOk = !filtroCategoria || g.categoria === filtroCategoria
      return buscaOk && catOk
    })
    .sort((a, b) => {
      if (ordenar === 'valor') return parseFloat(b.valor) - parseFloat(a.valor)
      if (ordenar === 'data') return new Date(b.data) - new Date(a.data)
      return a.descricao.localeCompare(b.descricao)
    })

  const totalFiltrado = filtrados.reduce((s, g) => s + parseFloat(g.valor), 0)

  function confirmarRemover(id) {
    if (window.confirm('Remover este gasto?')) removerGasto(id)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <p className="secao-titulo" style={{ marginBottom: 0 }}>Meus gastos</p>
        <button className="btn btn-primario" onClick={() => navigate('/cadastro')}>
          + Novo
        </button>
      </div>

      {/* Filtros */}
      <div className="filtros-grid">
        <input
          type="text"
          placeholder="Buscar descrição..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
          <option value="">Todas categorias</option>
          {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={ordenar} onChange={e => setOrdenar(e.target.value)}>
          <option value="data">Ordenar por data</option>
          <option value="valor">Ordenar por valor</option>
          <option value="nome">Ordenar por nome</option>
        </select>
      </div>

      {/* Contador */}
      {(busca || filtroCategoria) && (
        <p className="contador-txt">
          {filtrados.length} de {gastos.length} resultado{filtrados.length !== 1 ? 's' : ''} ·
          Subtotal: <strong>R$ {totalFiltrado.toFixed(2).replace('.', ',')}</strong>
        </p>
      )}

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="vazio">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
          <p>{gastos.length === 0 ? 'Nenhum gasto cadastrado ainda.' : 'Nenhum resultado para este filtro.'}</p>
          {gastos.length === 0 && (
            <button className="btn btn-primario" style={{ marginTop: '12px' }} onClick={() => navigate('/cadastro')}>
              Cadastrar primeiro gasto
            </button>
          )}
        </div>
      ) : (
        <div className="lista-itens">
          {filtrados.map(g => {
            const cor = COR_CAT[g.categoria] || COR_CAT.Outros
            return (
              <div key={g.id} className="item-card">
                <div className="item-info">
                  <div className="item-nome">
                    {g.descricao}
                    <span
                      className="badge-cat"
                      style={{ background: cor.bg, color: cor.color }}
                    >
                      {g.categoria}
                    </span>
                  </div>
                  <div className="item-meta">{g.data}</div>
                </div>
                <div className="item-preco">
                  R$ {parseFloat(g.valor).toFixed(2).replace('.', ',')}
                </div>
                <button
                  className="btn-perigo"
                  onClick={() => confirmarRemover(g.id)}
                  title="Remover"
                >✕</button>
              </div>
            )
          })}
        </div>
      )}

      {/* Barra de total */}
      {gastos.length > 0 && (
        <div className="total-barra">
          <div className="total-inner">
            <div>
              <div className="total-label">Total geral</div>
              <div style={{ fontSize: '12px', color: 'var(--texto-suave)' }}>
                {gastos.length} gasto{gastos.length !== 1 ? 's' : ''} cadastrado{gastos.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="total-valor">R$ {total.toFixed(2).replace('.', ',')}</div>
          </div>
        </div>
      )}
    </div>
  )
}
