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
  const featuredGuides = EDITORIAL_PAGES.slice(0, 8)

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
          <h2>Un reto diario de anime con reglas claras, catálogo visible y guías públicas para jugar mejor</h2>
          <p>
            Otakle es un juego diario donde intentas descubrir el personaje del día usando pistas comparativas como anime,
            rol narrativo, demografía, año de debut, estudio, género, raza y otros atributos. La gracia está en deducir,
            no en disparar nombres al azar.
          </p>
          <p>
            Además del reto, el sitio incluye páginas públicas para entender cómo funciona el juego, qué franquicias están
            representadas, qué personajes forman parte del catálogo actual y qué estrategias suelen dar mejores resultados.
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
            <li>Revisar guías públicas para mejorar tus decisiones sin depender de búsquedas externas.</li>
            <li>Explorar un catálogo visible de series y personajes ya presentes en el proyecto.</li>
          </ul>
        </article>

        <article className="page-card">
          <h2>Si es tu primera visita, empieza por aquí</h2>
          <p>
            La forma más simple de entender Otakle es esta: primero mira <Link to="/how-to-play">cómo se juega</Link>,
            después revisa la <Link to="/strategy">estrategia</Link> básica y luego entra al reto diario. Si prefieres
            curiosear antes de jugar, puedes recorrer la página de <Link to="/animes">animes</Link> o el{' '}
            <Link to="/personajes">catálogo de personajes</Link>.
          </p>
          <div className="chip-link-list">
            <Link to="/how-to-play" className="home-link-pill">
              Reglas
            </Link>
            <Link to="/strategy" className="home-link-pill">
              Estrategia
            </Link>
            <Link to="/faq" className="home-link-pill">
              FAQ
            </Link>
            <Link to="/about" className="home-link-pill">
              Sobre el proyecto
            </Link>
          </div>
        </article>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <div>
            <span className="home-kicker">Guías destacadas</span>
            <h2>Recursos públicos para entender mejor el juego, el catálogo y las franquicias</h2>
          </div>
        </div>

        <div className="directory-grid directory-grid-wide">
          {featuredGuides.map((page) => (
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
          <h2>Qué encontrarás fuera del tablero</h2>
          <ul>
            <li>Rutas públicas indexables con contenido informativo y navegación clara.</li>
            <li>Páginas visibles de contacto, privacidad, términos y descripción del proyecto.</li>
            <li>Guías prácticas sobre aperturas, errores comunes y lectura del catálogo.</li>
            <li>
              Un catálogo público navegable con {TOTAL_CHARACTERS} personajes activos y {TOTAL_ANIMES} franquicias
              representadas.
            </li>
          </ul>
        </article>

        <article className="page-card">
          <h2>Explora Otakle a tu ritmo</h2>
          <p>
            Puedes llegar aquí por ganas de jugar, por curiosidad sobre anime o simplemente porque quieres ver qué series y
            personajes forman parte del proyecto. La idea es que el sitio se entienda también como directorio y como guía,
            no solo como una partida diaria de un minuto.
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
            <Link to="/terms" className="home-link-pill">
              Términos
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
