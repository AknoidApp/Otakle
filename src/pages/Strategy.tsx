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
          <Link to="/" className="btn-secondary">Volver al juego</Link>
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

        <p style={{ marginTop: '1rem' }}>
          Si aún no viste las reglas: <Link to="/how-to-play">Cómo se juega</Link>.
        </p>
      </div>

      <footer className="page-footer">
        <Link to="/about">About</Link>
        <span>·</span>
        <Link to="/stats">Stats</Link>
        <span>·</span>
        <Link to="/archive">Archive</Link>
        <span>·</span>
        <Link to="/privacy">Privacy</Link>
        <span>·</span>
        <Link to="/terms">Terms</Link>
        <span>·</span>
        <Link to="/contact">Contact</Link>
      </footer>
    </div>
  )
}
