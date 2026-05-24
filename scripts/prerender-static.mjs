import fs from 'node:fs/promises'
import path from 'node:path'
import {
  ANIME_GROUPS,
  EASY_MODE_COUNT,
  FAQ_ITEMS,
  FEATURED_CHARACTERS,
  PRIMARY_LINKS,
  SITE_EMAIL,
  SITE_X_LABEL,
  SITE_X_URL,
  TOP_ANIME_GROUPS,
  TOTAL_ANIMES,
  TOTAL_CHARACTERS,
  getCharacterExcerpt,
} from '../src/lib/siteData.ts'
import { SEO_BY_PATH, SITE_IMAGE, SITE_NAME, SITE_URL, getStructuredData } from '../src/lib/seoData.ts'

const DIST_DIR = path.join(process.cwd(), 'dist')
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html')

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function anchor(href, label, className = '') {
  return `<a href="${escapeHtml(href)}"${className ? ` class="${className}"` : ''}>${escapeHtml(label)}</a>`
}

function footerLinks() {
  return `
    <div class="page-footer">
      ${anchor('/', 'Inicio')}
      ${anchor('/play', 'Jugar')}
      ${anchor('/how-to-play', 'Cómo se juega')}
      ${anchor('/strategy', 'Estrategia')}
      ${anchor('/faq', 'FAQ')}
      ${anchor('/animes', 'Animes')}
      ${anchor('/personajes', 'Personajes')}
      ${anchor('/about', 'Sobre Otakle')}
      ${anchor('/contact', 'Contacto')}
    </div>
  `
}

function homeBody() {
  const animeCards = TOP_ANIME_GROUPS.map(
    (group) => `
      <article class="directory-card">
        <div class="directory-topline">
          <h3>${escapeHtml(group.anime)}</h3>
          <span class="count-pill">${group.count} personajes</span>
        </div>
        <p>Algunas entradas presentes en el catálogo actual: <strong>${escapeHtml(group.sampleNames.join(', '))}</strong>.</p>
      </article>
    `,
  ).join('')

  const characterCards = FEATURED_CHARACTERS.slice(0, 8)
    .map(
      (character) => `
        <article class="character-showcase-card">
          <img class="character-showcase-image" src="${escapeHtml(character.imageUrl)}" alt="${escapeHtml(character.name)}" />
          <div class="character-showcase-body">
            <h3>${escapeHtml(character.name)}</h3>
            <p class="character-showcase-anime">${escapeHtml(character.anime)}</p>
            <p>${escapeHtml(getCharacterExcerpt(character))}</p>
          </div>
        </article>
      `,
    )
    .join('')

  const faqCards = FAQ_ITEMS.slice(0, 4)
    .map(
      (item) => `
        <article class="faq-card">
          <h3>${escapeHtml(item.question)}</h3>
          <p>${escapeHtml(item.answer)}</p>
        </article>
      `,
    )
    .join('')

  const quickLinks = PRIMARY_LINKS.map((link) => anchor(link.to, link.label, 'home-link-pill')).join('')

  return `
    <div class="otakle-page">
      <header class="brand landing-brand">
        <div class="brand-left">
          <img class="brand-logo" src="/otakle-logo.png" alt="Otakle" />
          <div class="brand-text">
            <div class="title-row">
              <h1 class="brand-title">Otakle</h1>
              <span class="daily-badge">ANIME DAILY</span>
            </div>
            <p class="brand-subtitle">Juego diario de personajes de anime + guías + catálogo público</p>
          </div>
        </div>
        <div class="topbar-actions">
          ${anchor('/play', 'Jugar ahora', 'btn-primary')}
          ${anchor('/how-to-play', 'Cómo se juega', 'btn-secondary')}
        </div>
      </header>

      <section class="landing-hero">
        <div class="landing-copy">
          <span class="home-kicker">Qué es Otakle</span>
          <h2>Un reto diario para fans del anime, acompañado de contenido público útil</h2>
          <p>Otakle es un juego diario donde cada intento compara tu personaje con la solución del día usando pistas como anime, rol, año de debut, estudio, raza y rangos de edad.</p>
          <p>Además del reto interactivo, el sitio incluye explicaciones públicas, FAQ, catálogo de personajes y un resumen de series presentes para que la web tenga contenido útil incluso cuando no estás jugando.</p>
          <div class="landing-cta-row">
            ${anchor('/play', 'Ir al reto diario', 'btn-primary')}
            ${anchor('/personajes', 'Ver catálogo de personajes', 'btn-secondary')}
            ${anchor('/animes', 'Explorar animes incluidos', 'btn-secondary')}
          </div>
        </div>

        <aside class="landing-stat-grid" aria-label="Resumen del sitio">
          <div class="landing-stat-card"><div class="mini-label">Personajes activos</div><div class="landing-stat-value">${TOTAL_CHARACTERS}</div></div>
          <div class="landing-stat-card"><div class="mini-label">Series incluidas</div><div class="landing-stat-value">${TOTAL_ANIMES}</div></div>
          <div class="landing-stat-card"><div class="mini-label">Modo easy</div><div class="landing-stat-value">${EASY_MODE_COUNT}</div></div>
          <div class="landing-stat-card"><div class="mini-label">Intentos por día</div><div class="landing-stat-value">8</div></div>
        </aside>
      </section>

      <section class="page-grid">
        <article class="page-card">
          <h2>Cómo funciona el reto</h2>
          <ul>
            <li>Cada día hay un personaje nuevo para todos los jugadores.</li>
            <li>Tienes 8 intentos máximos por día.</li>
            <li>Las pistas comparan tu intento con el personaje correcto.</li>
          </ul>
        </article>
        <article class="page-card">
          <h2>Qué aporta el sitio</h2>
          <ul>
            <li>Guías públicas para entender las reglas y jugar mejor.</li>
            <li>Catálogo visible de personajes y animes presentes.</li>
            <li>FAQ, páginas legales y canales de contacto claros.</li>
          </ul>
        </article>
      </section>

      <section class="catalog-section">
        <div class="section-heading">
          <div>
            <span class="home-kicker">Franquicias destacadas</span>
            <h2>Animes presentes en el catálogo actual</h2>
          </div>
          ${anchor('/animes', 'Ver todas las series', 'btn-secondary')}
        </div>
        <div class="directory-grid">${animeCards}</div>
      </section>

      <section class="catalog-section">
        <div class="section-heading">
          <div>
            <span class="home-kicker">Muestra del catálogo</span>
            <h2>Personajes destacados que ya están dentro de Otakle</h2>
          </div>
          ${anchor('/personajes', 'Ver catálogo completo', 'btn-secondary')}
        </div>
        <div class="character-showcase-grid">${characterCards}</div>
      </section>

      <section class="catalog-section">
        <div class="section-heading">
          <div>
            <span class="home-kicker">FAQ rápida</span>
            <h2>Preguntas frecuentes sobre Otakle</h2>
          </div>
          ${anchor('/faq', 'Ver FAQ completa', 'btn-secondary')}
        </div>
        <div class="faq-grid">${faqCards}</div>
      </section>

      <section class="page-card notice-card">
        <h2>Navegación rápida</h2>
        <div class="chip-link-list">${quickLinks}</div>
      </section>

      ${footerLinks()}
    </div>
  `
}

function playBody() {
  return `
    <div class="otakudle-container">
      <header class="brand">
        <div class="brand-left">
          <img class="brand-logo" src="/otakle-logo.png" alt="Otakle" />
          <div class="brand-text">
            <div class="title-row">
              <h1 class="brand-title">Jugar Otakle</h1>
              <span class="daily-badge">PLAY</span>
            </div>
            <p class="brand-subtitle">Reto diario interactivo para adivinar personajes de anime</p>
          </div>
        </div>
        <div class="topbar-actions">
          ${anchor('/', 'Volver al inicio', 'btn-secondary')}
        </div>
      </header>

      <section class="page-grid">
        <article class="page-card">
          <h2>Qué encontrarás en esta pantalla</h2>
          <p>El tablero interactivo de Otakle permite escribir personajes, recibir pistas por categorías y resolver el reto diario dentro de un máximo de 8 intentos.</p>
          <ul>
            <li>Anime, rol, estudio, género, raza y rangos de edad.</li>
            <li>Flechas para comparar el año de debut.</li>
            <li>Modo normal y modo easy.</li>
          </ul>
        </article>
        <article class="page-card">
          <h2>Importante</h2>
          <p>El juego requiere JavaScript para funcionar completamente. Si estás leyendo esta versión estática, puedes revisar las guías públicas mientras carga o habilitar JavaScript para jugar.</p>
          <div class="chip-link-list">
            ${anchor('/how-to-play', 'Cómo se juega', 'home-link-pill')}
            ${anchor('/strategy', 'Estrategia', 'home-link-pill')}
            ${anchor('/faq', 'FAQ', 'home-link-pill')}
            ${anchor('/personajes', 'Personajes', 'home-link-pill')}
          </div>
        </article>
      </section>

      ${footerLinks()}
    </div>
  `
}

function aboutBody() {
  return `
    <div class="otakle-page">
      <header class="page-header">
        <div class="page-title">
          <h1>Sobre Otakle</h1>
          <p>Qué es el proyecto, cómo funciona el reto diario y por qué está hecho para fans del anime.</p>
        </div>
        <div class="page-actions">${anchor('/play', 'Ir a jugar', 'btn-primary')}</div>
      </header>
      <div class="legal-content">
        <p><strong>Otakle</strong> es un juego diario estilo Wordle para adivinar personajes de anime usando pistas comparativas.</p>
        <h2>Qué hace distinto a Otakle</h2>
        <ul>
          <li>No depende solo de una imagen: mezcla anime, rol, estudio, año, raza y edad.</li>
          <li>Todos reciben el mismo reto diario.</li>
          <li>Está pensado para fans que quieren un hábito diario corto y compartible.</li>
        </ul>
        <h2>Para quién es</h2>
        <p>Para jugadores que disfrutan reconocer personajes, comparar pistas y explorar series con un enfoque anime.</p>
      </div>
      ${footerLinks()}
    </div>
  `
}

function howToPlayBody() {
  return `
    <div class="otakle-page">
      <header class="page-header">
        <div class="page-title">
          <h1>Cómo se juega</h1>
          <p>Guía pública para entender reglas, colores, flechas y hora de cambio del reto diario.</p>
        </div>
        <div class="page-actions">${anchor('/play', 'Ir a jugar', 'btn-primary')}</div>
      </header>
      <div class="page-card">
        <h2>Reglas básicas</h2>
        <ul>
          <li>Tienes 8 intentos por día.</li>
          <li>Todos juegan el mismo personaje diario.</li>
          <li>El reto cambia a las 00:00 UTC.</li>
        </ul>
        <h2>Cómo leer las pistas</h2>
        <ul>
          <li>Verde: coincide exactamente.</li>
          <li>Rojo: no coincide.</li>
          <li>Año debut: ↑ indica que el personaje del día es más nuevo; ↓ indica que es más antiguo.</li>
        </ul>
      </div>
      ${footerLinks()}
    </div>
  `
}

function strategyBody() {
  return `
    <div class="otakle-page">
      <header class="page-header">
        <div class="page-title">
          <h1>Estrategia</h1>
          <p>Consejos públicos para acertar más veces el personaje diario sin depender de búsquedas externas.</p>
        </div>
        <div class="page-actions">${anchor('/play', 'Ir a jugar', 'btn-primary')}</div>
      </header>
      <div class="page-card">
        <h2>Consejos clave</h2>
        <ul>
          <li>Usa el primer intento para clasificar anime, rol y tipo de personaje.</li>
          <li>El año de debut suele ser una de las pistas más útiles para recortar opciones.</li>
          <li>No repitas personajes demasiado parecidos si ya sabes que el anime o el rol no coinciden.</li>
        </ul>
      </div>
      ${footerLinks()}
    </div>
  `
}

function faqBody() {
  const cards = FAQ_ITEMS.map(
    (item) => `
      <article class="faq-card">
        <h2>${escapeHtml(item.question)}</h2>
        <p>${escapeHtml(item.answer)}</p>
      </article>
    `,
  ).join('')

  return `
    <div class="otakle-page">
      <header class="page-header">
        <div class="page-title">
          <h1>Preguntas frecuentes</h1>
          <p>Respuestas sobre reglas, reinicios, pistas, modo easy, historial local y soporte.</p>
        </div>
        <div class="page-actions">${anchor('/play', 'Ir a jugar', 'btn-primary')}</div>
      </header>
      <div class="faq-grid faq-grid-full">${cards}</div>
      ${footerLinks()}
    </div>
  `
}

function animesBody() {
  const cards = ANIME_GROUPS.map(
    (group) => `
      <article class="directory-card">
        <div class="directory-topline">
          <h2>${escapeHtml(group.anime)}</h2>
          <span class="count-pill">${group.count}</span>
        </div>
        <p>Series presentes en el catálogo público de Otakle con una muestra rápida de personajes ya disponibles.</p>
        <div class="chip-link-list">${group.sampleNames.map((name) => `<span class="name-chip">${escapeHtml(name)}</span>`).join('')}</div>
      </article>
    `,
  ).join('')

  return `
    <div class="otakle-page">
      <header class="page-header">
        <div class="page-title">
          <h1>Animes incluidos en Otakle</h1>
          <p>Resumen público de las series y franquicias presentes actualmente dentro del juego.</p>
        </div>
        <div class="page-actions">
          ${anchor('/personajes', 'Ver personajes', 'btn-secondary')}
          ${anchor('/play', 'Jugar el reto diario', 'btn-primary')}
        </div>
      </header>
      <div class="page-grid">
        <article class="page-card">
          <h2>Resumen</h2>
          <ul>
            <li><strong>${TOTAL_CHARACTERS}</strong> personajes activos.</li>
            <li><strong>${TOTAL_ANIMES}</strong> series o franquicias representadas.</li>
            <li>El catálogo se usa en búsquedas, sugerencias y retos diarios.</li>
          </ul>
        </article>
        <article class="page-card">
          <h2>Cómo leer esta página</h2>
          <p>Cada tarjeta resume una obra presente en Otakle con un conteo de personajes y una muestra visible de nombres disponibles.</p>
        </article>
      </div>
      <div class="directory-grid directory-grid-wide">${cards}</div>
      ${footerLinks()}
    </div>
  `
}

function charactersBody() {
  const cards = ANIME_GROUPS.map(
    (group) => `
      <article class="directory-card">
        <div class="directory-topline">
          <h2>${escapeHtml(group.anime)}</h2>
          <span class="count-pill">${group.count} personajes</span>
        </div>
        <div class="chip-link-list">${group.characters.map((character) => `<span class="name-chip">${escapeHtml(character.name)}</span>`).join('')}</div>
      </article>
    `,
  ).join('')

  return `
    <div class="otakle-page">
      <header class="page-header">
        <div class="page-title">
          <h1>Catálogo público de personajes</h1>
          <p>Listado público de personajes activos incluidos en Otakle, agrupados por serie o franquicia.</p>
        </div>
        <div class="page-actions">
          ${anchor('/animes', 'Ver series', 'btn-secondary')}
          ${anchor('/play', 'Jugar ahora', 'btn-primary')}
        </div>
      </header>
      <div class="page-card">
        <h2>Resumen</h2>
        <p>Actualmente hay <strong>${TOTAL_CHARACTERS}</strong> personajes activos usados en el catálogo, la búsqueda y el reto diario de Otakle.</p>
      </div>
      <div class="directory-grid directory-grid-wide">${cards}</div>
      ${footerLinks()}
    </div>
  `
}

function privacyBody() {
  return `
    <div class="otakudle-container">
      <header class="brand">
        <div class="brand-left">
          <img class="brand-logo" src="/otakle-logo.png" alt="Otakle" />
          <div class="brand-text">
            <div class="title-row">
              <h1 class="brand-title">Política de privacidad</h1>
              <span class="daily-badge">LEGAL</span>
            </div>
            <p class="brand-subtitle">Última actualización: 2026-01-06</p>
          </div>
        </div>
        <div class="topbar-actions">${anchor('/play', 'Ir a jugar', 'btn-secondary')}</div>
      </header>
      <div class="legal-content">
        <p>Otakle guarda el progreso del juego y estadísticas de forma local en el navegador. Si el sitio usa publicidad, proveedores como Google pueden aplicar sus propias políticas de cookies e identificadores.</p>
      </div>
      ${footerLinks()}
    </div>
  `
}

function termsBody() {
  return `
    <div class="otakudle-container">
      <header class="brand">
        <div class="brand-left">
          <img class="brand-logo" src="/otakle-logo.png" alt="Otakle" />
          <div class="brand-text">
            <div class="title-row">
              <h1 class="brand-title">Términos de uso</h1>
              <span class="daily-badge">LEGAL</span>
            </div>
            <p class="brand-subtitle">Última actualización: 2026-01-06</p>
          </div>
        </div>
        <div class="topbar-actions">${anchor('/play', 'Ir a jugar', 'btn-secondary')}</div>
      </header>
      <div class="legal-content">
        <p>Otakle es un proyecto fan y se ofrece tal cual. Está permitido para uso personal, sin automatizaciones abusivas ni acciones que afecten el servicio.</p>
      </div>
      ${footerLinks()}
    </div>
  `
}

function contactBody() {
  return `
    <div class="otakudle-container">
      <header class="brand">
        <div class="brand-left">
          <img class="brand-logo" src="/otakle-logo.png" alt="Otakle" />
          <div class="brand-text">
            <div class="title-row">
              <h1 class="brand-title">Contacto</h1>
              <span class="daily-badge">INFO</span>
            </div>
            <p class="brand-subtitle">Canales oficiales para bugs, sugerencias y consultas</p>
          </div>
        </div>
        <div class="topbar-actions">${anchor('/play', 'Ir a jugar', 'btn-secondary')}</div>
      </header>
      <div class="legal-content">
        <p>Si quieres reportar un bug, proponer personajes o consultar algo sobre el proyecto, puedes escribir a <a href="mailto:${escapeHtml(SITE_EMAIL)}">${escapeHtml(SITE_EMAIL)}</a> o visitar <a href="${escapeHtml(SITE_X_URL)}" target="_blank" rel="noreferrer noopener">${escapeHtml(SITE_X_LABEL)}</a>.</p>
      </div>
      ${footerLinks()}
    </div>
  `
}

function localOnlyBody(title, description) {
  return `
    <div class="otakle-page">
      <header class="page-header">
        <div class="page-title">
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(description)}</p>
        </div>
        <div class="page-actions">${anchor('/play', 'Ir a jugar', 'btn-primary')}</div>
      </header>
      <div class="page-card">
        <h2>Contenido local</h2>
        <p>Esta sección depende del historial guardado en tu navegador y se completa con JavaScript. Sirve para revisar tu progreso personal, no como contenido público general del catálogo.</p>
      </div>
      ${footerLinks()}
    </div>
  `
}

const routeBodies = {
  '/': homeBody,
  '/play': playBody,
  '/jugar': playBody,
  '/about': aboutBody,
  '/how-to-play': howToPlayBody,
  '/strategy': strategyBody,
  '/faq': faqBody,
  '/animes': animesBody,
  '/personajes': charactersBody,
  '/privacy': privacyBody,
  '/terms': termsBody,
  '/contact': contactBody,
  '/stats': () => localOnlyBody('Tus estadísticas', 'Estadísticas locales de tu progreso guardadas en tu navegador.'),
  '/archive': () => localOnlyBody('Tu historial', 'Historial local de partidas jugadas, guardado únicamente en tu navegador.'),
}

function setMetaTag(html, attr, key, value) {
  const pattern = new RegExp(`<meta\\s+${attr}="${key.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}"\\s+content="[^"]*"\\s*\\/?>(?:</meta>)?`, 'i')
  const replacement = `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `  ${replacement}\n  </head>`)
}

function setCanonical(html, href) {
  const replacement = `<link rel="canonical" href="${escapeHtml(href)}" />`
  return html.includes('rel="canonical"')
    ? html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>(?:<\/link>)?/i, replacement)
    : html.replace('</head>', `  ${replacement}\n  </head>`)
}

function setTitle(html, title) {
  return html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
}

function injectJsonLd(html, pathname) {
  const json = JSON.stringify(getStructuredData(pathname)).replaceAll('</script', '<\\/script')
  const script = `<script type="application/ld+json">${json}</script>`
  return html.replace('</head>', `  ${script}\n  </head>`)
}

function routeFile(pathname) {
  if (pathname === '/') return path.join(DIST_DIR, 'index.html')
  return path.join(DIST_DIR, `${pathname.slice(1)}.html`)
}

async function main() {
  const template = await fs.readFile(TEMPLATE_PATH, 'utf8')

  for (const pathname of Object.keys(routeBodies)) {
    const seo = SEO_BY_PATH[pathname] ?? SEO_BY_PATH['/']
    const fullTitle = `${seo.title} | ${SITE_NAME}`
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`
    const bodyMarkup = routeBodies[pathname]()

    let html = template
    html = setTitle(html, fullTitle)
    html = setMetaTag(html, 'name', 'description', seo.description)
    html = setMetaTag(html, 'name', 'keywords', seo.keywords)
    html = setMetaTag(html, 'name', 'robots', seo.robots ?? 'index,follow,max-image-preview:large')
    html = setMetaTag(html, 'name', 'theme-color', '#0b1220')
    html = setMetaTag(html, 'property', 'og:title', fullTitle)
    html = setMetaTag(html, 'property', 'og:description', seo.description)
    html = setMetaTag(html, 'property', 'og:type', 'website')
    html = setMetaTag(html, 'property', 'og:url', url)
    html = setMetaTag(html, 'property', 'og:site_name', SITE_NAME)
    html = setMetaTag(html, 'property', 'og:image', SITE_IMAGE)
    html = setMetaTag(html, 'property', 'og:locale', 'es_CL')
    html = setMetaTag(html, 'name', 'twitter:card', 'summary')
    html = setMetaTag(html, 'name', 'twitter:title', fullTitle)
    html = setMetaTag(html, 'name', 'twitter:description', seo.description)
    html = setMetaTag(html, 'name', 'twitter:image', SITE_IMAGE)
    html = setCanonical(html, url)
    html = html.replace('<div id="root"></div>', `<div id="root">${bodyMarkup}</div>`)
    html = injectJsonLd(html, pathname)

    await fs.writeFile(routeFile(pathname), html)
  }

  console.log(`✅ Prerender estático generado para ${Object.keys(routeBodies).length} rutas`)
}

main().catch((error) => {
  console.error('❌ Error generando prerender estático:', error)
  process.exit(1)
})
