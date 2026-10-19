import { NavLink, useNavigate } from 'react-router-dom'

const Header = ({ usuario, onLogout }) => {
  const navigate = useNavigate()

  const cerrarSesion = () => {
    onLogout()
    navigate('/')
  }

  return (
    <header className="header">
      <h1 className="header__logo">Gym UCC</h1>
      <nav className="header__nav">
        <NavLink to="/" end>Home</NavLink>
        {!usuario && <NavLink to="/login">Login</NavLink>}
        <NavLink to="/actividades">Actividades</NavLink>
        {usuario && (
          <>
            <span className="header__usuario">Hola, {usuario}</span>
            <button type="button" className="header__logout" onClick={cerrarSesion}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
