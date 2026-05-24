import { Link } from 'react-router-dom'
import '../App.css'
import { ANIME_GROUPS, TOTAL_CHARACTERS } from '../lib/siteData'

export default function Characters() {
  return (
    <div className="otakle-page">
      <header className="page-header">
        <div className="page-title">
          <h1>Catálogo público de personajes</h1>
          <p>
            Este catálogo muestra los personajes de anime que actualmente forman parte de Otakle. Está pensado como una
            referencia pública y útil para conocer el alcance del juego, revisar nombres disponibles y explorar series.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/animes" className="btn-secondary">
            Ver series
          </Link>
          <Link to="/play" className="btn-primary">
            Jugar ahora
          </Link>
        </div>
      </header>

      <div className="page-card">
        <h2>Resumen</h2>
        <p>
          Actualmente hay <strong>{TOTAL_CHARACTERS}</strong> personajes activos en el catálogo público de Otakle.
          El listado se usa para sugerencias, filtros y selección del reto diario.
        </p>
      </div>

      <div className="directory-grid directory-grid-wide">
        {ANIME_GROUPS.map((group) => (
          <article key={group.anime} className="directory-card">
            <div className="directory-topline">
              <h2>{group.anime}</h2>
              <span className="count-pill">{group.count} personajes</span>
            </div>

            <div className="chip-link-list" aria-label={`Listado de personajes de ${group.anime}`}>
              {group.characters.map((character) => (
                <span key={character.id} className="name-chip">
                  {character.name}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <footer className="page-footer">
        <Link to="/">Inicio</Link>
        <span>·</span>
        <Link to="/play">Jugar</Link>
        <span>·</span>
        <Link to="/animes">Animes</Link>
        <span>·</span>
        <Link to="/faq">FAQ</Link>
        <span>·</span>
        <Link to="/contact">Contacto</Link>
      </footer>
    </div>
  )
}
