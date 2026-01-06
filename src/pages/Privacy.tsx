import { Link } from 'react-router-dom'
import '../App.css'

export default function Privacy() {
  return (
    <div className="otakudle-container">
      <header className="topbar">
        <div className="brand">
          <div className="brand-left">
            <img className="brand-logo" src="/otakle-logo.png" alt="Otakle" />
            <div className="brand-text">
              <div className="title-row">
                <h1 className="brand-title">Privacy Policy</h1>
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
        <p>Otakle es un juego diario. Esta política explica qué información se guarda y cómo se usa.</p>

        <h2>Datos que guardamos</h2>
        <ul>
          <li>
            <strong>Progreso del juego (local):</strong> guardamos en tu navegador (LocalStorage) tus intentos del día,
            si terminaste la partida y tus estadísticas (racha actual y mejor racha).
          </li>
          <li>
            <strong>Información que tú ingresas:</strong> el nombre del personaje que escribes se usa solo para validar tu
            intento dentro del juego.
          </li>
        </ul>

        <h2>Publicidad (Google AdSense)</h2>
        <p>
          Si Otakle muestra anuncios, proveedores como Google pueden usar cookies o identificadores para mostrar anuncios
          y medir su rendimiento. El uso de esos datos depende de las configuraciones del navegador, tu cuenta de Google y
          las opciones de consentimiento aplicables en tu región.
        </p>

        <h2>Cookies</h2>
        <p>
          Otakle por sí mismo no requiere cookies para funcionar, pero la publicidad y servicios de terceros podrían usar
          cookies/almacenamiento similar.
        </p>

        <h2>Enlaces a terceros</h2>
        <p>Este sitio puede incluir enlaces a sitios externos (por ejemplo, X/Twitter). No controlamos sus políticas.</p>

        <h2>Cambios</h2>
        <p>
          Podemos actualizar esta política para reflejar cambios del juego o de servicios externos. Publicaremos la fecha
          de “Última actualización” arriba.
        </p>

        <h2>Contacto</h2>
        <p>
          Si tienes preguntas, escríbenos a{' '}
          <a href="mailto:oscarfernandezcepeda@gmail.com">oscarfernandezcepeda@gmail.com</a> o por X:{' '}
          <a href="https://twitter.com/aknoid" target="_blank" rel="noreferrer noopener">
            @aknoid
          </a>
          .
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
