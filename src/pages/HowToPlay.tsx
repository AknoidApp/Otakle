import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
import '../App.css'

export default function HowToPlay() {
  return (
    <div className="otakle-page">
      <header className="page-header">
        <div className="page-title">
          <h1>Cómo se juega</h1>
          <p>Guía completa para entender las pistas, evitar errores comunes y jugar mejor desde el primer día.</p>
        </div>

        <div className="page-actions">
          <Link to="/play" className="btn-secondary">
            Ir a jugar
          </Link>
        </div>
      </header>

      <div className="page-card">
        <h2>Objetivo del reto diario</h2>
        <p>
          En <strong>Otakle</strong> el objetivo es adivinar el <strong>personaje del día</strong> en la menor cantidad de
          intentos posible. Todas las personas juegan la misma solución diaria, así que el reto se puede comparar,
          comentar y compartir sin perder el factor sorpresa.
        </p>

        <p>
          La gracia del juego no está en escribir nombres al azar hasta acertar, sino en leer las pistas con atención y
          usar cada intento para reducir el espacio de posibilidades. Incluso cuando fallas, una buena lectura de la
          información puede acercarte mucho a la respuesta correcta.
        </p>

        <h2>Reglas base</h2>
        <ul>
          <li>Tienes <strong>8 intentos</strong> como máximo cada día.</li>
          <li>Cada intento debe ser un personaje válido dentro del catálogo actual de Otakle.</li>
          <li>Después de enviar un personaje, verás una fila de pistas comparando tu elección con la solución.</li>
          <li>Si aciertas, ganas el día y puedes compartir tu resultado.</li>
          <li>Si gastas los 8 intentos sin acertar, el día se cierra igualmente y tu racha se corta.</li>
        </ul>

        <h2>Cómo se interpreta una fila de pistas</h2>
        <p>
          Cada fila compara atributos del personaje que elegiste contra el personaje del día. Algunas columnas te dirán si
          hubo coincidencia exacta y otras te darán dirección para seguir pensando. La clave es no mirar una pista de forma
          aislada, sino cruzar varias señales al mismo tiempo.
        </p>

        <h2>Qué significan los colores</h2>
        <ul>
          <li>
            <strong>Verde</strong>: ese atributo coincide con el personaje del día. Es una señal fuerte de que vas bien en
            esa categoría específica.
          </li>
          <li>
            <strong>Rojo</strong>: ese atributo no coincide. No significa que estés lejísimos en todo, solo que esa
            categoría concreta no calza.
          </li>
        </ul>

        <p>
          Si varias columnas salen verdes al mismo tiempo, normalmente ya estás cerca del tipo de personaje correcto. Si
          casi todo sale rojo, te conviene cambiar de franquicia, época o perfil narrativo en el siguiente intento.
        </p>

        <h2>Cómo leer la flecha del año de debut</h2>
        <p>
          La columna <strong>Año debut</strong> no solo te dice si coincidiste: también puede mostrar una dirección para
          ayudarte a acotar por época.
        </p>
        <ul>
          <li>
            <strong>✓</strong>: el personaje que elegiste debutó el mismo año que la solución.
          </li>
          <li>
            <strong>↑</strong>: el personaje del día debutó <strong>después</strong> que tu intento, así que debes pensar
            en alguien más reciente.
          </li>
          <li>
            <strong>↓</strong>: el personaje del día debutó <strong>antes</strong> que tu intento, así que conviene mirar
            personajes más antiguos.
          </li>
        </ul>

        <p>
          Esta pista suele ser una de las más potentes del juego porque te ayuda a cortar muchas opciones de una sola vez,
          especialmente cuando ya tienes una idea aproximada de la franquicia o del tipo de personaje.
        </p>

        <h2>Ejemplo de lectura de una ronda</h2>
        <p>
          Imagina que abres con un personaje muy conocido y obtienes anime en rojo, rol en verde y una flecha hacia arriba
          en año de debut. Esa combinación ya te dice bastante: probablemente no estás en la franquicia correcta, pero sí
          estás cerca del tipo de función narrativa, y además debes moverte hacia un personaje más reciente.
        </p>
        <p>
          En un caso así, el siguiente intento ideal no repite el mismo universo sin pensar. Conviene buscar otro personaje
          con rol parecido, pero de una serie más nueva o de otra época que te permita medir mejor el tablero. Jugar así es
          más útil que insistir con nombres casi gemelos solo porque te dieron una pista verde aislada.
        </p>

        <h2>Qué hace realmente el filtro por anime</h2>
        <p>
          El filtro por anime está pensado para facilitar la escritura y la búsqueda de personajes dentro del catálogo. No
          cambia la solución del día ni “abarata” automáticamente el reto. Su uso más sano es práctico: si ya sospechas de
          una serie concreta, el filtro te ayuda a escribir más rápido y evitar ruido al buscar nombres.
        </p>

        <p>
          Lo que no conviene hacer es tratar el filtro como si fuera una pista oficial del juego. Si lo usas para recorrer
          listas enteras sin una hipótesis, puedes terminar rompiendo tu propio proceso de deducción. Otakle funciona mejor
          cuando primero piensas y luego usas las herramientas de apoyo.
        </p>

        <h2>Orden recomendado para pensar una partida</h2>
        <ol>
          <li>Haz un primer intento relativamente conocido y fácil de ubicar por atributos.</li>
          <li>Mira qué categorías se acercaron y cuáles fallaron por completo.</li>
          <li>Usa el año de debut para decidir si debes ir hacia personajes más nuevos o más antiguos.</li>
          <li>Si el anime parece incorrecto, cambia de franquicia rápido en vez de insistir demasiado.</li>
          <li>Cuando ya tengas 2 o 3 categorías bien encaminadas, afina con personajes más específicos.</li>
        </ol>

        <h2>Errores comunes al empezar</h2>
        <ul>
          <li>Usar personajes demasiado parecidos entre sí y obtener información repetida.</li>
          <li>Ignorar la flecha del año de debut, que normalmente recorta muchísimo el rango.</li>
          <li>Confundir “rojo en una columna” con “todo mi intento fue inútil”.</li>
          <li>Quedarse atrapado en una sola serie cuando las pistas ya sugieren cambiar de eje.</li>
          <li>Gastar los últimos intentos en nombres impulsivos en vez de probar hipótesis concretas.</li>
        </ul>

        <h2>Cuándo cambia el personaje diario</h2>
        <p>
          Otakle reinicia el reto a las <strong>00:00 UTC</strong>. En Chile, eso normalmente cae a las{' '}
          <strong>21:00</strong> cuando el país está en UTC-3. Este horario unificado hace que el personaje del día sea el
          mismo para toda la comunidad, sin depender de la zona horaria local de cada jugador.
        </p>

        <h2>Rachas, historial y estadísticas</h2>
        <p>
          La racha aumenta cuando ganas días consecutivos. Si fallas un reto o te saltas un día, la racha se reinicia.
          Además, Otakle guarda información como estadísticas e historial de forma local en tu navegador, para que puedas
          revisar cómo vienes jugando sin tener que crear una cuenta obligatoria.
        </p>

        <h2>Qué hacer si no encuentras un personaje</h2>
        <p>
          Si un nombre no aparece, normalmente significa una de estas cosas: el personaje todavía no forma parte del
          catálogo, lo estás escribiendo con una variante distinta o la franquicia aún no tiene esa entrada cargada. En
          esos casos puedes probar otra forma de escritura, usar el filtro por serie o mandar una sugerencia a través de la
          página de <Link to="/contact">Contacto</Link>.
        </p>

        <h2>Si quieres ir un paso más allá</h2>
        <p>
          Esta guía cubre el funcionamiento del juego. Si lo que buscas es mejorar tu porcentaje de aciertos y aprender a
          tomar mejores decisiones con cada intento, te conviene seguir con la página de <Link to="/strategy">Estrategia</Link>,
          donde se explica cómo abrir una partida, cuándo conviene cambiar de franquicia y cómo aprovechar las pistas sin
          depender de búsquedas externas.
        </p>
      </div>

      <SiteFooter />
    </div>
  )
}
