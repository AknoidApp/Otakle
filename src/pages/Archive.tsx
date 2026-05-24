import { Link } from 'react-router-dom'
import '../App.css'
import { loadHistory } from '../lib/history'

export default function Archive() {
  const history = loadHistory().slice().sort((a, b) => b.dayIndex - a.dayIndex)

  return (
    <div className="otakle-page">
      <header className="page-header">
        <div className="page-title">
          <h1>Tu historial</h1>
          <p>Historial local de días jugados. Se guarda solo en tu navegador.</p>
        </div>

        <div className="page-actions">
          <Link to="/play" className="btn-secondary">Ir a jugar</Link>
        </div>
      </header>

      <div className="page-card">
        {history.length === 0 ? (
          <p>Aún no tienes historial guardado. Juega un día y vuelve acá.</p>
        ) : (
          <div className="archive-list">
            {history.map((e) => (
              <div key={e.dayIndex} className="archive-item">
                <div className="archive-left">
                  <div className="archive-day">Otakle #{e.dayIndex + 1}</div>
                  <div className="archive-date">{e.dateUTC} (UTC)</div>
                </div>
                <div className="archive-right">
                  <span className={`pill ${e.won ? 'pill-win' : 'pill-lose'}`}>{e.won ? 'Victoria' : 'Derrota'}</span>
                  <span className="pill pill-tries">{e.tries}/8</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="page-footer">
        <Link to="/">Inicio</Link><span>·</span>
        <Link to="/play">Jugar</Link><span>·</span>
        <Link to="/how-to-play">Cómo se juega</Link><span>·</span>
        <Link to="/strategy">Estrategia</Link><span>·</span>
        <Link to="/faq">FAQ</Link><span>·</span>
        <Link to="/animes">Animes</Link><span>·</span>
        <Link to="/personajes">Personajes</Link><span>·</span>
        <Link to="/stats">Estadísticas</Link><span>·</span>
        <Link to="/about">Sobre Otakle</Link><span>·</span>
        <Link to="/privacy">Privacidad</Link><span>·</span>
        <Link to="/terms">Términos</Link><span>·</span>
        <Link to="/contact">Contacto</Link>
      </footer>
    </div>
  )
}
