import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
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
import { EDITORIAL_PAGES } from '../lib/editorialData'
import '../App.css'

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
          <h2>Un reto diario para fans del anime, con una capa pública real de contenido útil</h2>
          <p>
            Otakle combina la lógica de un juego diario tipo Wordle con una base pública de guías, preguntas frecuentes,
            catálogo de personajes, resúmenes por franquicia y páginas pensadas para que el sitio tenga valor incluso
            fuera de la partida del día.
          </p>
          <p>
            La idea es que puedas entrar a jugar, pero también volver para entender mejor las pistas, revisar qué animes
            están representados, descubrir personajes del catálogo actual y leer recursos hechos para mejorar tu lectura
            del reto.
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
          <h2>Qué puedes hacer en Otakle</h2>
          <ul>
            <li>Jugar un personaje nuevo cada día con 8 intentos máximos.</li>
            <li>Aprender a leer pistas por anime, rol, año de debut, estudio, raza y edad.</li>
            <li>Consultar contenido público para mejorar tu tasa de acierto sin depender de búsquedas externas.</li>
          </ul>
        </article>

        <article className="page-card">
          <h2>Por qué esta web no es solo una landing</h2>
          <ul>
            <li>Incluye guías completas sobre mecánicas y estrategia.</li>
            <li>Tiene catálogo visible de personajes y series presentes en el juego.</li>
            <li>Reúne recursos por franquicia, preguntas frecuentes y páginas legales claras.</li>
          </ul>
        </article>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <div>
            <span className="home-kicker">Guías destacadas</span>
            <h2>Recursos públicos para entender mejor el juego y sus franquicias</h2>
          </div>
        </div>

        <div className="directory-grid directory-grid-wide">
          {EDITORIAL_PAGES.map((page) => (
            <article key={page.path} className="directory-card editorial-link-card">
              <span className="mini-label">{page.kicker}</span>
              <h3>{page.title}</h3>
              <p>{page.description}</p>
              <Link to={page.path} className="btn-secondary">
                Leer guía
              </Link>
            </article>
          ))}
        </div>
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

      <section className="page-grid">
        <article className="page-card notice-card">
          <h2>Señales de confianza del proyecto</h2>
          <ul>
            <li>Rutas públicas indexables con metadatos, sitemap y contenido informativo.</li>
            <li>Páginas visibles de contacto, privacidad, términos y descripción del proyecto.</li>
            <li>Catálogo público navegable con {TOTAL_CHARACTERS} personajes activos, series visibles y material editorial relacionado.</li>
          </ul>
        </article>

        <article className="page-card">
          <h2>Explora Otakle sin jugar todavía</h2>
          <p>
            Si llegaste por curiosidad o por una revisión de AdSense, la idea es que el sitio se entienda incluso fuera del
            gameplay. Puedes recorrer primero las guías, revisar la FAQ, mirar las series activas y después entrar al reto
            diario con más contexto.
          </p>
          <div className="chip-link-list">
            <Link to="/about" className="home-link-pill">
              Sobre Otakle
            </Link>
            <Link to="/faq" className="home-link-pill">
              FAQ
            </Link>
            <Link to="/contact" className="home-link-pill">
              Contacto
            </Link>
            <Link to="/privacy" className="home-link-pill">
              Privacidad
            </Link>
          </div>
        </article>
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

      <SiteFooter />
    </div>
  )
}
