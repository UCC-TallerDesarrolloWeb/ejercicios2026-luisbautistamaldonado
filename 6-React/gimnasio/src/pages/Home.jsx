import Card from '@components/Card.jsx'
import { actividadesHome } from '@data/actividades.js'
import '@styles/Home.scss'

const Home = () => {
  return (
    <section className="home">
      <h2>Nuestras actividades</h2>
      <div className="home__cards">
        {actividadesHome.map((actividad) => (
          <Card key={actividad.titulo} titulo={actividad.titulo} imagen={actividad.imagen} />
        ))}
      </div>
    </section>
  )
}

export default Home
