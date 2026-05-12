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
const SITE_IMAGE = `${SITE_URL}/otakle-logo.png`
const ADSENSE_ACCOUNT = 'ca-pub-6805458140116682'
const DEFAULT_DESCRIPTION =
  'Otakle es un juego diario para adivinar personajes de anime usando pistas de serie, rol, año, raza y más.'

type SeoEntry = {
  title: string
  description: string
  keywords: string
}

const SEO_BY_PATH: Record<string, SeoEntry> = {
  '/': {
    title: 'Juego diario para adivinar personajes de anime',
    description: DEFAULT_DESCRIPTION,
    keywords: 'anime, juego diario, adivinar personaje, otakle, anime wordle, anime guessing game',
  },
  '/about': {
    title: 'Qué es Otakle',
    description:
      'Descubre qué es Otakle, cómo funciona el reto diario y por qué está pensado para fans del anime.',
    keywords: 'about otakle, juego anime, fan project anime, aknoid',
  },
  '/how-to-play': {
    title: 'Cómo jugar Otakle',
    description: 'Aprende las reglas, cómo leer las pistas y cómo empezar a ganar en Otakle.',
    keywords: 'como jugar otakle, reglas otakle, pistas otakle, anime guessing game help',
  },
  '/strategy': {
    title: 'Estrategia para ganar más veces',
    description: 'Consejos y estrategia para acertar el personaje diario de Otakle en menos intentos.',
    keywords: 'estrategia otakle, tips otakle, anime guessing game strategy',
  },
  '/stats': {
    title: 'Tus estadísticas',
    description: 'Revisa tus estadísticas locales, rachas y distribución de intentos en Otakle.',
    keywords: 'estadisticas otakle, racha otakle, historial de juego anime',
  },
  '/archive': {
    title: 'Tu historial',
    description: 'Consulta tu historial local de partidas jugadas en Otakle.',
    keywords: 'historial otakle, archive otakle, partidas jugadas',
  },
  '/privacy': {
    title: 'Política de privacidad',
    description: 'Lee la política de privacidad de Otakle y cómo se gestionan los datos del juego.',
    keywords: 'privacy policy otakle, privacidad otakle, adsense privacy',
  },
  '/terms': {
    title: 'Términos de uso',
    description: 'Consulta los términos y condiciones de uso de Otakle.',
    keywords: 'terms otakle, términos de uso, reglas del sitio',
  },
  '/contact': {
    title: 'Contacto y soporte',
    description: 'Ponte en contacto con Otakle para soporte, feedback o sugerencias de personajes.',
    keywords: 'contact otakle, soporte otakle, sugerir personaje anime',
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

function setJsonLd(data: object | object[]) {
  let script = document.head.querySelector<HTMLScriptElement>('script[data-otakle-jsonld="route"]')
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.otakleJsonld = 'route'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(Array.isArray(data) ? data : [data])
}

function getStructuredData(pathname: string) {
  const pageUrl = `${SITE_URL}${pathname === '/' ? '/' : pathname}`
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'es',
    description: DEFAULT_DESCRIPTION,
    publisher: {
      '@type': 'Person',
      name: 'Aknoid',
    },
  }

  if (pathname === '/') {
    return [
      website,
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SITE_NAME,
        url: pageUrl,
        applicationCategory: 'GameApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        inLanguage: 'es',
        isAccessibleForFree: true,
        image: SITE_IMAGE,
        description: DEFAULT_DESCRIPTION,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ]
  }

  if (pathname === '/how-to-play') {
    return [
      website,
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿Cuántos intentos tengo por día en Otakle?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tienes 8 intentos máximos para adivinar el personaje del día.',
            },
          },
          {
            '@type': 'Question',
            name: '¿A qué hora cambia el personaje diario?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Otakle cambia a las 00:00 UTC para que el personaje sea el mismo para todos.',
            },
          },
          {
            '@type': 'Question',
            name: '¿El filtro por anime cambia el personaje del día?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. El filtro por anime solo reduce las sugerencias al escribir nombres.',
            },
          },
        ],
      },
    ]
  }

  if (pathname === '/contact') {
    return [
      website,
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contacto Otakle',
        url: pageUrl,
        description: 'Canales de contacto para soporte, feedback y sugerencias de personajes.',
      },
    ]
  }

  return [
    website,
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: SEO_BY_PATH[pathname]?.title ?? SITE_NAME,
      url: pageUrl,
      description: SEO_BY_PATH[pathname]?.description ?? DEFAULT_DESCRIPTION,
      inLanguage: 'es',
    },
  ]
}

function RouteSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const seo = SEO_BY_PATH[pathname] ?? SEO_BY_PATH['/']
    const title = `${seo.title} | ${SITE_NAME}`
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`

    document.title = title
    document.documentElement.lang = 'es'

    setMeta('meta[name="description"]', 'name', seo.description)
    setMeta('meta[name="keywords"]', 'name', seo.keywords)
    setMeta('meta[name="robots"]', 'name', 'index,follow,max-image-preview:large')
    setMeta('meta[name="theme-color"]', 'name', '#0b1220')
    setMeta('meta[name="google-adsense-account"]', 'name', ADSENSE_ACCOUNT)
    setMeta('meta[property="og:title"]', 'property', title)
    setMeta('meta[property="og:description"]', 'property', seo.description)
    setMeta('meta[property="og:type"]', 'property', 'website')
    setMeta('meta[property="og:url"]', 'property', url)
    setMeta('meta[property="og:site_name"]', 'property', SITE_NAME)
    setMeta('meta[property="og:image"]', 'property', SITE_IMAGE)
    setMeta('meta[property="og:locale"]', 'property', 'es_CL')
    setMeta('meta[name="twitter:card"]', 'name', 'summary')
    setMeta('meta[name="twitter:title"]', 'name', title)
    setMeta('meta[name="twitter:description"]', 'name', seo.description)
    setMeta('meta[name="twitter:image"]', 'name', SITE_IMAGE)
    setCanonical(url)
    setJsonLd(getStructuredData(pathname))
  }, [pathname])

  return null
}

function loadAdsenseOnce() {
  const host = window.location.hostname

  const isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    host.startsWith('172.')

  if (isLocal) return

  const existing = document.querySelector(
    'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
  )
  if (existing) return

  const s = document.createElement('script')
  s.async = true
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ACCOUNT}`
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
