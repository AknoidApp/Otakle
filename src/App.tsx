import { Suspense, lazy, useEffect } from 'react'
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
import EditorialPage from './pages/EditorialPage'
import { EDITORIAL_PAGES } from './lib/editorialData'
import { ADSENSE_ACCOUNT, SEO_BY_PATH, SITE_IMAGE, SITE_NAME, SITE_URL, getStructuredData } from './lib/seoData'

const Home = lazy(() => import('./pages/Home'))
const Faq = lazy(() => import('./pages/Faq'))
const Animes = lazy(() => import('./pages/Animes'))
const Characters = lazy(() => import('./pages/Characters'))

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
    setMeta('meta[name="robots"]', 'name', seo.robots ?? 'index,follow,max-image-preview:large')
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

  const isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.')

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

function RouteFallback() {
  return <div className="helper-note">Cargando contenido…</div>
}

export default function App() {
  useEffect(() => {
    loadAdsenseOnce()
  }, [])

  return (
    <BrowserRouter>
      <RouteSeo />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Game />} />
          <Route path="/jugar" element={<Navigate to="/play" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/strategy" element={<Strategy />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/animes" element={<Animes />} />
          <Route path="/personajes" element={<Characters />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          {EDITORIAL_PAGES.map((page) => (
            <Route key={page.path} path={page.path} element={<EditorialPage page={page} />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
