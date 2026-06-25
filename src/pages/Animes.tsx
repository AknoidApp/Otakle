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
            Aquí puedes ver qué series y franquicias ya tienen personajes dentro de Otakle. Si llegaste con la duda de
            “¿estará mi anime acá?”, esta es la forma más rápida de salir de la duda antes de entrar al reto diario.
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
            <li>El catálogo alimenta las búsquedas, las sugerencias y la selección del personaje diario.</li>
          </ul>
        </article>

        <article className="page-card">
          <h2>Cómo conviene usar esta página</h2>
          <p>
            Sirve para tres cosas muy simples: ver si una franquicia ya está dentro del juego, revisar cuántos personajes
            tiene cada serie y orientarte mejor si te quedaste pegado en una partida. No reemplaza la gracia de adivinar,
            pero sí te ayuda a entender por dónde se mueve el catálogo.
          </p>
        </article>
      </div>

      <section className="page-card notice-card">
        <h2>Franquicias que ya tienen guía</h2>
        <p>
          Algunas series ya tienen páginas propias con contexto y consejos más aterrizados. Si juegas mucho con estas
          franquicias, vale la pena partir por ahí.
        </p>
        <div className="chip-link-list">
          <Link to="/guia-naruto-otakle" className="home-link-pill">
            Guía de Naruto
          </Link>
          <Link to="/guia-one-piece-otakle" className="home-link-pill">
            Guía de One Piece
          </Link>
          <Link to="/guia-dragon-ball-otakle" className="home-link-pill">
            Guía de Dragon Ball
          </Link>
          <Link to="/animes-faciles-para-empezar-en-otakle" className="home-link-pill">
            Animes fáciles para empezar
          </Link>
        </div>
      </section>

      <div className="directory-grid directory-grid-wide">
        {ANIME_GROUPS.map((group) => (
          <article key={group.anime} className="directory-card">
            <div className="directory-topline">
              <h2>{group.anime}</h2>
              <span className="count-pill">{group.count}</span>
            </div>

            <p>
              En Otakle ya aparecen personajes como <strong>{group.sampleNames.join(', ')}</strong>. Esta muestra te deja
              ver rápido qué tan presente está cada franquicia dentro del juego.
            </p>

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

      <div className="page-grid">
        <article className="page-card">
          <h2>Qué pasa si no ves una serie que esperabas</h2>
          <p>
            No significa necesariamente que nunca vaya a entrar. El catálogo sigue creciendo y algunas franquicias todavía
            no tienen suficiente presencia como para armar buenas comparaciones dentro del tablero. Si echas de menos una
            serie o un personaje, puedes sugerirlo por la página de contacto.
          </p>
        </article>

        <article className="page-card">
          <h2>Si quieres seguir explorando</h2>
          <p>
            Después de esta página, lo más útil suele ser saltar al listado de personajes o leer la guía sobre cómo usar el
            catálogo sin arruinarte la partida. Ahí ya se vuelve más claro qué tanto conviene estudiar y qué tanto conviene
            simplemente jugar.
          </p>
          <div className="chip-link-list">
            <Link to="/personajes" className="home-link-pill">
              Ver personajes
            </Link>
            <Link to="/como-explorar-catalogo-otakle" className="home-link-pill">
              Cómo usar el catálogo
            </Link>
            <Link to="/contact" className="home-link-pill">
              Sugerir una serie
            </Link>
          </div>
        </article>
      </div>

      <SiteFooter />
    </div>
  )
}
