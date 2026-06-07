export type EditorialSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type EditorialPage = {
  path: string
  kicker: string
  title: string
  description: string
  intro: string[]
  sections: EditorialSection[]
}

export const EDITORIAL_PAGES: EditorialPage[] = [
  {
    path: '/como-leer-pistas-otakle',
    kicker: 'Guía de mecánicas',
    title: 'Cómo leer las pistas de Otakle sin desperdiciar intentos',
    description:
      'Guía pública para interpretar colores, año de debut, coincidencias parciales y señales que te ayudan a descartar personajes en Otakle.',
    intro: [
      'Una de las razones por las que Otakle se vuelve más interesante con el tiempo es que las pistas no solo te dicen “bien” o “mal”. Cada fila funciona como una comparación entre tu intento y el personaje correcto del día. Si aprendes a leer esa comparación con calma, los turnos dejan de sentirse aleatorios y empiezan a servir como herramientas reales de deducción.',
      'Esta guía está hecha para jugadores que ya entienden la idea general del reto, pero quieren convertir la información del tablero en decisiones mejores. No se trata de memorizar una respuesta, sino de aprender a separar ruido de señales útiles.',
    ],
    sections: [
      {
        heading: 'Empieza por leer el conjunto, no una pista aislada',
        paragraphs: [
          'El error más común al empezar en Otakle es obsesionarse con una sola columna. A veces una coincidencia de anime parece importantísima y una flecha del año parece secundaria, cuando en realidad la mejor lectura surge de cruzar ambas cosas. Una pista aislada rara vez resuelve el turno por sí sola.',
          'Cuando termines un intento, pregúntate primero qué perfil general deja esa fila: ¿te acerca a una franquicia concreta?, ¿te obliga a cambiar de época?, ¿te dice que el rol narrativo es otro? Esa lectura macro evita gastar dos o tres turnos en personajes demasiado parecidos.',
        ],
        bullets: [
          'Mira qué columnas coinciden juntas, no solo cuál se puso verde.',
          'Piensa si la fila te acerca a una serie o si te está empujando a salir de ella.',
          'Usa la combinación total para decidir el siguiente intento, no un dato suelto.',
        ],
      },
      {
        heading: 'Qué significan de verdad el verde y el rojo',
        paragraphs: [
          'El verde es una coincidencia exacta en esa categoría concreta. Eso no significa automáticamente que ya estés muy cerca del personaje final, pero sí marca una dirección fiable. Si varias columnas salen verdes, normalmente ya tienes un perfil bastante sólido.',
          'El rojo, en cambio, no significa que el intento haya sido inútil. Muchas veces una fila mayoritariamente roja es precisamente la que más valor tiene, porque te obliga a cerrar caminos enteros y te muestra que necesitas cambiar de eje en el próximo turno.',
        ],
        bullets: [
          'Verde = coincidencia exacta en esa categoría.',
          'Rojo = descarte útil, no fracaso total.',
          'Varias columnas verdes juntas pesan mucho más que una sola.',
        ],
      },
      {
        heading: 'La flecha del año de debut vale más de lo que parece',
        paragraphs: [
          'La columna de año de debut suele ser una de las herramientas más fuertes del juego porque reduce el universo temporal. Si la flecha apunta hacia arriba, el personaje del día es más reciente que tu intento. Si apunta hacia abajo, es más antiguo. Esa diferencia ayuda muchísimo cuando dudas entre franquicias clásicas, series de los 2000 o títulos mucho más nuevos.',
          'No la leas como un detalle cosmético. Si ya tienes una hipótesis de anime o de arquetipo, el año puede confirmar o destruir esa intuición en un solo movimiento.',
        ],
        bullets: [
          '↑ = la solución debutó después.',
          '↓ = la solución debutó antes.',
          '✓ = mismo año, pista fortísima para cerrar hipótesis.',
        ],
      },
      {
        heading: 'Cómo decidir el siguiente intento con información incompleta',
        paragraphs: [
          'Después de leer la fila, el mejor siguiente paso no siempre es probar al personaje “más cercano”. A veces conviene hacer justo lo contrario: jugar un personaje que cambie una variable importante para contrastar. Esa comparación te permite descubrir si estabas en la franquicia correcta pero con el rol equivocado, o si estabas atrapado en una época que ya no tiene sentido.',
          'La clave es que cada intento responda una pregunta clara. Si juegas sin formular esa pregunta, terminas gastando turnos en nombres impulsivos que solo te dejan información repetida.',
        ],
      },
      {
        heading: 'Cuándo una pista ya justifica cerrar la partida',
        paragraphs: [
          'En los últimos intentos la lógica cambia. Ya no necesitas explorar tanto: necesitas confirmar la hipótesis más sólida. Si varias categorías vienen alineadas y solo te queda una duda concreta, conviene elegir un personaje que mantenga casi todo lo correcto y cambie solo la pieza sospechosa.',
          'Ese tipo de cierre es mucho mejor que entrar en pánico y probar nombres al azar. La diferencia entre una racha estable y una racha rota suele estar en cómo administras esa fase final.',
        ],
      },
    ],
  },
  {
    path: '/guia-naruto-otakle',
    kicker: 'Franquicia destacada',
    title: 'Guía para reconocer personajes de Naruto en Otakle',
    description:
      'Claves públicas para diferenciar personajes de Naruto dentro de Otakle usando rol, época, generación y lógica de pistas comparativas.',
    intro: [
      'Naruto es una de las franquicias más fáciles de reconocer para muchos jugadores, pero también una de las que más puede engañar en Otakle. Justamente porque tiene personajes muy conocidos, es tentador quedarse atrapado en nombres obvios y repetir arquetipos demasiado parecidos.',
      'Esta guía sirve para jugar mejor cuando sospechas que el personaje del día pertenece al universo de Naruto. No busca listar todas las respuestas posibles, sino mostrar qué rasgos suelen ayudarte a separar generaciones, roles y perfiles narrativos dentro de la serie.',
    ],
    sections: [
      {
        heading: 'Piensa en generaciones antes que en favoritos',
        paragraphs: [
          'En Naruto ayuda mucho separar primero por generación: personajes asociados a la era de Kakashi, la de Naruto y Sasuke, o perfiles más antiguos vinculados a guerras, clanes y figuras de mentoría. Esa lectura temporal dialoga bien con la pista del año de debut.',
          'Si pruebas directamente un personaje muy famoso sin pensar qué generación representa, puedes obtener una pista útil, pero también puedes quedarte corto en contexto. La generación te da un marco más amplio para interpretar después el resto de columnas.',
        ],
      },
      {
        heading: 'El rol narrativo pesa bastante en esta franquicia',
        paragraphs: [
          'Naruto mezcla protagonistas, rivales, maestros, antagonistas y personajes de apoyo con una estructura bastante reconocible. Cuando una pista de rol no encaja, muchas veces conviene salir del triángulo típico de héroe-rival-mentor y explorar otra función dentro de la serie.',
          'Eso es importante porque varios personajes comparten universo y estética general, pero no ocupan el mismo lugar narrativo. Diferenciar esa función evita que juegues una cadena de intentos demasiado parecidos.',
        ],
        bullets: [
          'No todos los personajes relevantes son protagonistas o rivales directos.',
          'Los mentores y jefes de aldea suelen alterar bastante la lectura del perfil.',
          'Si el rol falla, no insistas de inmediato con alguien del mismo arquetipo.',
        ],
      },
      {
        heading: 'Aprovecha la lógica de clanes y equipos sin sobreconfiarte',
        paragraphs: [
          'Es normal que al pensar en Naruto aparezcan enseguida equipos o clanes muy reconocibles. Eso ayuda, pero también genera trampas. Si el personaje del día comparte anime pero no comparte la misma función o época, puedes malgastar intentos probando variaciones demasiado cercanas.',
          'La mejor forma de usar ese conocimiento es como mapa, no como piloto automático. Primero confirma si realmente estás dentro del tipo correcto de personaje; después afina con relaciones más específicas.',
        ],
      },
      {
        heading: 'Cuándo conviene salir de Naruto aunque una pista te lo sugiera',
        paragraphs: [
          'A veces una coincidencia parcial hace pensar que la solución debe ser de Naruto, pero las demás categorías cuentan otra historia. Si el año, el rol o el resto del perfil no acompaña, puede ser mejor abandonar la franquicia un turno y usar un personaje de otra serie para contrastar.',
          'Esa disciplina es útil porque Naruto, por popularidad, atrae muchas hipótesis equivocadas. Una buena partida no se gana por apego a una franquicia, sino por calidad de lectura.',
        ],
      },
    ],
  },
  {
    path: '/guia-one-piece-otakle',
    kicker: 'Franquicia destacada',
    title: 'Cómo distinguir personajes de One Piece en Otakle',
    description:
      'Guía pública para leer mejor las pistas cuando sospechas que el personaje del día pertenece a One Piece dentro de Otakle.',
    intro: [
      'One Piece suele aportar personajes muy memorables al catálogo de Otakle, pero también tiene una variedad enorme de perfiles. Eso significa que no basta con reconocer la serie: después necesitas separar capitanes, espadachines, villanos, apoyos, figuras de gobierno y personajes secundarios con peso narrativo real.',
      'Si aprendes a leer One Piece como un conjunto de arquetipos y épocas, las pistas empiezan a rendir mucho más. Esta guía está pensada para ayudarte a hacer justamente eso.',
    ],
    sections: [
      {
        heading: 'No reduzcas One Piece solo a Sombrero de Paja',
        paragraphs: [
          'Es normal arrancar con Luffy, Zoro o Shanks porque son nombres icónicos, pero One Piece tiene un ecosistema enorme de personajes relevantes. Si una columna te sugiere que sí estás dentro de la franquicia, todavía queda mucho trabajo para descubrir qué lugar ocupa la solución.',
          'Por eso conviene pensar en familias de personajes: tripulaciones, antagonistas, figuras legendarias, marines, revolucionarios o aliados. Ese mapa hace que el siguiente intento tenga intención y no sea simplemente “otro personaje famoso”.',
        ],
      },
      {
        heading: 'El perfil narrativo manda más que la popularidad',
        paragraphs: [
          'Muchos errores en One Piece vienen de reemplazar “personaje conocido” por “personaje probable”. No es lo mismo un protagonista central, un villano de arco, un mentor o una figura política del mundo. Cuando la pista de rol o de función narrativa se mueve, la respuesta correcta puede cambiar radicalmente aunque sigas dentro del mismo anime.',
          'Una buena jugada suele ser elegir un personaje que modifique justo esa función narrativa, para confirmar si estabas leyendo bien la estructura del tablero.',
        ],
      },
      {
        heading: 'La antigüedad de la franquicia vuelve importante el año de debut',
        paragraphs: [
          'One Piece tiene personajes introducidos en etapas muy distintas del manga y el anime. Eso hace que el año de debut te ayude mucho a saber si debes pensar en figuras más tempranas o en personajes asociados a etapas más nuevas de la obra.',
          'Aunque la pista temporal no resuelva todo por sí sola, sí puede recortar bastante el rango de nombres razonables.',
        ],
      },
      {
        heading: 'Cuándo conviene contrastar con otra serie',
        paragraphs: [
          'Si ya llevas uno o dos intentos dentro de One Piece y la información sigue ambigua, a veces es mejor salir un turno de la franquicia. Un contraste bien elegido con otra serie puede decirte si realmente estabas cerca o si solo te dejó llevar el reconocimiento inicial.',
          'Esa salida estratégica evita el clásico efecto túnel: creer que la respuesta tiene que estar en One Piece solo porque la serie es muy visible dentro del catálogo.',
        ],
      },
    ],
  },
  {
    path: '/guia-dragon-ball-otakle',
    kicker: 'Franquicia destacada',
    title: 'Guía para acertar personajes de Dragon Ball en Otakle',
    description:
      'Consejos públicos para reconocer mejor personajes de Dragon Ball en Otakle sin depender solo de nombres obvios o intuición rápida.',
    intro: [
      'Dragon Ball parece una franquicia sencilla para Otakle porque muchos personajes son ultra conocidos. Sin embargo, precisamente esa familiaridad puede jugarte en contra. Cuando todo te suena reconocible, es fácil entrar en un bucle de nombres obvios que comparten demasiados rasgos y apenas generan información nueva.',
      'Esta guía propone una lectura un poco más fría: usar las pistas para separar linajes, funciones y etapas de la franquicia en vez de girar siempre alrededor de los mismos protagonistas.',
    ],
    sections: [
      {
        heading: 'No juegues siempre dentro de la familia Saiyajin',
        paragraphs: [
          'Goku, Vegeta y Gohan son excelentes referencias iniciales, pero si después del primer intento sigues girando dentro del mismo círculo, muchas columnas van a repetirse. En una franquicia tan marcada por familias, transformaciones y relaciones cercanas, eso puede darte muy poco contraste.',
          'Si varias pistas fallan, conviene explorar otros perfiles: aliados, antagonistas, dioses, maestros o personajes humanos importantes. Lo valioso no es cuánto quieres al personaje, sino cuánto te ayuda a responder la pregunta del tablero.',
        ],
      },
      {
        heading: 'Usa el rol para separar héroes, rivales y figuras cósmicas',
        paragraphs: [
          'Dragon Ball cambia bastante cuando te sales del eje protagonista-rival y miras otras funciones narrativas. En Otakle eso importa porque el rol puede marcar una diferencia enorme entre un personaje terrenal, un enemigo de saga, un mentor o una figura superior con reglas distintas dentro del mundo.',
          'Si la solución no encaja con la lectura clásica de héroe de combate, probablemente debes abrir ese abanico y no insistir con otro peleador parecido.',
        ],
      },
      {
        heading: 'El año de debut ayuda a separar eras del anime',
        paragraphs: [
          'La pista temporal también pesa mucho en Dragon Ball porque la franquicia cruza varias etapas históricas del medio. Saber si el personaje es más antiguo o más nuevo cambia el tipo de respuesta que conviene explorar y te ayuda a distinguir si debes pensar en la base clásica de la obra o en incorporaciones posteriores.',
          'Cuando esa flecha contradice tu intuición, normalmente conviene confiar en la pista y no en el impulso.',
        ],
      },
      {
        heading: 'Qué hacer cuando ya sospechas la franquicia',
        paragraphs: [
          'Si varias columnas te confirman que probablemente estás en Dragon Ball, tu siguiente objetivo no es quedarte cerca, sino reducir variables. Cambia solo una o dos cosas por intento: por ejemplo, mantener la época pero cambiar el rol, o mantener el rol pero cambiar el tipo de personaje. Ese método permite cerrar la partida con mucha más precisión.',
        ],
      },
    ],
  },
  {
    path: '/animes-faciles-para-empezar-en-otakle',
    kicker: 'Guía para principiantes',
    title: 'Qué animes suelen ser más fáciles para empezar a jugar Otakle',
    description:
      'Resumen público de franquicias que suelen ser más accesibles para quienes recién empiezan a jugar Otakle y quieren aprender la lógica del reto.',
    intro: [
      'No todas las franquicias se sienten igual de accesibles cuando recién empiezas en Otakle. Algunas series tienen protagonistas y secundarios tan instalados en la cultura anime que ayudan mucho a entender la lógica del tablero, mientras que otras requieren una memoria más fina de roles, épocas o personajes menos obvios.',
      'Si estás entrando al juego por primera vez, una buena estrategia es usar franquicias muy reconocibles como terreno de aprendizaje. No porque te aseguren la respuesta, sino porque te permiten leer mejor qué información aportan las pistas.',
    ],
    sections: [
      {
        heading: 'Por qué conviene empezar con franquicias populares',
        paragraphs: [
          'Las franquicias populares reducen la fricción inicial. Es más fácil recordar quién es quién, identificar arquetipos y relacionar el personaje con su universo. Eso permite concentrarte en la lógica del juego sin gastar demasiada energía en rescatar nombres olvidados.',
          'Además, cuando el catálogo muestra varias entradas de una misma serie, también es más fácil aprender a comparar perfiles dentro de un mismo universo narrativo.',
        ],
      },
      {
        heading: 'Series que suelen servir como puerta de entrada',
        paragraphs: [
          'En general, franquicias como Dragon Ball, Naruto, One Piece, My Hero Academia o Kimetsu no Yaiba funcionan bien como base de aprendizaje porque sus personajes principales y secundarios tienen identidades muy marcadas. Eso vuelve más legibles las pistas y ayuda a entender por qué una fila te empuja hacia un perfil y no hacia otro.',
        ],
        bullets: [
          'Dragon Ball: ideal para reconocer arquetipos muy claros.',
          'Naruto: útil para practicar generación, rol y equipos.',
          'One Piece: buena para aprender a separar funciones dentro de una franquicia amplia.',
          'Kimetsu no Yaiba: accesible para jugadores que conocen anime más reciente.',
        ],
      },
      {
        heading: 'Qué aprender antes de subir la dificultad',
        paragraphs: [
          'Antes de meterte en series más densas o menos familiares, intenta dominar tres cosas: cómo leer el año de debut, cómo interpretar la combinación de colores y cómo evitar repetir personajes demasiado parecidos. Si controlas esas bases, el catálogo completo se vuelve mucho menos intimidante.',
          'Ahí es donde el modo easy también puede ayudar: no como muleta permanente, sino como espacio de entrenamiento para fijar la lectura del juego.',
        ],
      },
      {
        heading: 'La meta no es quedarte en lo fácil para siempre',
        paragraphs: [
          'Empezar con animes más reconocibles no significa limitarte. Lo ideal es usar esas franquicias como punto de apoyo hasta que entiendas la estructura del reto, y luego expandirte a series donde el conocimiento específico pesa más. Ese crecimiento es parte de la gracia de Otakle: no solo ganar más, sino leer mejor el anime como universo de referencias.',
        ],
      },
    ],
  },
  {
    path: '/como-explorar-catalogo-otakle',
    kicker: 'Catálogo público',
    title: 'Cómo usar el catálogo público de Otakle para descubrir animes y personajes',
    description:
      'Guía pública para entender qué ofrece el catálogo de Otakle, cómo leerlo y por qué sirve incluso fuera del reto diario.',
    intro: [
      'El catálogo público de Otakle no está pensado solo como una lista decorativa. Su función es mostrar de forma visible qué series y personajes ya forman parte del proyecto, ayudar a los jugadores a orientarse mejor y darle valor real al sitio incluso cuando no estás jugando la partida del día.',
      'Si llegaste por curiosidad, por una búsqueda sobre anime o porque quieres entender el alcance del juego, esta guía te explica cómo aprovechar mejor esa parte del sitio y qué tipo de información puedes sacar de ella.',
    ],
    sections: [
      {
        heading: 'Qué puedes ver en el catálogo aunque no juegues todavía',
        paragraphs: [
          'La sección pública de personajes y animes te deja ver qué franquicias están representadas, cuántas entradas activas tiene cada una y una muestra concreta de nombres ya presentes. Eso ya convierte a Otakle en algo más que una sola pantalla de juego, porque existe una capa navegable para explorar el contenido del proyecto.',
          'Para alguien nuevo, esa visibilidad también ayuda a calibrar expectativas: puedes entender si el sitio se mueve más en clásicos, shonen conocidos, series modernas o una mezcla amplia de referencias.',
        ],
      },
      {
        heading: 'Cómo leer la página de animes y la de personajes juntas',
        paragraphs: [
          'La página de animes funciona mejor como mapa general: te muestra cobertura por franquicia y volumen aproximado. La página de personajes, en cambio, sirve más como inventario público detallado de nombres activos. Usadas en conjunto, ambas páginas te permiten entender mejor la densidad del catálogo y el tipo de universo que maneja Otakle.',
          'Si quieres usar el catálogo para jugar mejor, conviene empezar por las franquicias con más presencia y luego pasar a personajes concretos. Si quieres usarlo para descubrir contenido, puedes hacer exactamente el recorrido contrario.',
        ],
        bullets: [
          'Animes = visión amplia del universo cubierto.',
          'Personajes = detalle concreto de las entradas activas.',
          'Guías editoriales = contexto para interpretar mejor lo que ves.',
        ],
      },
      {
        heading: 'Por qué este catálogo aporta valor editorial al sitio',
        paragraphs: [
          'Un catálogo visible demuestra que Otakle mantiene una base pública de contenido real, no solo una mecánica diaria aislada. Para visitantes, esto hace que el proyecto sea más fácil de entender. Para jugadores, crea un punto de apoyo concreto para revisar franquicias, recordar nombres y recorrer el universo disponible.',
          'Además, al conectarse con FAQ, guías por franquicia, contacto y páginas legales, el catálogo ayuda a que la web se perciba como un sitio completo y no solo como una prueba o una landing mínima.',
        ],
      },
      {
        heading: 'La mejor forma de seguir explorando después del catálogo',
        paragraphs: [
          'Si ya revisaste personajes o animes, el siguiente paso lógico es saltar a una guía de mecánicas o a una franquicia destacada. Esa conexión entre catálogo y contenido editorial es una de las claves de Otakle: no solo mirar nombres, sino aprender a interpretarlos dentro del juego diario.',
          'Por eso el catálogo funciona mejor cuando se recorre con intención. Puedes usarlo para estudiar, para descubrir series, para revisar cobertura o simplemente para entender qué tipo de reto propone Otakle antes de empezar a jugar.',
        ],
      },
    ],
  },
]

export const EDITORIAL_PAGES_BY_PATH = Object.fromEntries(EDITORIAL_PAGES.map((page) => [page.path, page])) as Record<
  string,
  EditorialPage
>
