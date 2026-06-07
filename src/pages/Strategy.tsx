import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
import '../App.css'

export default function Strategy() {
  return (
    <div className="otakle-page">
      <header className="page-header">
        <div className="page-title">
          <h1>Estrategia</h1>
          <p>Cómo pensar mejor cada intento, leer las pistas con intención y subir tu tasa de aciertos.</p>
        </div>

        <div className="page-actions">
          <Link to="/play" className="btn-secondary">
            Ir a jugar
          </Link>
        </div>
      </header>

      <div className="page-card">
        <h2>La idea principal: no intentes acertar por suerte</h2>
        <p>
          En Otakle casi nunca conviene jugar “a ver si justo era ese”. La mejor forma de mejorar es tratar cada intento
          como una herramienta para recoger información. Si eliges personajes con intención, aunque falles una respuesta,
          igual puedes salir de ese turno con datos suficientes para acercarte mucho a la solución.
        </p>

        <p>
          Una buena partida suele tener tres etapas: <strong>explorar</strong>, <strong>acotar</strong> y{' '}
          <strong>cerrar</strong>. Primero necesitas señales generales; después reduces el universo de opciones; y recién al
          final te conviene afinar con nombres muy específicos.
        </p>

        <h2>1) Usa el primer intento como sonda, no como apuesta final</h2>
        <p>
          El primer personaje debería ayudarte a ubicar el terreno. Idealmente conviene elegir un nombre relativamente
          conocido, fácil de recordar y que te entregue atributos claros. Lo importante no es “ganar al tiro”, sino salir
          del primer turno sabiendo algo útil sobre anime, rol, demografía, año o perfil general del personaje buscado.
        </p>

        <p>
          Un mal primer intento es uno demasiado raro o demasiado específico, porque si falla te deja poca intuición para
          el siguiente paso. Un buen primer intento, en cambio, te deja una brújula. Te dice si debes pensar en una obra
          más reciente, en otra franquicia, en un arquetipo diferente o en una generación distinta de personajes.
        </p>

        <h2>2) El año de debut suele ser la pista más infravalorada</h2>
        <p>
          Mucha gente mira primero anime o personaje y apenas presta atención a la flecha del año. Error. El{' '}
          <strong>año de debut</strong> puede eliminar muchísimas opciones de una sola vez.
        </p>
        <ul>
          <li>
            Si ves <strong>↑</strong>, la solución es <strong>más nueva</strong> que el personaje que probaste.
          </li>
          <li>
            Si ves <strong>↓</strong>, la solución es <strong>más antigua</strong>.
          </li>
          <li>
            Si hay coincidencia exacta, entonces ya tienes una pista temporal potentísima para afinar por franquicia o
            arquetipo.
          </li>
        </ul>

        <p>
          En la práctica, esta columna ayuda mucho cuando estás dudando entre una obra clásica, una serie de los 2000 o un
          fenómeno más reciente. Úsala como filtro fuerte, no como detalle decorativo.
        </p>

        <h2>3) Evita los intentos demasiado parecidos entre sí</h2>
        <p>
          Uno de los errores más comunes es insistir con personajes casi gemelos en información. Si ya probaste un personaje
          de una serie concreta y varias columnas salieron mal, no siempre tiene sentido seguir con alguien muy parecido.
          A veces solo obtienes una segunda fila casi idéntica y desperdicias un turno.
        </p>

        <p>
          Cuando tengas pocas certezas, conviene que el siguiente intento cambie bastante el eje: otra franquicia, otro tipo
          de protagonista, otra época o incluso otra demografía. Eso te da contraste, y el contraste es lo que vuelve útil
          la información.
        </p>

        <h2>4) Aprende a distinguir entre “cerca en una cosa” y “cerca de verdad”</h2>
        <p>
          Puedes tener una columna verde y aun así estar lejos de la solución global. También puede pasar lo contrario:
          quizá no acertaste el anime, pero varias otras categorías te dicen que estás cerca del perfil correcto. La clave
          es mirar la combinación total de señales.
        </p>

        <p>
          Por ejemplo, si coincides en rol, género y una referencia temporal, probablemente ya tienes un perfil concreto.
          Si en cambio solo coincides en una cosa muy amplia, como “humano”, eso no basta para asumir que vas bien. La
          estrategia en Otakle es relacional, no binaria.
        </p>

        <h2>5) Usa el filtro por anime como herramienta de ejecución, no como muleta</h2>
        <p>
          El filtro por anime es útil, pero conviene ocuparlo con disciplina. Su mejor uso es ayudarte a escribir rápido
          un personaje que ya sospechas. Su peor uso es convertirlo en una lista para recorrer nombres sin hipótesis.
        </p>

        <p>
          Si ya tienes razones para pensar en una franquicia concreta, filtrar puede ahorrarte tiempo y errores de
          escritura. Pero si todavía no tienes una lectura clara de las pistas, abusar del filtro puede empujarte a jugar
          por descarte superficial en vez de por deducción real.
        </p>

        <h2>6) Cómo jugar los intentos del medio</h2>
        <p>
          Los intentos 3 a 5 suelen ser la parte más importante de una partida. Ahí ya no estás completamente a ciegas,
          pero todavía no conviene “casarte” con una única respuesta. En esa zona lo ideal es elegir personajes que te
          cambien una o dos variables importantes sin destruir toda la información anterior.
        </p>

        <ul>
          <li>Si sospechas de una franquicia, prueba otro perfil distinto dentro de esa misma lógica.</li>
          <li>Si dudas de la época, juega un personaje puente que te ayude a medir el año.</li>
          <li>Si el rol parece incorrecto, cambia a un arquetipo opuesto para confirmar rápido.</li>
        </ul>

        <p>
          Esta fase es donde más se nota la diferencia entre jugar por impulso y jugar con método. Un intento intermedio
          bien elegido vale más que dos respuestas al azar.
        </p>

        <h2>7) Cómo cerrar una partida cuando te quedan pocos intentos</h2>
        <p>
          Cuando te quedan 2 o 3 intentos, la prioridad cambia. Ya no necesitas explorar tanto: necesitas confirmar la
          hipótesis más fuerte. En ese momento conviene elegir personajes que mantengan casi todas las categorías que ya
          consideras correctas y cambien solo una o dos piezas clave.
        </p>

        <p>
          Esa técnica ayuda a responder preguntas del tipo: “¿Estoy en la franquicia correcta pero con el rol equivocado?”
          o “¿Estoy en el año correcto pero con el personaje incorrecto?”. El final de la partida debe sentirse quirúrgico,
          no desesperado.
        </p>

        <h2>8) Errores que bajan mucho la tasa de aciertos</h2>
        <ul>
          <li>Ignorar la flecha del año de debut aunque sea la pista más informativa que tienes.</li>
          <li>Quedarte demasiado tiempo en la misma franquicia cuando las pistas no la sostienen.</li>
          <li>Usar el filtro como pista principal en vez de como apoyo de escritura.</li>
          <li>Elegir personajes casi idénticos en varios turnos seguidos.</li>
          <li>Tomar una coincidencia aislada como prueba de que ya estás muy cerca.</li>
          <li>Entrar en pánico con 2 intentos restantes y empezar a probar nombres por intuición pura.</li>
        </ul>

        <h2>9) Una rutina simple que suele funcionar</h2>
        <ol>
          <li>Abre con un personaje conocido que te dé una buena lectura general.</li>
          <li>Mira primero el anime, el rol y el año de debut.</li>
          <li>Decide si debes cambiar de franquicia, de época o de arquetipo.</li>
          <li>Usa un tercer intento que contraste de forma inteligente.</li>
          <li>Cuando ya tengas 2 o 3 señales firmes, empieza a afinar.</li>
          <li>Guarda los últimos intentos para confirmar hipótesis, no para improvisar.</li>
        </ol>

        <h2>10) El objetivo real no es solo ganar hoy</h2>
        <p>
          Jugar mejor en Otakle también significa construir criterio para los días siguientes. Mientras más aprendas a leer
          patrones, recordar franquicias y entender cómo dialogan las pistas, más consistente será tu rendimiento. La meta
          no es tener una partida milagrosa, sino mejorar tu lectura general del juego.
        </p>

        <p>
          Si todavía no dominas bien las reglas o el significado exacto de cada pista, te conviene revisar primero la guía
          de <Link to="/how-to-play">Cómo se juega</Link>. Si ya entiendes la base, entonces esta estrategia te debería
          ayudar a convertir información suelta en decisiones más precisas.
        </p>
      </div>

      <SiteFooter />
    </div>
  )
}
