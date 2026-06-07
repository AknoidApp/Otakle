import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
import '../App.css'
import { FAQ_ITEMS } from '../lib/siteData'

export default function Faq() {
  return (
    <div className="otakle-page">
      <header className="page-header">
        <div className="page-title">
          <h1>Preguntas frecuentes</h1>
          <p>Respuestas rápidas sobre reglas, pistas, reinicios, modo easy y funcionamiento general de Otakle.</p>
        </div>

        <div className="page-actions">
          <Link to="/play" className="btn-secondary">
            Ir a jugar
          </Link>
        </div>
      </header>

      <div className="faq-grid faq-grid-full">
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} className="faq-card">
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>

      <div className="page-card">
        <h2>¿Todavía tienes dudas?</h2>
        <p>
          Si tu pregunta no aparece aquí, puedes revisar la guía completa de <Link to="/how-to-play">cómo se juega</Link>,
          la página de <Link to="/strategy">estrategia</Link> o escribir por la sección de <Link to="/contact">contacto</Link>.
        </p>
      </div>

      <SiteFooter />
    </div>
  )
}
