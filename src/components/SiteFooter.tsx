import { Link } from 'react-router-dom'
import { EDITORIAL_PAGES } from '../lib/editorialData'
import { SITE_EMAIL, SITE_X_LABEL, SITE_X_URL } from '../lib/siteData'

type FooterSection = {
  title: string
  links: Array<{ to: string; label: string }>
}

const footerSections: FooterSection[] = [
  {
    title: 'Juego',
    links: [
      { to: '/play', label: 'Jugar ahora' },
      { to: '/how-to-play', label: 'Cómo se juega' },
      { to: '/strategy', label: 'Estrategia' },
      { to: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Catálogo',
    links: [
      { to: '/animes', label: 'Animes' },
      { to: '/personajes', label: 'Personajes' },
      { to: '/stats', label: 'Estadísticas' },
      { to: '/archive', label: 'Historial' },
    ],
  },
  {
    title: 'Contenido',
    links: EDITORIAL_PAGES.map((page) => ({ to: page.path, label: page.title })),
  },
  {
    title: 'Proyecto',
    links: [
      { to: '/', label: 'Inicio' },
      { to: '/about', label: 'Sobre Otakle' },
      { to: '/contact', label: 'Contacto' },
      { to: '/privacy', label: 'Privacidad' },
      { to: '/terms', label: 'Términos' },
    ],
  },
]

export default function SiteFooter() {
  return (
    <footer className="footer site-footer">
      <div className="site-footer-topline">
        <div>
          <p className="site-footer-kicker">Otakle · juego diario + guías + catálogo público</p>
          <h2 className="site-footer-title">Una base pública de contenido para fans del anime</h2>
          <p className="site-footer-copy">
            Además del reto diario, Otakle reúne páginas de ayuda, explicaciones de mecánicas, resúmenes de franquicias y
            recursos útiles para entender mejor cómo jugar.
          </p>
        </div>
        <div className="site-footer-contact">
          <a className="footer-link" href={SITE_X_URL} target="_blank" rel="noreferrer noopener">
            X {SITE_X_LABEL}
          </a>
          <a className="footer-link" href={`mailto:${SITE_EMAIL}`}>
            {SITE_EMAIL}
          </a>
        </div>
      </div>

      <div className="site-footer-grid">
        {footerSections.map((section) => (
          <section key={section.title} className="site-footer-section" aria-label={section.title}>
            <h3>{section.title}</h3>
            <div className="site-footer-links">
              {section.links.map((link) => (
                <Link key={link.to} to={link.to} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="footer-note">
        Otakle by <strong>Aknoid</strong> · Proyecto fan con contenido público, catálogo visible y guías en español.
      </div>
    </footer>
  )
}
