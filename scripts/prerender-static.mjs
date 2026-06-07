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
import { EDITORIAL_PAGES } from '../src/lib/editorialData.ts'
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
  const sections = [
    {
      title: 'Juego',
      links: [
        anchor('/play', 'Jugar ahora', 'footer-link'),
        anchor('/how-to-play', 'Cómo se juega', 'footer-link'),
        anchor('/strategy', 'Estrategia', 'footer-link'),
        anchor('/faq', 'FAQ', 'footer-link'),
      ],
    },
    {
      title: 'Catálogo',
      links: [
        anchor('/animes', 'Animes', 'footer-link'),
        anchor('/personajes', 'Personajes', 'footer-link'),
        anchor('/stats', 'Estadísticas', 'footer-link'),
        anchor('/archive', 'Historial', 'footer-link'),
      ],
    },
    {
      title: 'Contenido',
      links: EDITORIAL_PAGES.map((page) => anchor(page.path, page.title, 'footer-link')),
    },
    {
      title: 'Proyecto',
      links: [
        anchor('/', 'Inicio', 'footer-link'),
        anchor('/about', 'Sobre Otakle', 'footer-link'),
        anchor('/contact', 'Contacto', 'footer-link'),
        anchor('/privacy', 'Privacidad', 'footer-link'),
        anchor('/terms', 'Términos', 'footer-link'),
      ],
    },
  ]

  return `
    <footer class="footer site-footer">
      <div class="site-footer-topline">
        <div>
          <p class="site-footer-kicker">Otakle · juego diario + guías + catálogo público</p>
          <h2 class="site-footer-title">Una base pública de contenido para fans del anime</h2>
          <p class="site-footer-copy">Además del reto diario, Otakle reúne páginas de ayuda, explicaciones de mecánicas, resúmenes de franquicias y recursos útiles para entender mejor cómo jugar.</p>
        </div>
        <div class="site-footer-contact">
          <a class="footer-link" href="${escapeHtml(SITE_X_URL)}" target="_blank" rel="noreferrer noopener">X ${escapeHtml(SITE_X_LABEL)}</a>
          <a class="footer-link" href="mailto:${escapeHtml(SITE_EMAIL)}">${escapeHtml(SITE_EMAIL)}</a>
        </div>
      </div>
      <div class="site-footer-grid">
        ${sections
          .map(
            (section) => `
              <section class="site-footer-section" aria-label="${escapeHtml(section.title)}">
                <h3>${escapeHtml(section.title)}</h3>
                <div class="site-footer-links">${section.links.join('')}</div>
              </section>
            `,
          )
          .join('')}
      </div>
      <div class="footer-note">Otakle by <strong>Aknoid</strong> · Proyecto fan con contenido público, catálogo visible y guías en español.</div>
    </footer>
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
  const editorialCards = EDITORIAL_PAGES.map(
    (page) => `
      <article class="directory-card editorial-link-card">
        <span class="mini-label">${escapeHtml(page.kicker)}</span>
        <h3>${escapeHtml(page.title)}</h3>
        <p>${escapeHtml(page.description)}</p>
        ${anchor(page.path, 'Leer guía', 'btn-secondary')}
      </article>
    `,
  ).join('')

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
          <h2>Un reto diario para fans del anime, con una capa pública real de contenido útil</h2>
          <p>Otakle combina la lógica de un juego diario tipo Wordle con una base pública de guías, preguntas frecuentes, catálogo de personajes, resúmenes por franquicia y páginas pensadas para que el sitio tenga valor incluso fuera de la partida del día.</p>
          <p>La idea es que puedas entrar a jugar, pero también volver para entender mejor las pistas, revisar qué animes están representados, descubrir personajes del catálogo actual y leer recursos hechos para mejorar tu lectura del reto.</p>
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
          <h2>Qué puedes hacer en Otakle</h2>
          <ul>
            <li>Jugar un personaje nuevo cada día con 8 intentos máximos.</li>
            <li>Aprender a leer pistas por anime, rol, año de debut, estudio, raza y edad.</li>
            <li>Consultar contenido público para mejorar tu tasa de acierto sin depender de búsquedas externas.</li>
          </ul>
        </article>
        <article class="page-card">
          <h2>Por qué esta web no es solo una landing</h2>
          <ul>
            <li>Incluye guías completas sobre mecánicas y estrategia.</li>
            <li>Tiene catálogo visible de personajes y series presentes en el juego.</li>
            <li>Reúne recursos por franquicia, preguntas frecuentes y páginas legales claras.</li>
          </ul>
        </article>
      </section>

      <section class="catalog-section">
        <div class="section-heading">
          <div>
            <span class="home-kicker">Guías destacadas</span>
            <h2>Recursos públicos para entender mejor el juego y sus franquicias</h2>
          </div>
        </div>
        <div class="directory-grid directory-grid-wide">${editorialCards}</div>
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

      <section class="page-grid">
        <article class="page-card notice-card">
          <h2>Señales de confianza del proyecto</h2>
          <ul>
            <li>Rutas públicas indexables con metadatos, sitemap y contenido informativo.</li>
            <li>Páginas visibles de contacto, privacidad, términos y descripción del proyecto.</li>
            <li>Catálogo público navegable con ${TOTAL_CHARACTERS} personajes activos, series visibles y material editorial relacionado.</li>
          </ul>
        </article>
        <article class="page-card">
          <h2>Explora Otakle sin jugar todavía</h2>
          <p>Si llegaste por curiosidad, la idea es que el sitio se entienda incluso fuera del gameplay. Puedes recorrer primero las guías, revisar la FAQ, mirar las series activas y después entrar al reto diario con más contexto.</p>
          <div class="chip-link-list">
            ${anchor('/about', 'Sobre Otakle', 'home-link-pill')}
            ${anchor('/faq', 'FAQ', 'home-link-pill')}
            ${anchor('/contact', 'Contacto', 'home-link-pill')}
            ${anchor('/privacy', 'Privacidad', 'home-link-pill')}
          </div>
        </article>
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
        <p><strong>Otakle</strong> es un juego diario de personajes de anime inspirado en la lógica de los retos tipo Wordle, pero adaptado a una experiencia más temática y comparativa. En vez de adivinar una palabra, aquí intentas descubrir el personaje del día usando pistas relacionadas con anime, rol narrativo, estudio, año de debut y otros atributos que ayudan a acotar opciones de forma progresiva.</p>
        <p>Además del reto interactivo, el sitio incluye catálogo público, guías, FAQ y páginas de contexto para que la web tenga valor incluso cuando no estás jugando una ronda. La idea es que el proyecto funcione como juego, pero también como base pública de contenido para fans del anime.</p>
        <h2>Qué hace distinto a Otakle</h2>
        <ul>
          <li>No depende solo de una imagen: mezcla pistas comparativas para premiar conocimiento y deducción.</li>
          <li>Todos reciben el mismo reto diario, lo que hace el resultado comparable y compartible.</li>
          <li>La capa pública del sitio ayuda a entender reglas, franquicias y lógica del catálogo.</li>
        </ul>
        <h2>Quién hace Otakle</h2>
        <p>Otakle es un proyecto creado por <strong>Aknoid</strong>, pensado para construir una experiencia original y consistente para fans del anime con contenido en español, contacto visible y crecimiento continuo del catálogo.</p>
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
          <p>Guía pública para entender reglas, colores, flechas, filtro por anime y hora de cambio del reto diario.</p>
        </div>
        <div class="page-actions">${anchor('/play', 'Ir a jugar', 'btn-primary')}</div>
      </header>
      <div class="page-card editorial-intro-card">
        <p>En Otakle el objetivo es adivinar el personaje del día en la menor cantidad de intentos posible. Todas las personas juegan la misma solución diaria, así que el reto se puede comparar, comentar y compartir sin perder el factor sorpresa.</p>
        <h2>Reglas básicas</h2>
        <ul>
          <li>Tienes 8 intentos por día.</li>
          <li>Cada intento compara tu personaje con la solución usando varias categorías.</li>
          <li>El reto cambia a las 00:00 UTC para toda la comunidad.</li>
        </ul>
        <h2>Cómo leer las pistas</h2>
        <ul>
          <li>Verde: coincide exactamente.</li>
          <li>Rojo: no coincide, pero sigue siendo un descarte útil.</li>
          <li>Año debut: ↑ indica que el personaje del día es más nuevo; ↓ indica que es más antiguo.</li>
        </ul>
        <p>El filtro por anime sirve para escribir y buscar más rápido dentro del catálogo, pero no cambia la solución del día. Si quieres profundizar en la toma de decisiones, la mejor continuación es la página de estrategia.</p>
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
      <div class="page-card editorial-intro-card">
        <p>La mejor forma de mejorar en Otakle es tratar cada intento como una herramienta para recoger información. No conviene jugar por suerte: conviene explorar, acotar y recién después cerrar la hipótesis más fuerte.</p>
        <h2>Consejos clave</h2>
        <ul>
          <li>Usa el primer intento para clasificar anime, rol y tipo de personaje.</li>
          <li>El año de debut suele ser una de las pistas más útiles para recortar opciones.</li>
          <li>No repitas personajes demasiado parecidos si ya sabes que el anime o el rol no coinciden.</li>
          <li>Con pocos intentos restantes, cambia solo una o dos variables para confirmar tu mejor hipótesis.</li>
        </ul>
        <p>La meta real no es solo ganar hoy, sino construir criterio para leer mejor las pistas en los días siguientes.</p>
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
          <p>Respuestas públicas sobre reglas, pistas, reinicios, modo easy, estadísticas locales, privacidad y funcionamiento general de Otakle.</p>
        </div>
        <div class="page-actions">${anchor('/play', 'Ir a jugar', 'btn-primary')}</div>
      </header>
      <section class="page-grid">
        <article class="page-card">
          <h2>Qué resuelve esta página</h2>
          <p>Esta FAQ está pensada para responder las dudas más comunes antes de que tengas que escribir por soporte. Si vienes por primera vez al sitio, aquí deberías poder entender qué es Otakle, cuántos intentos tienes, cómo se reinicia el reto y qué parte del historial se guarda solo en tu navegador.</p>
        </article>
        <article class="page-card">
          <h2>Cuándo conviene revisar otras guías</h2>
          <p>Si tu duda no es operativa sino estratégica, probablemente te convenga saltar luego a ${anchor('/how-to-play', 'cómo se juega')}, ${anchor('/strategy', 'estrategia')} o a las guías editoriales sobre lectura de pistas y franquicias destacadas.</p>
        </article>
      </section>
      <div class="faq-grid faq-grid-full">${cards}</div>
      <section class="page-card notice-card">
        <h2>Dudas frecuentes fuera del gameplay</h2>
        <ul>
          <li>Otakle no publica una tabla global de estadísticas personales; tus datos se guardan localmente.</li>
          <li>El catálogo puede crecer con el tiempo, así que personajes y franquicias visibles hoy no son el límite final.</li>
          <li>Si detectas una pista inconsistente o una ficha mal clasificada, lo más útil es reportar personaje, anime y captura.</li>
        </ul>
      </section>
      <div class="page-card">
        <h2>¿Todavía tienes dudas?</h2>
        <p>Si tu pregunta no aparece aquí, puedes revisar la guía completa de ${anchor('/how-to-play', 'cómo se juega')}, la página de ${anchor('/strategy', 'estrategia')}, la guía de ${anchor('/como-leer-pistas-otakle', 'cómo leer las pistas')} o escribir por la sección de ${anchor('/contact', 'contacto')}.</p>
      </div>
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
        <p>Serie representada con personajes activos en el juego diario y en el catálogo público. Esta muestra ayuda a entender qué nombres ya están cubiertos dentro de Otakle.</p>
        <div class="chip-link-list">${group.sampleNames.map((name) => `<span class="name-chip">${escapeHtml(name)}</span>`).join('')}</div>
      </article>
    `,
  ).join('')

  return `
    <div class="otakle-page">
      <header class="page-header">
        <div class="page-title">
          <h1>Animes incluidos en Otakle</h1>
          <p>Esta página resume las series y franquicias que actualmente forman parte del catálogo del juego. El listado sirve como referencia pública para ver el rango del contenido cubierto por Otakle y entender mejor qué tan amplio es el universo de personajes disponible.</p>
        </div>
        <div class="page-actions">
          ${anchor('/personajes', 'Ver personajes', 'btn-secondary')}
          ${anchor('/play', 'Jugar el reto diario', 'btn-primary')}
        </div>
      </header>
      <div class="page-grid">
        <article class="page-card">
          <h2>Resumen del catálogo</h2>
          <ul>
            <li><strong>${TOTAL_CHARACTERS}</strong> personajes activos.</li>
            <li><strong>${TOTAL_ANIMES}</strong> series o franquicias representadas.</li>
            <li>El catálogo se usa en búsquedas, sugerencias y retos diarios.</li>
          </ul>
        </article>
        <article class="page-card">
          <h2>Cómo leer esta página</h2>
          <p>Cada tarjeta muestra una serie presente en Otakle, la cantidad de personajes activos asociados y una muestra rápida de nombres ya disponibles dentro del juego. No es una wiki exhaustiva de cada franquicia, pero sí un directorio visible para entender la cobertura actual del proyecto.</p>
        </article>
      </div>
      <section class="page-card notice-card">
        <h2>Franquicias que ya tienen guías públicas</h2>
        <div class="chip-link-list">
          ${anchor('/guia-naruto-otakle', 'Guía de Naruto', 'home-link-pill')}
          ${anchor('/guia-one-piece-otakle', 'Guía de One Piece', 'home-link-pill')}
          ${anchor('/guia-dragon-ball-otakle', 'Guía de Dragon Ball', 'home-link-pill')}
          ${anchor('/animes-faciles-para-empezar-en-otakle', 'Animes fáciles para empezar', 'home-link-pill')}
        </div>
      </section>
      <div class="directory-grid directory-grid-wide">${cards}</div>
      <section class="page-card">
        <h2>Por qué esta página importa para el sitio</h2>
        <p>Más allá del juego diario, este directorio deja claro que Otakle tiene un catálogo visible y mantenido. Sirve para visitantes nuevos, para jugadores que quieren saber si una franquicia ya está representada y para mostrar que el proyecto tiene una base pública de contenido más amplia que una simple pantalla de juego.</p>
      </section>
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
            <p class="brand-subtitle">Canales oficiales para soporte, feedback y sugerencias del proyecto</p>
          </div>
        </div>
        <div class="topbar-actions">${anchor('/play', 'Ir a jugar', 'btn-secondary')}</div>
      </header>
      <div class="legal-content">
        <p>Si quieres reportar un bug, sugerir personajes, dar feedback sobre el juego o consultar algo sobre privacidad, anuncios y funcionamiento del sitio, estos son los canales oficiales de contacto de Otakle.</p>
        <p>La idea de esta página es que cualquier visitante pueda identificar con claridad quién recibe los mensajes del proyecto y qué tipo de consultas sí tienen sentido aquí. No es solo una página de cumplimiento: también es una vía real para mejorar el catálogo y detectar problemas del juego.</p>
        <h2>Email</h2>
        <p><a href="mailto:${escapeHtml(SITE_EMAIL)}">${escapeHtml(SITE_EMAIL)}</a></p>
        <p>El correo es el mejor canal si quieres mandar comentarios largos, adjuntar capturas o dejar una explicación más completa de un error, propuesta o duda de privacidad.</p>
        <h2>X (Twitter)</h2>
        <p><a href="${escapeHtml(SITE_X_URL)}" target="_blank" rel="noreferrer noopener">${escapeHtml(SITE_X_LABEL)}</a></p>
        <p>X sirve mejor para avisos rápidos, feedback corto o sugerencias puntuales sobre personajes, series y mejoras del juego diario.</p>
        <h2>Qué puedes escribirnos</h2>
        <ul>
          <li>Sugerencias de personajes o series que te gustaría ver en Otakle.</li>
          <li>Errores visuales, pistas incoherentes o problemas con el personaje del día.</li>
          <li>Dudas sobre privacidad, publicidad, indexación o funcionamiento general del sitio.</li>
          <li>Comentarios sobre guías públicas, catálogo o utilidad editorial de las páginas informativas.</li>
        </ul>
        <h2>Qué incluir en tu mensaje</h2>
        <ul>
          <li>Dispositivo / navegador (por ejemplo: iPhone + Safari, Android + Chrome).</li>
          <li>Qué estabas haciendo y qué esperabas que pasara.</li>
          <li>El nombre del personaje o anime si el problema está en el catálogo.</li>
          <li>Captura de pantalla si aplica.</li>
          <li>URL exacta si el problema ocurre en una página pública concreta.</li>
        </ul>
        <h2>Antes de escribir</h2>
        <p>Si tu duda es sobre reglas, reinicio diario o lectura de pistas, puede que ya esté respondida en ${anchor('/faq', 'FAQ')}, ${anchor('/how-to-play', 'cómo se juega')} o ${anchor('/strategy', 'estrategia')}. Si aun así algo no cuadra, escríbenos con contexto y lo revisamos.</p>
      </div>
      ${footerLinks()}
    </div>
  `
}

function editorialBody(page) {
  const sectionCards = page.sections
    .map(
      (section) => `
        <article class="page-card editorial-section-card">
          <h2>${escapeHtml(section.heading)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
          ${section.bullets ? `<ul>${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>` : ''}
        </article>
      `,
    )
    .join('')

  return `
    <div class="otakle-page">
      <header class="page-header">
        <div class="page-title">
          <span class="home-kicker">${escapeHtml(page.kicker)}</span>
          <h1>${escapeHtml(page.title)}</h1>
          <p>${escapeHtml(page.description)}</p>
        </div>
        <div class="page-actions">
          ${anchor('/play', 'Ir a jugar', 'btn-primary')}
          ${anchor('/faq', 'Ver FAQ', 'btn-secondary')}
        </div>
      </header>
      <section class="page-card editorial-intro-card">${page.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>
      <section class="directory-grid directory-grid-wide editorial-grid">${sectionCards}</section>
      <section class="page-card notice-card">
        <h2>Más recursos públicos de Otakle</h2>
        <div class="chip-link-list">
          ${anchor('/how-to-play', 'Cómo se juega', 'home-link-pill')}
          ${anchor('/strategy', 'Estrategia', 'home-link-pill')}
          ${anchor('/animes', 'Animes incluidos', 'home-link-pill')}
          ${anchor('/personajes', 'Catálogo de personajes', 'home-link-pill')}
        </div>
      </section>
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
  ...Object.fromEntries(EDITORIAL_PAGES.map((page) => [page.path, () => editorialBody(page)])),
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
  return path.join(DIST_DIR, pathname.slice(1), 'index.html')
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

    const outputPath = routeFile(pathname)
    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, html)
  }

  console.log(`✅ Prerender estático generado para ${Object.keys(routeBodies).length} rutas`)
}

main().catch((error) => {
  console.error('❌ Error generando prerender estático:', error)
  process.exit(1)
})
