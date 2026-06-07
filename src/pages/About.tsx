import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
import '../App.css'

export default function About() {
  return (
    <div className="otakudle-container">
      <header className="topbar">
        <div className="brand">
          <div className="brand-left">
            <img className="brand-logo" src="/otakle-logo.png" alt="Otakle" />
            <div className="brand-text">
              <div className="title-row">
                <h1 className="brand-title">Sobre Otakle</h1>
                <span className="daily-badge">Proyecto</span>
              </div>
              <p className="brand-subtitle">Qué es, para quién está hecho y por qué existe este reto diario de anime</p>
            </div>
          </div>

          <div className="topbar-actions">
            <Link to="/play" className="howto-button">
              Ir a jugar
            </Link>
          </div>
        </div>
      </header>

      <div className="legal-content">
        <p>
          <strong>Otakle</strong> es un juego diario de personajes de anime inspirado en la lógica de los retos tipo Wordle,
          pero adaptado a una experiencia más temática y comparativa. En vez de adivinar una palabra, aquí intentas
          descubrir el <strong>personaje del día</strong> usando pistas relacionadas con anime, rol narrativo, demografía,
          estudio, año de debut, género, raza y otros atributos que ayudan a acotar opciones de forma progresiva.
        </p>

        <p>
          La idea detrás del proyecto es simple: que exista un espacio donde un fan del anime pueda entrar cada día,
          jugar una partida corta, comparar pistas de manera clara y además explorar un catálogo público de personajes y
          franquicias. Otakle no busca ser solo “un jueguito diario”, sino también una puerta de entrada a contenido
          consultable, útil y entretenido para quienes disfrutan reconocer personajes, recordar series y hablar de anime.
        </p>

        <h2>Qué hace distinto a Otakle</h2>
        <ul>
          <li>
            <strong>No depende solo de imágenes.</strong> El foco está en interpretar atributos y relaciones, así que el
            juego premia conocimiento, memoria y deducción más que reflejos o reconocimiento visual instantáneo.
          </li>
          <li>
            <strong>Todos comparten el mismo reto del día.</strong> Eso hace que el resultado sea comparable, comentable y
            fácil de compartir con otras personas sin perder la gracia del desafío.
          </li>
          <li>
            <strong>Las pistas tienen contexto.</strong> No es una respuesta binaria sin más: varios atributos ayudan a
            entender si vas cerca, si estás en la franquicia correcta o si necesitas cambiar radicalmente de enfoque.
          </li>
          <li>
            <strong>Existe una capa pública útil alrededor del juego.</strong> Guías, FAQ, catálogo de personajes y páginas
            por franquicia hacen que el sitio tenga valor incluso cuando no estás jugando una ronda en ese momento.
          </li>
        </ul>

        <h2>Para quién está hecho</h2>
        <p>
          Otakle está pensado para personas que disfrutan el anime como hobby cotidiano: quienes reconocen personajes,
          recuerdan arcos, relacionan estudios con estilos y disfrutan comparar obras distintas. También funciona para
          gente que no quiere una experiencia demasiado demandante: una ronda diaria, ocho intentos, una lógica clara y
          la posibilidad de volver al día siguiente.
        </p>

        <p>
          Si alguna vez te ha gustado discutir cosas como “qué personaje era de tal estudio”, “de qué época salió este
          protagonista” o “cuál franquicia tiene más peso en un catálogo”, entonces la lógica de Otakle probablemente te
          va a resultar natural. El juego está hecho para fans, pero intenta mantenerse comprensible también para alguien
          que quiera aprender a leer las pistas y mejorar con la práctica.
        </p>

        <h2>Cómo está construido el reto diario</h2>
        <p>
          Cada día existe un personaje objetivo que todos los jugadores intentan adivinar. Los intentos generan filas de
          comparación que muestran coincidencias o diferencias entre tu elección y la solución del día. Algunas columnas
          son exactas; otras, como <strong>año de debut</strong>, entregan una dirección que te permite saber si debes
          pensar en un personaje más antiguo o más reciente.
        </p>

        <p>
          El diseño del reto busca equilibrar tres cosas: rapidez, claridad y rejugabilidad diaria. La idea no es obligar
          a buscar información externa a cada rato, sino darte suficientes señales para que puedas razonar una respuesta.
          Por eso también existen páginas públicas de apoyo como <Link to="/how-to-play">Cómo se juega</Link>,{' '}
          <Link to="/strategy">Estrategia</Link>, <Link to="/faq">FAQ</Link>, <Link to="/animes">Animes</Link> y{' '}
          <Link to="/personajes">Personajes</Link>.
        </p>

        <h2>Qué tipo de experiencia quiere ofrecer</h2>
        <p>
          Otakle apunta a una experiencia diaria breve, pero no desechable. La gracia no es solo acertar o fallar, sino
          sentir que cada intento entrega información valiosa. Un buen juego diario necesita una curva clara: entrar
          rápido, entender por qué una pista importa, tomar una decisión y tener ganas de volver mañana. Por eso el sitio
          intenta mantener una navegación simple, información pública visible y una presentación que no dependa por
          completo del gameplay para tener sentido.
        </p>

        <h2>Catálogo, cobertura y crecimiento</h2>
        <p>
          El catálogo público de Otakle sigue creciendo. La meta es representar franquicias populares, personajes icónicos
          y perfiles que permitan variedad real en las pistas. No se trata solo de acumular nombres: importa que el
          conjunto sea jugable, que existan contrastes útiles entre personajes y que las categorías hagan que la deducción
          sea interesante en vez de arbitraria.
        </p>

        <p>
          A medida que el catálogo se expande, también mejora el valor de las páginas públicas: más personajes implican
          mejores guías, mejores resúmenes por franquicia y más contexto para quienes quieren explorar el universo del
          juego aunque no estén en medio de una partida.
        </p>

        <h2>Reglas base del proyecto</h2>
        <ul>
          <li>Tienes <strong>8 intentos</strong> máximos por día.</li>
          <li>Todos juegan el mismo personaje diario.</li>
          <li>Las pistas se leen comparando atributos entre tu intento y la solución.</li>
          <li>Si aciertas, puedes compartir el resultado del día.</li>
          <li>Si fallas los 8 intentos, el día termina igual para preservar el valor de la racha.</li>
        </ul>

        <h2>Hora de cambio del personaje diario</h2>
        <p>
          El reto cambia a las <strong>00:00 UTC</strong>. En Chile normalmente eso equivale a las <strong>21:00</strong>{' '}
          cuando está en UTC-3. Este criterio evita confusiones y mantiene una referencia única para toda la comunidad,
          independientemente del país desde donde juegue cada persona.
        </p>

        <h2>Quién hace Otakle</h2>
        <p>
          Otakle es un proyecto creado por <strong>Aknoid</strong>. La intención es construir una experiencia original y
          consistente para fans del anime, con un juego diario entretenido y una base pública de contenido que siga
          creciendo con el tiempo. Si el sitio te resulta útil, claro o entretenido, esa ya es una señal de que va en la
          dirección correcta.
        </p>

        <h2>Contacto y feedback</h2>
        <p>
          Si quieres reportar un bug, sugerir personajes, proponer mejoras o mandar feedback general, puedes escribir por{' '}
          <a href="https://twitter.com/aknoid" target="_blank" rel="noreferrer noopener">
            X @aknoid
          </a>{' '}
          o por correo a <a href="mailto:oscarfernandezcepeda@gmail.com">oscarfernandezcepeda@gmail.com</a>. Ese tipo de
          feedback ayuda mucho porque permite detectar personajes faltantes, mejorar reglas públicas y refinar la
          experiencia antes de seguir ampliando el catálogo.
        </p>

        <h2>Disclaimer</h2>
        <p>
          Otakle es un proyecto hecho por fans y no tiene relación oficial con estudios, editoriales, plataformas de
          streaming ni propietarios de las obras mencionadas. Los nombres, franquicias y marcas pertenecen a sus
          respectivos dueños y se referencian aquí con fines informativos, descriptivos y lúdicos.
        </p>
      </div>

      <SiteFooter />
    </div>
  )
}
