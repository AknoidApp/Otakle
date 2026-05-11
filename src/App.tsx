import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Game from './Game'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import About from './pages/About'
import HowToPlay from './pages/HowToPlay'
import Strategy from './pages/Strategy'
import StatsPage from './pages/Stats'
import Archive from './pages/Archive'

const SITE_NAME = 'Otakle'
const SITE_URL = 'https://www.otakle.app'
const DEFAULT_DESCRIPTION = 'Otakle: juego diario para adivinar personajes de anime usando pistas.'

const SEO_BY_PATH: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Daily anime character guessing game',
    description: DEFAULT_DESCRIPTION,
  },
  '/about': {
    title: 'About Otakle',
    description: 'Descubre qué es Otakle, cómo funciona el reto diario y por qué está pensado para fans del anime.',
  },
  '/how-to-play': {
    title: 'How to play',
    description: 'Aprende cómo jugar a Otakle, interpretar las pistas y mejorar tus intentos cada día.',
  },
  '/strategy': {
    title: 'Strategy guide',
    description: 'Consejos y estrategia para acertar el personaje diario de Otakle en menos intentos.',
  },
  '/stats': {
    title: 'Your stats',
    description: 'Revisa tus estadísticas locales, rachas y distribución de intentos en Otakle.',
  },
  '/archive': {
    title: 'Archive',
    description: 'Consulta tu historial local de partidas jugadas en Otakle.',
  },
  '/privacy': {
    title: 'Privacy policy',
    description: 'Lee la política de privacidad de Otakle y cómo se gestionan los datos del juego.',
  },
  '/terms': {
    title: 'Terms of service',
    description: 'Consulta los términos y condiciones de uso de Otakle.',
  },
  '/contact': {
    title: 'Contact',
    description: 'Ponte en contacto con Otakle para soporte, feedback o consultas.',
  },
}

function setMeta(selector: string, attr: 'name' | 'property', value: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, selector.match(/\[(?:name|property)="([^"]+)"\]/)?.[1] ?? '')
    document.head.appendChild(tag)
  }
  tag.content = value
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

function RouteSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const seo = SEO_BY_PATH[pathname] ?? SEO_BY_PATH['/']
    const title = `${seo.title} | ${SITE_NAME}`
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`

    document.title = title
    setMeta('meta[name="description"]', 'name', seo.description)
    setMeta('meta[property="og:title"]', 'property', title)
    setMeta('meta[property="og:description"]', 'property', seo.description)
    setMeta('meta[property="og:type"]', 'property', 'website')
    setMeta('meta[property="og:url"]', 'property', url)
    setMeta('meta[property="og:site_name"]', 'property', SITE_NAME)
    setMeta('meta[name="twitter:card"]', 'name', 'summary')
    setMeta('meta[name="twitter:title"]', 'name', title)
    setMeta('meta[name="twitter:description"]', 'name', seo.description)
    setCanonical(url)
  }, [pathname])

  return null
}

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
      <RouteSeo />
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
