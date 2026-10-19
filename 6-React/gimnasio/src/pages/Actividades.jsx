import { useState } from 'react'
import Card from '@components/Card.jsx'
import { activities, diasSemana } from '@data/actividades.js'
import '@styles/Actividades.scss'

const Actividades = ({ logueado }) => {
  // Nombres de las actividades en las que el usuario se inscribió
  const [inscripciones, setInscripciones] = useState([])

  const inscribirse = (nombre) => {
    setInscripciones([...inscripciones, nombre])
  }

  return (
    <section className="actividades">
      <h2>Actividades</h2>
      {!logueado && <p className="actividades__aviso">Iniciá sesión para poder inscribirte.</p>}

      <div className="actividades__lista">
        {activities.map((actividad) => (
          <Card key={actividad.nombre} titulo={actividad.nombre} subtitulo={actividad.descripcion}>
            <ul className="actividades__horarios">
              {actividad.horarios.map((horario) => (
                <li key={horario.dia}>
                  <strong>{diasSemana[horario.dia]}</strong>: {horario['hora-inicio']} a {horario['hora-fin']}
                </li>
              ))}
            </ul>

            {logueado && (
              <button
                type="button"
                className="actividades__boton"
                onClick={() => inscribirse(actividad.nombre)}
                disabled={inscripciones.includes(actividad.nombre)}
              >
                {inscripciones.includes(actividad.nombre) ? 'Inscripto ✓' : 'Inscribirme'}
              </button>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}

export default Actividades
