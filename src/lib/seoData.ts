export const SITE_NAME = 'Otakle'
export const SITE_URL = 'https://www.otakle.app'
export const SITE_IMAGE = `${SITE_URL}/otakle-logo.png`
export const ADSENSE_ACCOUNT = 'ca-pub-6805458140116682'
export const DEFAULT_DESCRIPTION =
  'Otakle es un juego diario de anime con catálogo público, guías y contenido útil para adivinar personajes usando pistas de serie, rol, año, raza y más.'

export type SeoEntry = {
  title: string
  description: string
  keywords: string
  robots?: string
}

export const SEO_BY_PATH: Record<string, SeoEntry> = {
  '/': {
    title: 'Juego diario de anime, guías y catálogo público',
    description:
      'Descubre Otakle: un juego diario para adivinar personajes de anime, con guías, preguntas frecuentes y un catálogo público de series y personajes.',
    keywords:
      'otakle, juego diario anime, personajes de anime, catálogo anime, anime wordle, guía anime, guessing game anime',
  },
  '/play': {
    title: 'Jugar el reto diario de personajes de anime',
    description:
      'Juega el reto diario de Otakle e intenta adivinar el personaje de anime del día con un máximo de 8 intentos.',
    keywords: 'jugar otakle, reto diario anime, adivinar personaje anime, daily anime game',
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
  '/faq': {
    title: 'Preguntas frecuentes de Otakle',
    description:
      'Resuelve dudas sobre reglas, reinicios, modo easy, pistas, privacidad y funcionamiento general de Otakle.',
    keywords: 'faq otakle, preguntas frecuentes otakle, ayuda juego anime, soporte otakle',
  },
  '/animes': {
    title: 'Series de anime presentes en Otakle',
    description:
      'Explora las series y franquicias de anime incluidas en el catálogo actual de Otakle y revisa ejemplos de personajes por obra.',
    keywords: 'animes en otakle, series de anime, catálogo anime otakle, franquicias anime',
  },
  '/personajes': {
    title: 'Catálogo público de personajes',
    description:
      'Revisa el catálogo público de personajes de anime incluidos actualmente en Otakle, agrupados por serie.',
    keywords: 'personajes de anime, catálogo de personajes, lista de personajes otakle',
  },
  '/stats': {
    title: 'Tus estadísticas',
    description: 'Revisa tus estadísticas locales, rachas y distribución de intentos en Otakle.',
    keywords: 'estadisticas otakle, racha otakle, historial de juego anime',
    robots: 'noindex,follow',
  },
  '/archive': {
    title: 'Tu historial',
    description: 'Consulta tu historial local de partidas jugadas en Otakle.',
    keywords: 'historial otakle, archive otakle, partidas jugadas',
    robots: 'noindex,follow',
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

export function getStructuredData(pathname: string) {
  const seo = SEO_BY_PATH[pathname] ?? SEO_BY_PATH['/']
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

  if (pathname === '/play') {
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
        description: seo.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ]
  }

  if (pathname === '/' || pathname === '/animes' || pathname === '/personajes') {
    return [
      website,
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: seo.title,
        url: pageUrl,
        description: seo.description,
        inLanguage: 'es',
      },
    ]
  }

  if (pathname === '/how-to-play' || pathname === '/faq') {
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
        description: seo.description,
      },
    ]
  }

  return [
    website,
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seo.title,
      url: pageUrl,
      description: seo.description,
      inLanguage: 'es',
    },
  ]
}
