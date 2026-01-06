import { Link } from 'react-router-dom'
import '../App.css'

export default function Contact() {
  return (
    <div className="otakudle-container">
      <header className="topbar">
        <div className="brand">
          <div className="brand-left">
            <img className="brand-logo" src="/otakle-logo.png" alt="Otakle" />
            <div className="brand-text">
              <div className="title-row">
                <h1 className="brand-title">Contact</h1>
                <span className="daily-badge">Info</span>
              </div>
              <p className="brand-subtitle">Escríbeme por cualquiera de estos canales</p>
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
        <h2>Email</h2>
        <p>
          <a href="mailto:oscarfernandezcepeda@gmail.com">oscarfernandezcepeda@gmail.com</a>
        </p>

        <h2>X (Twitter)</h2>
        <p>
          <a href="https://twitter.com/aknoid" target="_blank" rel="noreferrer noopener">
            @aknoid
          </a>
        </p>

        <h2>Qué incluir en tu mensaje</h2>
        <ul>
          <li>Dispositivo / navegador (por ejemplo: iPhone + Safari, Android + Chrome)</li>
          <li>Qué estabas haciendo y qué esperabas que pasara</li>
          <li>Captura de pantalla si aplica</li>
        </ul>
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
