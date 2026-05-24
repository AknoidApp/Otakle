import { Link } from 'react-router-dom'
import '../App.css'
import {
  EASY_MODE_COUNT,
  FAQ_ITEMS,
  FEATURED_CHARACTERS,
  PRIMARY_LINKS,
  TOP_ANIME_GROUPS,
  TOTAL_ANIMES,
  TOTAL_CHARACTERS,
  getCharacterExcerpt,
} from '../lib/siteData'

export default function Home() {
  return (
    <div className="otakle-page">
      <header className="brand landing-brand">
        <div className="brand-left">
          <img className="brand-logo" src="/otakle-logo.png" alt="Otakle" />
          <div className="brand-text">
            <div className="title-row">
              <h1 className="brand-title">Otakle</h1>
              <span className="daily-badge">ANIME DAILY</span>
            </div>
            <p className="brand-subtitle">Juego diario de personajes de anime + guías + catálogo público</p>
          </div>
        </div>

        <div className="topbar-actions">
          <Link to="/play" className="btn-primary">
            Jugar ahora
          </Link>
          <Link to="/how-to-play" className="btn-secondary">
            Cómo se juega
          </Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-copy">
          <span className="home-kicker">Qué es Otakle</span>
          <h2>Un reto diario para fans del anime, con contenido útil más allá del juego</h2>
          <p>
            Otakle combina el formato de juego diario tipo Wordle con un catálogo de personajes, guías para entender
            las pistas y páginas públicas para explorar series, franquicias y reglas del reto.
          </p>
          <p>
            La idea es que el sitio sea útil tanto si vienes a jugar como si quieres revisar qué personajes están en el
            catálogo, cómo funciona el modo easy o qué series están mejor representadas.
          </p>

          <div className="landing-cta-row">
            <Link to="/play" className="btn-primary">
              Ir al reto diario
            </Link>
            <Link to="/personajes" className="btn-secondary">
              Ver catálogo de personajes
            </Link>
            <Link to="/animes" className="btn-secondary">
              Explorar animes incluidos
            </Link>
          </div>
        </div>

        <aside className="landing-stat-grid" aria-label="Resumen del sitio">
          <div className="landing-stat-card">
            <div className="mini-label">Personajes activos</div>
            <div className="landing-stat-value">{TOTAL_CHARACTERS}</div>
          </div>
          <div className="landing-stat-card">
            <div className="mini-label">Series incluidas</div>
            <div className="landing-stat-value">{TOTAL_ANIMES}</div>
          </div>
          <div className="landing-stat-card">
            <div className="mini-label">Modo easy</div>
            <div className="landing-stat-value">{EASY_MODE_COUNT}</div>
          </div>
          <div className="landing-stat-card">
            <div className="mini-label">Intentos por día</div>
            <div className="landing-stat-value">8</div>
          </div>
        </aside>
      </section>

      <section className="page-grid">
        <article className="page-card">
          <h2>Cómo funciona el juego</h2>
          <ul>
            <li>Cada día hay un personaje nuevo para todos los jugadores.</li>
            <li>Tienes 8 intentos para resolverlo usando pistas por anime, rol, año, estudio, raza y edad.</li>
            <li>El modo easy reduce el pool a personajes más reconocibles, pero mantiene la lógica del reto.</li>
          </ul>
        </article>

        <article className="page-card">
          <h2>Qué aporta el sitio además del juego</h2>
          <ul>
            <li>Guías públicas para entender las reglas y jugar mejor.</li>
            <li>Listado visible de animes y personajes actualmente presentes en el catálogo.</li>
            <li>FAQ, contacto y páginas legales para que el proyecto sea claro y verificable.</li>
          </ul>
        </article>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <div>
            <span className="home-kicker">Franquicias destacadas</span>
            <h2>Animes presentes en el catálogo actual</h2>
          </div>
          <Link to="/animes" className="btn-secondary">
            Ver todas las series
          </Link>
        </div>

        <div className="directory-grid">
          {TOP_ANIME_GROUPS.map((group) => (
            <article key={group.anime} className="directory-card">
              <div className="directory-topline">
                <h3>{group.anime}</h3>
                <span className="count-pill">{group.count} personajes</span>
              </div>
              <p>
                Algunas entradas de esta serie dentro de Otakle: <strong>{group.sampleNames.join(', ')}</strong>.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <div>
            <span className="home-kicker">Muestra del catálogo</span>
            <h2>Personajes destacados que ya forman parte de Otakle</h2>
          </div>
          <Link to="/personajes" className="btn-secondary">
            Ver catálogo completo
          </Link>
        </div>

        <div className="character-showcase-grid">
          {FEATURED_CHARACTERS.slice(0, 8).map((character) => (
            <article key={character.id} className="character-showcase-card">
              <img className="character-showcase-image" src={character.imageUrl} alt={character.name} />
              <div className="character-showcase-body">
                <h3>{character.name}</h3>
                <p className="character-showcase-anime">{character.anime}</p>
                <p>{getCharacterExcerpt(character)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <div>
            <span className="home-kicker">FAQ rápida</span>
            <h2>Preguntas frecuentes sobre Otakle</h2>
          </div>
          <Link to="/faq" className="btn-secondary">
            Ver FAQ completa
          </Link>
        </div>

        <div className="faq-grid">
          {FAQ_ITEMS.slice(0, 4).map((item) => (
            <article key={item.question} className="faq-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-card notice-card">
        <h2>Navegación rápida</h2>
        <div className="chip-link-list">
          {PRIMARY_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="home-link-pill">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <footer className="page-footer">
        <Link to="/play">Jugar</Link>
        <span>·</span>
        <Link to="/how-to-play">Cómo se juega</Link>
        <span>·</span>
        <Link to="/strategy">Estrategia</Link>
        <span>·</span>
        <Link to="/faq">FAQ</Link>
        <span>·</span>
        <Link to="/animes">Animes</Link>
        <span>·</span>
        <Link to="/personajes">Personajes</Link>
        <span>·</span>
        <Link to="/about">Sobre Otakle</Link>
        <span>·</span>
        <Link to="/contact">Contacto</Link>
      </footer>
    </div>
  )
}
