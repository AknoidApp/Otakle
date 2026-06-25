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
          <h2 class="site-footer-title">Un sitio para jugar, consultar y volver con más contexto</h2>
          <p class="site-footer-copy">Además del reto diario, Otakle reúne reglas, estrategia, directorios públicos y guías sobre franquicias, errores comunes y lectura del catálogo.</p>
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
      <div class="footer-note">Otakle by <strong>Aknoid</strong> · Proyecto fan en español con juego diario, catálogo visible y guías públicas.</div>
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
        <p>Algunas entradas de esta serie dentro de Otakle: <strong>${escapeHtml(group.sampleNames.join(', '))}</strong>.</p>
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
  const editorialCards = EDITORIAL_PAGES.slice(0, 8)
    .map(
      (page) => `
        <article class="directory-card editorial-link-card">
          <span class="mini-label">${escapeHtml(page.kicker)}</span>
          <h3>${escapeHtml(page.title)}</h3>
          <p>${escapeHtml(page.description)}</p>
          ${anchor(page.path, 'Leer guía', 'btn-secondary')}
        </article>
      `,
    )
    .join('')

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
          <h2>Un reto diario de anime con reglas claras, catálogo visible y guías públicas para jugar mejor</h2>
          <p>Otakle es un juego diario donde intentas descubrir el personaje del día usando pistas comparativas como anime, rol narrativo, demografía, año de debut, estudio, género, raza y otros atributos. La gracia está en deducir, no en disparar nombres al azar.</p>
          <p>Además del reto, el sitio incluye páginas públicas para entender cómo funciona el juego, qué franquicias están representadas, qué personajes forman parte del catálogo actual y qué estrategias suelen dar mejores resultados.</p>
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
            <li>Revisar guías públicas para mejorar tus decisiones sin depender de búsquedas externas.</li>
            <li>Explorar un catálogo visible de series y personajes ya presentes en el proyecto.</li>
          </ul>
        </article>
        <article class="page-card">
          <h2>Si es tu primera visita, empieza por aquí</h2>
          <p>La forma más simple de entender Otakle es esta: primero mira ${anchor('/how-to-play', 'cómo se juega')}, después revisa la ${anchor('/strategy', 'estrategia')} básica y luego entra al reto diario. Si prefieres curiosear antes de jugar, puedes recorrer la página de ${anchor('/animes', 'animes')} o el ${anchor('/personajes', 'catálogo de personajes')}.</p>
          <div class="chip-link-list">
            ${anchor('/how-to-play', 'Reglas', 'home-link-pill')}
            ${anchor('/strategy', 'Estrategia', 'home-link-pill')}
            ${anchor('/faq', 'FAQ', 'home-link-pill')}
            ${anchor('/about', 'Sobre el proyecto', 'home-link-pill')}
          </div>
        </article>
      </section>

      <section class="catalog-section">
        <div class="section-heading">
          <div>
            <span class="home-kicker">Guías destacadas</span>
            <h2>Recursos públicos para entender mejor el juego, el catálogo y las franquicias</h2>
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
            <h2>Personajes destacados que ya forman parte de Otakle</h2>
          </div>
          ${anchor('/personajes', 'Ver catálogo completo', 'btn-secondary')}
        </div>
        <div class="character-showcase-grid">${characterCards}</div>
      </section>

      <section class="page-grid">
        <article class="page-card notice-card">
          <h2>Qué encontrarás fuera del tablero</h2>
          <ul>
            <li>Rutas públicas indexables con contenido informativo y navegación clara.</li>
            <li>Páginas visibles de contacto, privacidad, términos y descripción del proyecto.</li>
            <li>Guías prácticas sobre aperturas, errores comunes y lectura del catálogo.</li>
            <li>Un catálogo público navegable con ${TOTAL_CHARACTERS} personajes activos y ${TOTAL_ANIMES} franquicias representadas.</li>
          </ul>
        </article>
        <article class="page-card">
          <h2>Explora Otakle a tu ritmo</h2>
          <p>Puedes llegar aquí por ganas de jugar, por curiosidad sobre anime o simplemente porque quieres ver qué series y personajes forman parte del proyecto. La idea es que el sitio se entienda también como directorio y como guía, no solo como una partida diaria de un minuto.</p>
          <div class="chip-link-list">
            ${anchor('/about', 'Sobre Otakle', 'home-link-pill')}
            ${anchor('/faq', 'FAQ', 'home-link-pill')}
            ${anchor('/contact', 'Contacto', 'home-link-pill')}
            ${anchor('/privacy', 'Privacidad', 'home-link-pill')}
            ${anchor('/terms', 'Términos', 'home-link-pill')}
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
          <p>Qué es el proyecto, cómo funciona el reto diario, cómo crece el catálogo y para quién está hecho.</p>
        </div>
        <div class="page-actions">${anchor('/play', 'Ir a jugar', 'btn-primary')}</div>
      </header>
      <div class="legal-content">
        <p><strong>Otakle</strong> es un juego diario de personajes de anime inspirado en la lógica de los retos tipo Wordle, pero adaptado a una experiencia más temática y comparativa. En vez de adivinar una palabra, aquí intentas descubrir el personaje del día usando pistas relacionadas con anime, rol narrativo, demografía, estudio, año de debut, género, raza y otros atributos que ayudan a acotar opciones de forma progresiva.</p>
        <p>El objetivo del proyecto es ofrecer una experiencia breve y clara para fans del anime, pero también un espacio público donde el catálogo, las guías y las páginas informativas tengan utilidad por sí mismos. Puedes llegar a Otakle para jugar una ronda, para revisar qué series están presentes o para entender mejor cómo se interpretan las pistas del tablero.</p>
        <h2>Qué hace distinto a Otakle</h2>
        <ul>
          <li><strong>No depende solo de imágenes.</strong> El juego premia conocimiento, memoria y deducción más que reconocimiento visual instantáneo.</li>
          <li><strong>Todos comparten el mismo reto del día.</strong> Eso hace que el resultado sea comparable y fácil de comentar.</li>
          <li><strong>Las pistas tienen contexto.</strong> Varias columnas ayudan a entender si vas cerca o si necesitas cambiar de enfoque.</li>
          <li><strong>El sitio tiene una capa pública visible.</strong> Guías, FAQ, catálogo y páginas por franquicia ayudan a entender mejor el proyecto.</li>
        </ul>
        <h2>Para quién está hecho</h2>
        <p>Otakle está pensado para personas que disfrutan el anime como hobby cotidiano: quienes reconocen personajes, recuerdan arcos y disfrutan comparar obras distintas. También funciona para gente que no quiere una experiencia demasiado demandante: una ronda diaria, ocho intentos y la posibilidad de volver al día siguiente.</p>
        <p>Si alguna vez te ha gustado discutir cosas como “qué personaje era de tal estudio”, “de qué época salió este protagonista” o “cuál franquicia tiene más peso en un catálogo”, entonces la lógica de Otakle probablemente te va a resultar natural.</p>
        <h2>Cómo está construido el reto diario</h2>
        <p>Cada día existe un personaje objetivo que todos los jugadores intentan adivinar. Los intentos generan filas de comparación que muestran coincidencias o diferencias entre tu elección y la solución del día. Algunas columnas son exactas; otras, como <strong>año de debut</strong>, entregan una dirección que te permite saber si debes pensar en un personaje más antiguo o más reciente.</p>
        <p>El diseño del reto busca equilibrar rapidez, claridad y rejugabilidad diaria. Por eso también existen páginas públicas de apoyo como ${anchor('/how-to-play', 'Cómo se juega')}, ${anchor('/strategy', 'Estrategia')}, ${anchor('/faq', 'FAQ')}, ${anchor('/animes', 'Animes')} y ${anchor('/personajes', 'Personajes')}.</p>
        <h2>Cómo crece el catálogo</h2>
        <p>La meta es representar franquicias populares, personajes icónicos y perfiles que permitan variedad real en las pistas. No se trata solo de acumular nombres: importa que el conjunto sea jugable, que existan contrastes útiles entre personajes y que las categorías hagan que la deducción sea interesante.</p>
        <p>También importa que una serie aporte varios ángulos de lectura: protagonistas, rivales, mentores, villanos, apoyos o generaciones distintas. Esa mezcla es la que vuelve el reto más rico.</p>
        <h2>Quién hace Otakle</h2>
        <p>Otakle es un proyecto creado por <strong>Aknoid</strong>. La intención es construir una experiencia original y consistente para fans del anime, con un juego diario entretenido, un catálogo público visible y una capa editorial en español que ayude a entender mejor el sistema de pistas y la cobertura del proyecto.</p>
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
          <p>Guía completa para entender las pistas, evitar errores comunes y jugar mejor desde el primer día.</p>
        </div>
        <div class="page-actions">${anchor('/play', 'Ir a jugar', 'btn-primary')}</div>
      </header>
      <div class="page-card editorial-intro-card">
        <p>En Otakle el objetivo es adivinar el personaje del día en la menor cantidad de intentos posible. Todas las personas juegan la misma solución diaria, así que el reto se puede comparar, comentar y compartir sin perder el factor sorpresa.</p>
        <p>La gracia del juego no está en escribir nombres al azar hasta acertar, sino en leer las pistas con atención y usar cada intento para reducir el espacio de posibilidades.</p>
        <h2>Reglas base</h2>
        <ul>
          <li>Tienes 8 intentos como máximo cada día.</li>
          <li>Cada intento debe ser un personaje válido dentro del catálogo actual de Otakle.</li>
          <li>Después de enviar un personaje, verás una fila de pistas comparando tu elección con la solución.</li>
          <li>Si aciertas, ganas el día y puedes compartir tu resultado.</li>
        </ul>
        <h2>Qué significan los colores y la flecha del año</h2>
        <ul>
          <li><strong>Verde</strong>: ese atributo coincide con el personaje del día.</li>
          <li><strong>Rojo</strong>: ese atributo no coincide, pero sigue siendo un descarte útil.</li>
          <li><strong>↑</strong>: el personaje del día debutó después que tu intento.</li>
          <li><strong>↓</strong>: el personaje del día debutó antes que tu intento.</li>
          <li><strong>✓</strong>: ambos comparten el mismo año de debut.</li>
        </ul>
        <h2>Ejemplo de lectura rápida</h2>
        <p>Si abres con un personaje muy conocido y obtienes anime en rojo, rol en verde y una flecha hacia arriba en año de debut, ya sabes bastante: probablemente no estás en la franquicia correcta, pero sí cerca del tipo de función narrativa, y además debes moverte hacia un personaje más reciente.</p>
        <p>En ese caso conviene elegir después un personaje que mantenga la idea de rol, pero cambie de universo o de época. Jugar así da mucha más información que insistir con nombres casi idénticos.</p>
        <h2>Qué hace realmente el filtro por anime</h2>
        <p>El filtro por anime sirve para escribir y buscar más rápido dentro del catálogo. No cambia la solución del día. Si quieres profundizar en la toma de decisiones, la mejor continuación es la página de estrategia.</p>
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
          <li>Usa el primer intento como sonda, no como apuesta final.</li>
          <li>El año de debut suele ser una de las pistas más útiles para recortar opciones.</li>
          <li>No repitas personajes demasiado parecidos si ya sabes que el anime o el rol no coinciden.</li>
          <li>Con pocos intentos restantes, cambia solo una o dos variables para confirmar tu mejor hipótesis.</li>
        </ul>
        <h2>Dos aperturas que suelen funcionar</h2>
        <p>Puedes arrancar con un personaje icónico de una franquicia muy representada para medir serie, época y rol, o con un perfil muy claro en términos narrativos aunque no sea tu favorito. En ambos casos la meta es producir lectura útil, no apostar a la casualidad.</p>
        <h2>Qué hacer en los intentos del medio</h2>
        <p>Los intentos 3 a 5 son donde más importa el método. Ahí ya no estás completamente a ciegas, pero tampoco conviene casarte con una sola respuesta. Lo ideal es cambiar una o dos variables importantes sin destruir la información que ya recogiste.</p>
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
            <p class="brand-subtitle">Última actualización: 2026-06-24</p>
          </div>
        </div>
        <div class="topbar-actions">${anchor('/play', 'Ir a jugar', 'btn-secondary')}</div>
      </header>
      <div class="legal-content">
        <p>Esta política explica qué información utiliza Otakle para funcionar, qué parte del progreso se guarda en tu navegador y cómo se relaciona el sitio con terceros como servicios de analítica o publicidad, cuando corresponda.</p>
        <h2>Qué datos guarda Otakle</h2>
        <ul>
          <li><strong>Progreso del reto diario:</strong> intentos del día, estado de la partida y si resolviste o no el personaje.</li>
          <li><strong>Estadísticas locales:</strong> racha actual, mejor racha y distribución de intentos, cuando aplique.</li>
          <li><strong>Historial local:</strong> datos de partidas guardados para que puedas revisar tu progreso desde tu mismo navegador.</li>
        </ul>
        <h2>Dónde se guarda esa información</h2>
        <p>El sitio utiliza almacenamiento local del navegador, por ejemplo <strong>LocalStorage</strong>, para mantener tu progreso y tus estadísticas. Esa información suele quedarse en tu dispositivo y puede desaparecer si borras los datos del navegador o cambias de equipo.</p>
        <h2>Cookies, almacenamiento similar y publicidad</h2>
        <p>Otakle puede funcionar sin cookies estrictamente necesarias para la lógica principal del juego, pero algunos componentes de terceros pueden usar cookies, almacenamiento local o identificadores similares para tareas como medición, seguridad o publicidad.</p>
        <p>Si el sitio muestra anuncios mediante Google AdSense u otro proveedor similar, esos servicios pueden recopilar o inferir información técnica del navegador para servir anuncios o medir rendimiento según sus propias políticas.</p>
        <h2>Enlaces a terceros</h2>
        <p>El sitio puede enlazar a plataformas externas como X/Twitter. Cuando sales de Otakle, las políticas aplicables pasan a ser las de cada plataforma externa.</p>
        <h2>Tus opciones como usuario</h2>
        <ul>
          <li>Puedes borrar el almacenamiento local del navegador para reiniciar progreso, historial o estadísticas.</li>
          <li>Puedes usar navegación privada si prefieres no conservar datos locales después de la sesión.</li>
          <li>Puedes revisar la configuración de cookies y anuncios de tu navegador o de tu cuenta de Google si aplica.</li>
        </ul>
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
            <p class="brand-subtitle">Última actualización: 2026-06-24</p>
          </div>
        </div>
        <div class="topbar-actions">${anchor('/play', 'Ir a jugar', 'btn-secondary')}</div>
      </header>
      <div class="legal-content">
        <p>Al usar Otakle aceptas estos términos. Si no estás de acuerdo con ellos, por favor no utilices el sitio ni sus secciones asociadas.</p>
        <h2>Qué es Otakle</h2>
        <p>Otakle es un proyecto fan orientado a ofrecer un juego diario de personajes de anime, junto con catálogo público, guías, FAQ y páginas informativas relacionadas con el funcionamiento del sitio.</p>
        <h2>Uso permitido</h2>
        <ul>
          <li>El uso del sitio es personal, no exclusivo y revocable.</li>
          <li>No intentes interferir con el funcionamiento del servicio mediante spam, abuso, ataques o automatizaciones.</li>
          <li>No automatices intentos masivos ni scraping que afecte rendimiento, estabilidad o disponibilidad.</li>
        </ul>
        <h2>Disponibilidad del servicio</h2>
        <p>Otakle se ofrece tal cual. El proyecto puede modificarse, pausarse o discontinuarse total o parcialmente en cualquier momento, con o sin aviso previo.</p>
        <h2>Propiedad intelectual y referencias a franquicias</h2>
        <p>Los nombres de series, personajes, marcas, estudios y franquicias mencionados en el sitio pertenecen a sus respectivos titulares. Su presencia en Otakle tiene fines informativos, descriptivos y lúdicos dentro del contexto del juego y de las guías públicas.</p>
        <h2>Conducta no permitida</h2>
        <ul>
          <li>Intentar vulnerar el sitio, sus APIs, sus rutas estáticas o sus recursos de terceros.</li>
          <li>Usar bots o automatizaciones que generen carga abusiva o falseen la interacción normal del juego.</li>
          <li>Copiar o redistribuir partes del sitio de forma engañosa atribuyéndolas como oficiales.</li>
        </ul>
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
        <p>La idea de esta página es que cualquier visitante pueda identificar con claridad quién recibe los mensajes del proyecto, qué tipo de consultas tienen sentido aquí y qué contexto ayuda a revisar un problema más rápido.</p>
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
          <li>Comentarios sobre guías públicas, catálogo o utilidad de las páginas informativas.</li>
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
          <p><strong>Por ${escapeHtml(page.author)}</strong> · Actualizado el ${escapeHtml(page.updatedAt)}</p>
        </div>
        <div class="page-actions">
          ${anchor('/play', 'Ir a jugar', 'btn-primary')}
          ${anchor('/faq', 'Ver FAQ', 'btn-secondary')}
        </div>
      </header>
      <section class="page-card editorial-intro-card">${page.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>
      <section class="directory-grid directory-grid-wide editorial-grid">${sectionCards}</section>
      <section class="page-card notice-card">
        <h2>Sigue explorando Otakle</h2>
        <p>Si esta guía te ayudó, el mejor siguiente paso depende de lo que quieras hacer: entender mejor las reglas, estudiar el catálogo o revisar franquicias concretas antes de volver al reto diario.</p>
        <div class="chip-link-list">
          ${anchor('/how-to-play', 'Cómo se juega', 'home-link-pill')}
          ${anchor('/strategy', 'Estrategia', 'home-link-pill')}
          ${anchor('/animes', 'Animes incluidos', 'home-link-pill')}
          ${anchor('/personajes', 'Catálogo de personajes', 'home-link-pill')}
          ${anchor('/contact', 'Contacto', 'home-link-pill')}
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
