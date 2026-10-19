import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '@components/Layout.jsx'
import Home from '@pages/Home.jsx'
import Login from '@pages/Login.jsx'
import Actividades from '@pages/Actividades.jsx'

function App() {
  // Usuario logueado (se guarda en localStorage para no perderlo al recargar)
  const [usuario, setUsuario] = useState(() => localStorage.getItem('usuario'))

  const login = (nombre) => {
    localStorage.setItem('usuario', nombre)
    setUsuario(nombre)
  }

  const logout = () => {
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <Routes>
      <Route path="/" element={<Layout usuario={usuario} onLogout={logout} />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login onLogin={login} />} />
        <Route path="actividades" element={<Actividades logueado={Boolean(usuario)} />} />
      </Route>
    </Routes>
  )
}

export default App
