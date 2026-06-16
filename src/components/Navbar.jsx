import { NavLink } from 'react-router-dom'
import { useGastos } from '../context/GastosContext'

export default function Navbar() {
  const { total } = useGastos()

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <span className="nav-logo">gastos<span>.</span>app</span>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link ativo' : 'nav-link'}>
            Início
          </NavLink>
          <NavLink to="/cadastro" className={({ isActive }) => isActive ? 'nav-link ativo' : 'nav-link'}>
            Cadastro
          </NavLink>
          <NavLink to="/listagem" className={({ isActive }) => isActive ? 'nav-link ativo' : 'nav-link'}>
            Listagem
          </NavLink>
        </div>
        <div className="nav-total">
          Total: <strong>R$ {total.toFixed(2).replace('.', ',')}</strong>
        </div>
      </div>
    </nav>
  )
}
