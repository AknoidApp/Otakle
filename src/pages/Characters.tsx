import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
import '../App.css'
import { ANIME_GROUPS, TOTAL_CHARACTERS } from '../lib/siteData'

export default function Characters() {
  return (
    <div className="otakle-page">
      <header className="page-header">
        <div className="page-title">
          <h1>Catálogo público de personajes</h1>
          <p>
            Este listado reúne los personajes que hoy forman parte de Otakle. Puedes usarlo para ubicar nombres, revisar
            qué series tienen más presencia y entender mejor el tipo de universo con el que juega el reto diario.
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

      <div className="page-grid">
        <article className="page-card">
          <h2>Resumen</h2>
          <p>
            Actualmente hay <strong>{TOTAL_CHARACTERS}</strong> personajes activos en Otakle. El listado alimenta el
            autocompletado, los filtros y la selección diaria del juego, pero también te sirve como referencia si quieres
            mirar qué nombres ya están dentro antes de jugar.
          </p>
        </article>

        <article className="page-card">
          <h2>Cómo te puede servir de verdad</h2>
          <p>
            Esta página ayuda bastante cuando recuerdas la franquicia pero no el personaje exacto, o cuando quieres hacerte
            una idea de qué tan cargada está una serie dentro del catálogo. También sirve para cachar rápido si estás
            pensando en un nombre que todavía no forma parte del juego.
          </p>
        </article>
      </div>

      <div className="directory-grid directory-grid-wide">
        {ANIME_GROUPS.map((group) => (
          <article key={group.anime} className="directory-card">
            <div className="directory-topline">
              <h2>{group.anime}</h2>
              <span className="count-pill">{group.count} personajes</span>
            </div>

            <p>
              Este grupo reúne los personajes de <strong>{group.anime}</strong> que ya están presentes en Otakle.
            </p>

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

      <div className="page-grid">
        <article className="page-card">
          <h2>Si no ves el personaje que buscabas</h2>
          <p>
            Puede pasar por dos razones: o todavía no entró al catálogo, o la franquicia sigue creciendo de a poco. Si te
            importa mucho una serie, lo mejor es mandar la sugerencia con algo de contexto. Eso ayuda más que tirar solo un
            nombre suelto.
          </p>
        </article>

        <article className="page-card">
          <h2>Qué mirar después de esta página</h2>
          <p>
            Si quieres entender mejor por qué algunas franquicias tienen más peso que otras, conviene seguir con la página
            de animes o con la guía sobre cómo se seleccionan personajes para el catálogo. Ahí ya aparece más criterio
            editorial y menos simple inventario.
          </p>
          <div className="chip-link-list">
            <Link to="/animes" className="home-link-pill">
              Ver animes
            </Link>
            <Link to="/como-seleccionamos-personajes-otakle" className="home-link-pill">
              Cómo se seleccionan personajes
            </Link>
            <Link to="/contact" className="home-link-pill">
              Sugerir personaje
            </Link>
          </div>
        </article>
      </div>

      <SiteFooter />
    </div>
  )
}
