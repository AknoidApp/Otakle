import { Link } from 'react-router-dom'
import '../App.css'

export default function About() {
  return (
    <div className="otakudle-container">
      <header className="topbar">
        <div className="brand">
          <div className="brand-left">
            <img className="brand-logo" src="/otakle-logo.png" alt="Otakle" />
            <div className="brand-text">
              <div className="title-row">
                <h1 className="brand-title">About Otakle</h1>
                <span className="daily-badge">Guía</span>
              </div>
              <p className="brand-subtitle">Reglas, pistas y preguntas frecuentes</p>
            </div>
          </div>

          <div className="topbar-actions">
            <Link to="/" className="howto-button">
              Volver al juego
            </Link>
          </div>
        </div>
      </header>

      <div className="legal-content">
        <p>
          <strong>Otakle</strong> es un juego diario estilo “Wordle” para adivinar personajes de anime usando pistas
          comparativas. El objetivo es resolver el personaje del día en la menor cantidad de intentos posible.
        </p>

        <h2>Reglas</h2>
        <ul>
          <li>
            Tienes <strong>8 intentos</strong> máximos por día.
          </li>
          <li>
            Cada intento genera una fila con pistas que comparan tu personaje con el personaje del día.
          </li>
          <li>
            Si aciertas, el día termina y puedes compartir tu resultado.
          </li>
          <li>
            Si llegas a 8 intentos sin acertar, el día termina igualmente (para que la racha tenga significado).
          </li>
        </ul>

        <h2>Cómo leer las pistas</h2>
        <ul>
          <li>
            <strong>Verde</strong>: coincide con el personaje del día.
          </li>
          <li>
            <strong>Rojo</strong>: no coincide.
          </li>
          <li>
            En <strong>Año debut</strong>:
            <ul>
              <li>
                <strong>✓</strong>: mismo año.
              </li>
              <li>
                <strong>↑</strong>: el personaje del día debutó <strong>después</strong> (es más nuevo).
              </li>
              <li>
                <strong>↓</strong>: el personaje del día debutó <strong>antes</strong> (es más antiguo).
              </li>
            </ul>
          </li>
        </ul>

        <h2>¿A qué hora cambia el día?</h2>
        <p>
          Otakle cambia a las <strong>00:00 UTC</strong>. En Chile (UTC-3), normalmente equivale a las <strong>21:00</strong>.
          Esto asegura que el personaje del día sea el mismo para todos los jugadores del mundo.
        </p>

        <h2>Preguntas frecuentes (FAQ)</h2>
        <h3>¿Por qué no encuentro un personaje?</h3>
        <p>
          La base de datos se está expandiendo. Si un personaje no aparece, es porque aún no está agregado o su nombre
          puede estar escrito de forma distinta. Puedes sugerirlo por X o correo.
        </p>

        <h3>¿Cómo funciona la racha?</h3>
        <p>
          La racha aumenta solo si <strong>ganas</strong> el día (adivinas dentro de los 8 intentos) y al día siguiente
          vuelves a ganar. Si fallas o saltas un día, la racha se reinicia.
        </p>

        <h3>¿El filtro por anime hace el juego más fácil?</h3>
        <p>
          El filtro es opcional: sirve para reducir frustración al escribir nombres, pero el reto sigue estando en
          interpretar las pistas y acertar dentro del límite de intentos.
        </p>

        <h2>Créditos y contacto</h2>
        <p>
          Hecho por <strong>Aknoid</strong>. Puedes contactarme en{' '}
          <a href="https://twitter.com/aknoid" target="_blank" rel="noreferrer noopener">
            X @aknoid
          </a>{' '}
          o por correo: <a href="mailto:oscarfernandezcepeda@gmail.com">oscarfernandezcepeda@gmail.com</a>.
        </p>

        <h2>Disclaimer</h2>
        <p>
          Otakle es un proyecto de fans, sin relación oficial con estudios, editoriales o propietarios de las obras.
          Todos los nombres y marcas pertenecen a sus respectivos dueños.
        </p>
      </div>

      <footer className="footer">
        <div className="footer-links">
          <Link to="/" className="footer-link">
            Inicio
          </Link>
          <Link to="/about" className="footer-link">
            About
          </Link>
          <Link to="/privacy" className="footer-link">
            Privacy
          </Link>
          <Link to="/terms" className="footer-link">
            Terms
          </Link>
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
          <a className="footer-link" href="https://twitter.com/aknoid" target="_blank" rel="noreferrer noopener">
            X @aknoid
          </a>
          <a className="footer-link" href="mailto:oscarfernandezcepeda@gmail.com">
            oscarfernandezcepeda@gmail.com
          </a>
        </div>
        <div className="footer-note">
          Otakle by <strong>Aknoid</strong>
        </div>
      </footer>
    </div>
  )
}
