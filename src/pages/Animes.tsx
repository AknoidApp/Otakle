import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
import '../App.css'
import { ANIME_GROUPS, TOTAL_ANIMES, TOTAL_CHARACTERS } from '../lib/siteData'

export default function Animes() {
  return (
    <div className="otakle-page">
      <header className="page-header">
        <div className="page-title">
          <h1>Animes incluidos en Otakle</h1>
          <p>
            Esta página resume las series y franquicias que actualmente forman parte del catálogo del juego. El listado
            sirve como referencia pública para ver el rango del contenido cubierto por Otakle.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/personajes" className="btn-secondary">
            Ver personajes
          </Link>
          <Link to="/play" className="btn-primary">
            Jugar el reto diario
          </Link>
        </div>
      </header>

      <div className="page-grid">
        <article className="page-card">
          <h2>Resumen del catálogo</h2>
          <ul>
            <li>
              <strong>{TOTAL_CHARACTERS}</strong> personajes activos en el catálogo.
            </li>
            <li>
              <strong>{TOTAL_ANIMES}</strong> series o franquicias representadas.
            </li>
            <li>El catálogo se usa para búsquedas, sugerencias y selección del reto diario.</li>
          </ul>
        </article>

        <article className="page-card">
          <h2>Cómo leer este listado</h2>
          <p>
            Cada tarjeta muestra una serie presente en Otakle, la cantidad de personajes activos asociados y una muestra
            rápida de nombres ya disponibles dentro del juego.
          </p>
        </article>
      </div>

      <div className="directory-grid directory-grid-wide">
        {ANIME_GROUPS.map((group) => (
          <article key={group.anime} className="directory-card">
            <div className="directory-topline">
              <h2>{group.anime}</h2>
              <span className="count-pill">{group.count}</span>
            </div>

            <p>Series representadas con personajes activos en el juego diario y en el catálogo público.</p>

            <div className="chip-link-list" aria-label={`Personajes de ${group.anime}`}>
              {group.sampleNames.map((name) => (
                <span key={name} className="name-chip">
                  {name}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <SiteFooter />
    </div>
  )
}
