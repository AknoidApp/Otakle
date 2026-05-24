import { Link } from 'react-router-dom'
import '../App.css'

export default function Strategy() {
  return (
    <div className="otakle-page">
      <header className="page-header">
        <div className="page-title">
          <h1>Estrategia</h1>
          <p>Cómo jugar mejor (sin necesidad de googlear cada intento).</p>
        </div>

        <div className="page-actions">
          <Link to="/play" className="btn-secondary">Ir a jugar</Link>
        </div>
      </header>

      <div className="page-card">
        <h2>1) El primer intento es “exploratorio”</h2>
        <p>
          El objetivo no es acertar al tiro, sino conseguir pistas que te separen del resto:
          anime, rol, género, raza y año.
        </p>

        <h2>2) El año es tu mejor filtro</h2>
        <ul>
          <li>Si sale <strong>↑</strong>, el personaje del día es <strong>más nuevo</strong> que tu intento.</li>
          <li>Si sale <strong>↓</strong>, el personaje del día es <strong>más antiguo</strong>.</li>
        </ul>

        <h2>3) Evita intentos “parecidos”</h2>
        <p>
          Si tu intento comparte muchas categorías (misma serie, misma raza, mismo rol),
          cambias poco la información. Alterna: shonen → deportes → romance, etc.
        </p>

        <h2>4) Cómo usar el filtro por anime sin romper el reto</h2>
        <p>
          Úsalo solo para <strong>escribir</strong> personajes que ya tienes en mente. No lo uses para “listar”
          hasta que te queden 2–3 opciones reales.
        </p>

        <h2>5) Últimos intentos</h2>
        <p>
          Cuando te queden 2–3 intentos, elige personajes que te cambien 1–2 categorías a la vez, no todo.
          Eso te dice exactamente qué falta.
        </p>

        <h2>Errores comunes</h2>
        <ul>
          <li>Insistir con personajes demasiado parecidos cuando ya sabes que el anime o el rol no coinciden.</li>
          <li>Usar el filtro por anime como si fuera una pista del juego.</li>
          <li>Ignorar el año de debut, que suele recortar muchísimo el rango de opciones.</li>
        </ul>

        <p style={{ marginTop: '1rem' }}>
          Si aún no viste las reglas: <Link to="/how-to-play">Cómo se juega</Link>.
        </p>
      </div>

      <footer className="page-footer">
        <Link to="/">Inicio</Link>
        <span>·</span>
        <Link to="/play">Jugar</Link>
        <span>·</span>
        <Link to="/about">Sobre Otakle</Link>
        <span>·</span>
        <Link to="/stats">Estadísticas</Link>
        <span>·</span>
        <Link to="/archive">Historial</Link>
        <span>·</span>
        <Link to="/faq">FAQ</Link>
        <span>·</span>
        <Link to="/animes">Animes</Link>
        <span>·</span>
        <Link to="/personajes">Personajes</Link>
        <span>·</span>
        <Link to="/privacy">Privacidad</Link>
        <span>·</span>
        <Link to="/terms">Términos</Link>
        <span>·</span>
        <Link to="/contact">Contacto</Link>
      </footer>
    </div>
  )
}
