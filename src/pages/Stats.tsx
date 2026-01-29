import { Link } from 'react-router-dom'
import '../App.css'
import { computeStatsFromHistory, loadHistory } from '../lib/history'

export default function StatsPage() {
  const history = loadHistory()
  const s = computeStatsFromHistory(history)

  return (
    <div className="otakle-page">
      <header className="page-header">
        <div className="page-title">
          <h1>Stats</h1>
          <p>Estadísticas locales (se guardan en tu navegador).</p>
        </div>

        <div className="page-actions">
          <Link to="/" className="btn-secondary">Volver al juego</Link>
        </div>
      </header>

      <div className="page-grid">
        <div className="page-card">
          <h2>Resumen</h2>
          <div className="stats-grid">
            <div className="mini-stat">
              <div className="mini-label">Días jugados</div>
              <div className="mini-value">{s.played}</div>
            </div>
            <div className="mini-stat">
              <div className="mini-label">Victorias</div>
              <div className="mini-value">{s.wins}</div>
            </div>
            <div className="mini-stat">
              <div className="mini-label">Derrotas</div>
              <div className="mini-value">{s.losses}</div>
            </div>
            <div className="mini-stat">
              <div className="mini-label">Promedio intentos (victorias)</div>
              <div className="mini-value">{s.avgWinTries ? s.avgWinTries.toFixed(2) : '—'}</div>
            </div>
          </div>
        </div>

        <div className="page-card">
          <h2>Distribución (victorias)</h2>
          <div className="dist">
            {Object.entries(s.dist).map(([tries, count]) => (
              <div key={tries} className="dist-row">
                <div className="dist-k">{tries}</div>
                <div className="dist-bar">
                  <div className="dist-fill" style={{ width: `${Math.min(100, (count / Math.max(1, s.wins)) * 100)}%` }} />
                </div>
                <div className="dist-v">{count}</div>
              </div>
            ))}
          </div>
          <p className="hint-muted">*Solo cuenta días ganados (para que sea comparable).</p>
        </div>
      </div>

      <footer className="page-footer">
        <Link to="/how-to-play">Cómo se juega</Link>
        <span>·</span>
        <Link to="/strategy">Estrategia</Link>
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
