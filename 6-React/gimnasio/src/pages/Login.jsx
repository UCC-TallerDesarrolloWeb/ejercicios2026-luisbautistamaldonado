import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '@styles/Login.scss'

const Login = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (usuario === 'admin' && password === 'admin') {
      console.log('Login OK')
      onLogin(usuario)
      navigate('/actividades')
    } else {
      console.log('Login Incorrecto')
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
        {error && <p className="login__error">{error}</p>}
      </form>
    </div>
  )
}

export default Login
