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
              <p className="brand-subtitle">Canales oficiales para soporte, feedback y sugerencias del proyecto</p>
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
          Si quieres reportar un bug, sugerir personajes, dar feedback sobre el juego o consultar algo sobre privacidad,
          anuncios y funcionamiento del sitio, estos son los canales oficiales de contacto de Otakle.
        </p>
        <p>
          La idea de esta página es que cualquier visitante pueda identificar con claridad quién recibe los mensajes del
          proyecto, qué tipo de consultas tienen sentido aquí y qué contexto ayuda a revisar un problema más rápido.
        </p>

        <h2>Email</h2>
        <p>
          <a href="mailto:oscarfernandezcepeda@gmail.com">oscarfernandezcepeda@gmail.com</a>
        </p>
        <p>
          El correo es el mejor canal si quieres mandar comentarios largos, adjuntar capturas o dejar una explicación más
          completa de un error, propuesta o duda de privacidad.
        </p>

        <h2>X (Twitter)</h2>
        <p>
          <a href="https://twitter.com/aknoid" target="_blank" rel="noreferrer noopener">
            @aknoid
          </a>
        </p>
        <p>
          X sirve mejor para avisos rápidos, feedback corto o sugerencias puntuales sobre personajes, series y mejoras del
          juego diario.
        </p>

        <h2>Qué puedes escribirnos</h2>
        <ul>
          <li>Sugerencias de personajes o series que te gustaría ver en Otakle.</li>
          <li>Errores visuales, pistas incoherentes o problemas con el personaje del día.</li>
          <li>Dudas sobre privacidad, publicidad, indexación o funcionamiento general del sitio.</li>
          <li>Comentarios sobre guías públicas, catálogo o utilidad de las páginas informativas.</li>
        </ul>

        <h2>Qué incluir en tu mensaje</h2>
        <ul>
          <li>Dispositivo / navegador (por ejemplo: iPhone + Safari, Android + Chrome).</li>
          <li>Qué estabas haciendo y qué esperabas que pasara.</li>
          <li>El nombre del personaje o anime si el problema está en el catálogo.</li>
          <li>Captura de pantalla si aplica.</li>
          <li>URL exacta si el problema ocurre en una página pública concreta.</li>
        </ul>

        <h2>Antes de escribir</h2>
        <p>
          Si tu duda es sobre reglas, reinicio diario o lectura de pistas, puede que ya esté respondida en{' '}
          <Link to="/faq">FAQ</Link>, <Link to="/how-to-play">cómo se juega</Link> o{' '}
          <Link to="/strategy">estrategia</Link>. Si aun así algo no cuadra, escríbenos con contexto y lo revisamos.
        </p>
      </div>

      <SiteFooter />
    </div>
  )
}
