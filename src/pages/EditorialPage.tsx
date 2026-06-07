import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
import type { EditorialPage as EditorialPageData } from '../lib/editorialData'
import '../App.css'

export default function EditorialPage({ page }: { page: EditorialPageData }) {
  return (
    <div className="otakle-page">
      <header className="page-header">
        <div className="page-title">
          <span className="home-kicker">{page.kicker}</span>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>

        <div className="page-actions">
          <Link to="/play" className="btn-primary">
            Ir a jugar
          </Link>
          <Link to="/faq" className="btn-secondary">
            Ver FAQ
          </Link>
        </div>
      </header>

      <section className="page-card editorial-intro-card">
        {page.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="directory-grid directory-grid-wide editorial-grid">
        {page.sections.map((section) => (
          <article key={section.heading} className="page-card editorial-section-card">
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>

      <section className="page-card notice-card">
        <h2>Más recursos públicos de Otakle</h2>
        <div className="chip-link-list">
          <Link to="/how-to-play" className="home-link-pill">
            Cómo se juega
          </Link>
          <Link to="/strategy" className="home-link-pill">
            Estrategia
          </Link>
          <Link to="/animes" className="home-link-pill">
            Animes incluidos
          </Link>
          <Link to="/personajes" className="home-link-pill">
            Catálogo de personajes
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
