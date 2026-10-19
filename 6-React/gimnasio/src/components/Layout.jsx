import { Outlet } from 'react-router-dom'
import Header from '@components/Header.jsx'
import Footer from '@components/Footer.jsx'
import '@styles/Layout.scss'

const Layout = ({ usuario, onLogout }) => {
  return (
    <div className="layout">
      <Header usuario={usuario} onLogout={onLogout} />
      <main className="contenido">
        {/* Acá se muestra la página según la ruta: Home, Login o Actividades */}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
