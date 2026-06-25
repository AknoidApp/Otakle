import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
import '../App.css'

export default function Privacy() {
  return (
    <div className="otakudle-container">
      <header className="topbar">
        <div className="brand">
          <div className="brand-left">
            <img className="brand-logo" src="/otakle-logo.png" alt="Otakle" />
            <div className="brand-text">
              <div className="title-row">
                <h1 className="brand-title">Política de privacidad</h1>
                <span className="daily-badge">Legal</span>
              </div>
              <p className="brand-subtitle">Última actualización: 2026-06-24</p>
            </div>
          </div>

          <div className="topbar-actions">
            <Link className="howto-button" to="/play">
              Ir a jugar
            </Link>
          </div>
        </div>
      </header>

      <div className="legal-content">
        <p>
          Esta política explica qué información utiliza Otakle para funcionar, qué parte del progreso se guarda en tu
          navegador y cómo se relaciona el sitio con terceros como servicios de analítica o publicidad, cuando corresponda.
        </p>

        <h2>1. Qué datos guarda Otakle</h2>
        <p>
          Otakle está diseñado para funcionar sin cuenta obligatoria. Por eso, la mayor parte de la información relacionada
          con tu uso del juego se guarda localmente en tu navegador y no en un perfil centralizado del sitio.
        </p>
        <ul>
          <li>
            <strong>Progreso del reto diario:</strong> intentos del día, estado de la partida y si resolviste o no el
            personaje.
          </li>
          <li>
            <strong>Estadísticas locales:</strong> racha actual, mejor racha y distribución de intentos, cuando aplique.
          </li>
          <li>
            <strong>Historial local:</strong> datos de partidas guardados para que puedas revisar tu progreso desde tu mismo
            navegador.
          </li>
        </ul>

        <h2>2. Dónde se guarda esa información</h2>
        <p>
          El sitio utiliza almacenamiento local del navegador (por ejemplo, <strong>LocalStorage</strong>) para mantener tu
          progreso y tus estadísticas. Eso significa que esa información suele quedarse en tu propio dispositivo y puede
          desaparecer si borras los datos del navegador, cambias de dispositivo o usas una sesión distinta.
        </p>

        <h2>3. Qué no se usa como cuenta personal</h2>
        <p>
          Otakle no te pide crear usuario para jugar. El nombre del personaje que escribes se usa para validar el intento y
          mostrar las pistas correspondientes dentro del tablero. Esa interacción no convierte por sí misma tu actividad en
          un perfil público del sitio.
        </p>

        <h2>4. Cookies, almacenamiento similar y publicidad</h2>
        <p>
          Otakle por sí mismo puede funcionar sin cookies estrictamente necesarias para la lógica principal del juego, pero
          algunos componentes de terceros pueden usar cookies, almacenamiento local o identificadores similares para tareas
          como medición, seguridad o publicidad.
        </p>
        <p>
          Si el sitio muestra anuncios mediante Google AdSense u otro proveedor similar, esos servicios pueden recopilar o
          inferir información técnica del navegador para servir anuncios, limitar frecuencia, medir rendimiento o adaptar la
          experiencia según sus propias políticas y la normativa aplicable en tu región.
        </p>

        <h2>5. Enlaces y servicios de terceros</h2>
        <p>
          El sitio puede enlazar a plataformas externas como X/Twitter u otros servicios públicos. Cuando sales de Otakle,
          las políticas de privacidad que rigen son las de cada plataforma externa y no las de este sitio.
        </p>

        <h2>6. Seguridad y límites prácticos</h2>
        <p>
          Aunque Otakle intenta mantener una experiencia razonable y estable, ningún entorno web puede garantizar seguridad
          absoluta. Si usas un dispositivo compartido, recuerda que el progreso local puede quedar visible para quien abra el
          mismo navegador después de ti.
        </p>

        <h2>7. Tus opciones como usuario</h2>
        <ul>
          <li>Puedes borrar el almacenamiento local del navegador para reiniciar progreso, historial o estadísticas.</li>
          <li>Puedes usar navegación privada o incógnito si prefieres no conservar datos locales después de la sesión.</li>
          <li>Puedes revisar la configuración de cookies y anuncios de tu navegador o de tu cuenta de Google si aplica.</li>
        </ul>

        <h2>8. Cambios en esta política</h2>
        <p>
          Esta política puede actualizarse cuando cambie la forma en que Otakle guarda datos locales, integre nuevos
          servicios o ajuste su capa pública. La fecha visible al inicio de la página indica la última revisión publicada.
        </p>

        <h2>9. Contacto</h2>
        <p>
          Si tienes dudas sobre privacidad, almacenamiento local, anuncios o funcionamiento general del sitio, puedes
          escribir a <a href="mailto:oscarfernandezcepeda@gmail.com">oscarfernandezcepeda@gmail.com</a> o usar la página de{' '}
          <Link to="/contact">Contacto</Link>.
        </p>
      </div>

      <SiteFooter />
    </div>
  )
}
