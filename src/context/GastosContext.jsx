import { createContext, useContext, useState } from 'react'

const GastosContext = createContext()

export function GastosProvider({ children }) {
  const [gastos, setGastos] = useState([
    { id: 1, descricao: 'Supermercado', valor: 320.5, categoria: 'Alimentação', data: '2025-06-01' },
    { id: 2, descricao: 'Conta de luz', valor: 185.0, categoria: 'Moradia', data: '2025-06-03' },
    { id: 3, descricao: 'Uber', valor: 42.9, categoria: 'Transporte', data: '2025-06-05' },
  ])

  function adicionarGasto(gasto) {
    const novoId = gastos.length > 0 ? Math.max(...gastos.map(g => g.id)) + 1 : 1
    setGastos(prev => [...prev, { id: novoId, ...gasto }])
  }

  function removerGasto(id) {
    setGastos(prev => prev.filter(g => g.id !== id))
  }

  const total = gastos.reduce((s, g) => s + parseFloat(g.valor), 0)

  return (
    <GastosContext.Provider value={{ gastos, adicionarGasto, removerGasto, total }}>
      {children}
    </GastosContext.Provider>
  )
}

export function useGastos() {
  return useContext(GastosContext)
}
