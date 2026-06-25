import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
import '../App.css'

export default function Terms() {
  return (
    <div className="otakudle-container">
      <header className="topbar">
        <div className="brand">
          <div className="brand-left">
            <img className="brand-logo" src="/otakle-logo.png" alt="Otakle" />
            <div className="brand-text">
              <div className="title-row">
                <h1 className="brand-title">Términos de uso</h1>
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
          Al usar Otakle aceptas estos términos. Si no estás de acuerdo con ellos, por favor no utilices el sitio ni sus
          secciones asociadas.
        </p>

        <h2>1. Qué es Otakle</h2>
        <p>
          Otakle es un proyecto fan orientado a ofrecer un juego diario de personajes de anime, junto con catálogo público,
          guías, FAQ y páginas informativas relacionadas con el funcionamiento del sitio.
        </p>

        <h2>2. Uso permitido</h2>
        <ul>
          <li>El uso del sitio es personal, no exclusivo y revocable.</li>
          <li>No intentes interferir con el funcionamiento del servicio mediante spam, abuso, ataques o automatizaciones.</li>
          <li>No automatices intentos masivos ni scraping que afecte rendimiento, estabilidad o disponibilidad.</li>
          <li>No uses el sitio de forma que perjudique a otras personas o deteriore la experiencia general.</li>
        </ul>

        <h2>3. Disponibilidad del servicio</h2>
        <p>
          Otakle se ofrece “tal cual”. El proyecto puede modificarse, pausarse o discontinuarse total o parcialmente en
          cualquier momento, con o sin aviso previo. Eso incluye cambios en reglas, catálogo, rutas públicas o forma de
          presentar el contenido.
        </p>

        <h2>4. Propiedad intelectual y referencias a franquicias</h2>
        <p>
          Otakle es un proyecto fan. Los nombres de series, personajes, marcas, estudios y franquicias mencionados en el
          sitio pertenecen a sus respectivos titulares. Su presencia en Otakle tiene fines informativos, descriptivos y
          lúdicos dentro del contexto del juego y de las guías públicas.
        </p>
        <p>
          El hecho de que una obra aparezca en el catálogo no implica relación oficial, patrocinio ni aprobación por parte
          de sus propietarios.
        </p>

        <h2>5. Conducta no permitida</h2>
        <ul>
          <li>Intentar vulnerar el sitio, sus APIs, sus rutas estáticas o sus recursos de terceros.</li>
          <li>Usar bots o automatizaciones que generen carga abusiva o falseen la interacción normal del juego.</li>
          <li>Copiar o redistribuir partes del sitio de forma engañosa atribuyéndolas como oficiales.</li>
          <li>Usar el formulario o canales de contacto para acoso, spam o mensajes maliciosos.</li>
        </ul>

        <h2>6. Exactitud del contenido</h2>
        <p>
          Otakle busca mantener reglas claras, pistas coherentes y catálogo útil, pero puede haber errores, omisiones o
          clasificaciones discutibles. Si detectas un problema, lo más útil es reportarlo por la página de{' '}
          <Link to="/contact">Contacto</Link> para poder revisarlo.
        </p>

        <h2>7. Limitación de responsabilidad</h2>
        <p>
          En la medida permitida por la ley, Otakle y su autor no serán responsables por pérdidas o daños derivados del uso
          del sitio, de interrupciones del servicio, de dependencias externas o de decisiones tomadas a partir del contenido
          publicado aquí.
        </p>

        <h2>8. Cambios en estos términos</h2>
        <p>
          Estos términos pueden actualizarse cuando cambie el funcionamiento del sitio, su capa pública o sus integraciones.
          La fecha visible al inicio de la página indica la última revisión publicada.
        </p>

        <h2>9. Contacto</h2>
        <p>
          Para consultas sobre estos términos puedes escribir a{' '}
          <a href="mailto:oscarfernandezcepeda@gmail.com">oscarfernandezcepeda@gmail.com</a> o revisar la página de{' '}
          <Link to="/contact">Contacto</Link>.
        </p>
      </div>

      <SiteFooter />
    </div>
  )
}
