import { Link } from 'react-router-dom'
import '../App.css'

export default function HowToPlay() {
  return (
    <div className="otakle-page">
      <header className="page-header">
        <div className="page-title">
          <h1>Cómo se juega</h1>
          <p>Guía completa para entender las pistas y ganar sin frustrarse.</p>
        </div>

        <div className="page-actions">
          <Link to="/" className="btn-secondary">Volver al juego</Link>
        </div>
      </header>

      <div className="page-card">
        <h2>Objetivo</h2>
        <p>
          Adivinar el <strong>personaje del día</strong> en la menor cantidad de intentos posible.
          Todos tienen el mismo personaje y cambia diariamente.
        </p>

        <h2>Reglas</h2>
        <ul>
          <li>Tienes <strong>8 intentos</strong> máximos por día.</li>
          <li>Cada intento muestra una fila de pistas comparando tu elección vs el personaje del día.</li>
          <li>Al acertar, termina el día y puedes compartir tu resultado.</li>
        </ul>

        <h2>Colores</h2>
        <ul>
          <li><strong>Verde</strong>: coincide exactamente.</li>
          <li><strong>Rojo</strong>: no coincide.</li>
          <li><strong>Año debut</strong>: la flecha te dice si el personaje del día es más nuevo (↑) o más antiguo (↓).</li>
        </ul>

        <h2>Hora de cambio</h2>
        <p>
          Otakle cambia a las <strong>00:00 UTC</strong>. En Chile suele ser <strong>21:00</strong> (UTC-3).
          Esto mantiene el día igual para todo el mundo.
        </p>

        <h2>Tips rápidos</h2>
        <ul>
          <li>Primero intenta “clasificar” por anime/rol antes de buscar precisión.</li>
          <li>Usa el año para acotar: si te sale ↑, busca personajes más nuevos.</li>
          <li>Si te repetiste en un anime, cambia radicalmente el siguiente intento.</li>
        </ul>

        <p style={{ marginTop: '1rem' }}>
          ¿Quieres estrategias más avanzadas? <Link to="/strategy">Ve la guía de estrategia</Link>.
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
