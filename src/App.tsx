import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Game from './Game'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import About from './pages/About'
import HowToPlay from './pages/HowToPlay'
import Strategy from './pages/Strategy'
import StatsPage from './pages/Stats'
import Archive from './pages/Archive'

function loadAdsenseOnce() {
  const host = window.location.hostname

  // En local (dev) NO cargamos AdSense para evitar problemas con Vite/Vercel Dev
  const isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    host.startsWith('172.')

  if (isLocal) return

  // Evitar cargar 2 veces si React re-renderiza
  const existing = document.querySelector(
    'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
  )
  if (existing) return

  const s = document.createElement('script')
  s.async = true
  s.src =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6805458140116682'
  s.crossOrigin = 'anonymous'
  document.head.appendChild(s)
}

export default function App() {
  useEffect(() => {
    loadAdsenseOnce()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/strategy" element={<Strategy />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
