import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGastos } from '../context/GastosContext'
import { enviarGasto } from '../services/api'

const CATEGORIAS = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Lazer', 'Outros']

const INICIAL = {
  descricao: '',
  valor: '',
  categoria: '',
  data: new Date().toISOString().split('T')[0],
}

export default function Cadastro() {
  const { adicionarGasto } = useGastos()
  const navigate = useNavigate()

  const [form, setForm] = useState(INICIAL)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [respostaApi, setRespostaApi] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }))
  }

  function validar() {
    const novosErros = {}
    if (!form.descricao.trim()) novosErros.descricao = 'Informe a descrição do gasto.'
    if (!form.valor || isNaN(form.valor) || parseFloat(form.valor) <= 0)
      novosErros.valor = 'Informe um valor válido maior que zero.'
    if (!form.categoria) novosErros.categoria = 'Selecione uma categoria.'
    if (!form.data) novosErros.data = 'Informe a data.'
    return novosErros
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const novosErros = validar()
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    setEnviando(true)
    try {
      const resposta = await enviarGasto(form)
      setRespostaApi(resposta)
      adicionarGasto({ ...form, valor: parseFloat(form.valor) })
      setSucesso(true)
      setForm(INICIAL)
      setTimeout(() => setSucesso(false), 4000)
    } catch {
      setErros({ api: 'Erro ao comunicar com a API. Tente novamente.' })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>
      {sucesso && (
        <div className="toast-sucesso">
          ✓ Gasto cadastrado com sucesso!
          {respostaApi && <span className="api-id"> ID na API: {respostaApi.id}</span>}
        </div>
      )}

      <div className="form-card">
        <p className="form-titulo">Novo gasto</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grupo">
            <label htmlFor="descricao">Descrição *</label>
            <input
              type="text"
              id="descricao"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Ex: Conta de luz, Mercado..."
              className={erros.descricao ? 'invalido' : ''}
              maxLength={80}
            />
            {erros.descricao && <span className="erro-msg">{erros.descricao}</span>}
          </div>

          <div className="linha-dupla">
            <div className="form-grupo">
              <label htmlFor="valor">Valor (R$) *</label>
              <input
                type="number"
                id="valor"
                name="valor"
                value={form.valor}
                onChange={handleChange}
                placeholder="0,00"
                min="0.01"
                step="0.01"
                className={erros.valor ? 'invalido' : ''}
              />
              {erros.valor && <span className="erro-msg">{erros.valor}</span>}
            </div>

            <div className="form-grupo">
              <label htmlFor="data">Data *</label>
              <input
                type="date"
                id="data"
                name="data"
                value={form.data}
                onChange={handleChange}
                className={erros.data ? 'invalido' : ''}
              />
              {erros.data && <span className="erro-msg">{erros.data}</span>}
            </div>
          </div>

          <div className="form-grupo">
            <label htmlFor="categoria">Categoria *</label>
            <select
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className={erros.categoria ? 'invalido' : ''}
            >
              <option value="">Selecione...</option>
              {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
            </select>
            {erros.categoria && <span className="erro-msg">{erros.categoria}</span>}
          </div>

          {erros.api && <div className="erro-api">{erros.api}</div>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primario btn-bloco" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Cadastrar gasto'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/listagem')}
            >
              Ver lista
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
