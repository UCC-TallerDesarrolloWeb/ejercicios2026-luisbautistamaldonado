import '@styles/Card.scss'

// Tarjeta reutilizable: recibe título, subtítulo, imagen (opcional)
// y lo que se ponga adentro llega como children
const Card = ({ titulo, subtitulo, imagen, children }) => {
  return (
    <article className="card">
      {imagen && <img className="card__imagen" src={imagen} alt={titulo} />}
      <div className="card__cuerpo">
        <h3 className="card__titulo">{titulo}</h3>
        {subtitulo && <p className="card__subtitulo">{subtitulo}</p>}
        {children}
      </div>
    </article>
  )
}

export default Card
