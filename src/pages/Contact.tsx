import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
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
                <h1 className="brand-title">Contacto</h1>
                <span className="daily-badge">Info</span>
              </div>
              <p className="brand-subtitle">Escríbeme por cualquiera de estos canales</p>
            </div>
          </div>

          <div className="topbar-actions">
            <Link className="howto-button" to="/play">
              Ir a jugar
            </Link>
          </div>
        </div>
      </header>

      <div className="legal-content">
        <p>
          Si quieres reportar un bug, sugerir personajes, dar feedback sobre el juego o consultar algo sobre privacidad
          y anuncios, estos son los canales oficiales de contacto de Otakle.
        </p>

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

        <h2>Qué puedes escribirnos</h2>
        <ul>
          <li>Sugerencias de personajes o series que te gustaría ver en Otakle.</li>
          <li>Errores visuales, pistas incoherentes o problemas con el personaje del día.</li>
          <li>Dudas sobre privacidad, publicidad o funcionamiento del sitio.</li>
        </ul>

        <h2>Qué incluir en tu mensaje</h2>
        <ul>
          <li>Dispositivo / navegador (por ejemplo: iPhone + Safari, Android + Chrome).</li>
          <li>Qué estabas haciendo y qué esperabas que pasara.</li>
          <li>El nombre del personaje o anime si el problema está en el catálogo.</li>
          <li>Captura de pantalla si aplica.</li>
        </ul>
      </div>

      <SiteFooter />
    </div>
  )
}
