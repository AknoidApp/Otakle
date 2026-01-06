import { Link } from 'react-router-dom'
import '../App.css'

export default function Terms() {
  return (
    <div className="otakudle-container">
      <header className="topbar">
        <div className="brand">
          <div className="brand-left">
            <img className="brand-logo" src="/otakle-logo.png" alt="Otakle" />
            <div className="brand-text">
              <div className="title-row">
                <h1 className="brand-title">Terms of Service</h1>
                <span className="daily-badge">Legal</span>
              </div>
              <p className="brand-subtitle">Última actualización: 2026-01-06</p>
            </div>
          </div>

          <div className="topbar-actions">
            <Link className="howto-button" to="/">
              Volver al juego
            </Link>
          </div>
        </div>
      </header>

      <div className="legal-content">
        <p>Al usar Otakle aceptas estos términos. Si no estás de acuerdo, por favor no uses el sitio.</p>

        <h2>Uso permitido</h2>
        <ul>
          <li>Uso personal y no exclusivo.</li>
          <li>No intentes interferir con el funcionamiento del sitio (spam, abuso, ataques, etc.).</li>
          <li>No automatices intentos masivos ni hagas scraping que afecte el rendimiento del servicio.</li>
        </ul>

        <h2>Disponibilidad</h2>
        <p>Otakle se entrega “tal cual”. Podemos modificar, pausar o discontinuar el sitio en cualquier momento.</p>

        <h2>Contenido y marcas</h2>
        <p>
          Otakle es un proyecto fan. Los nombres de series/personajes pueden pertenecer a sus respectivos dueños.
          Otakle no afirma afiliación oficial con esas marcas.
        </p>

        <h2>Limitación de responsabilidad</h2>
        <p>En la medida permitida por la ley, no somos responsables por pérdidas o daños derivados del uso del sitio.</p>

        <h2>Contacto</h2>
        <p>
          Consultas: <a href="mailto:oscarfernandezcepeda@gmail.com">oscarfernandezcepeda@gmail.com</a> | X:{' '}
          <a href="https://twitter.com/aknoid" target="_blank" rel="noreferrer noopener">
            @aknoid
          </a>
        </p>
      </div>

      <footer className="footer">
        <div className="footer-links">
          <Link to="/" className="footer-link">Inicio</Link>
          <Link to="/privacy" className="footer-link">Privacy</Link>
          <Link to="/terms" className="footer-link">Terms</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
          <a className="footer-link" href="https://twitter.com/aknoid" target="_blank" rel="noreferrer noopener">X @aknoid</a>
          <a className="footer-link" href="mailto:oscarfernandezcepeda@gmail.com">oscarfernandezcepeda@gmail.com</a>
        </div>
        <div className="footer-note">
          Otakle by <strong>Aknoid</strong>
        </div>
      </footer>
    </div>
  )
}
