import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'
import '../App.css'
import { FAQ_ITEMS } from '../lib/siteData'

export default function Faq() {
  return (
    <div className="otakle-page">
      <header className="page-header">
        <div className="page-title">
          <h1>Preguntas frecuentes</h1>
          <p>
            Respuestas públicas sobre reglas, pistas, reinicios, modo easy, estadísticas locales, privacidad y
            funcionamiento general de Otakle.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/play" className="btn-secondary">
            Ir a jugar
          </Link>
        </div>
      </header>

      <section className="page-grid">
        <article className="page-card">
          <h2>Qué resuelve esta página</h2>
          <p>
            Esta FAQ está pensada para responder las dudas más comunes antes de que tengas que escribir por soporte. Si
            vienes por primera vez al sitio, aquí deberías poder entender qué es Otakle, cuántos intentos tienes, cómo se
            reinicia el reto y qué parte del historial se guarda solo en tu navegador.
          </p>
        </article>

        <article className="page-card">
          <h2>Cuándo conviene revisar otras guías</h2>
          <p>
            Si tu duda no es operativa sino estratégica, probablemente te convenga saltar luego a{' '}
            <Link to="/how-to-play">cómo se juega</Link>, <Link to="/strategy">estrategia</Link> o a las guías
            editoriales sobre lectura de pistas y franquicias destacadas.
          </p>
        </article>
      </section>

      <div className="faq-grid faq-grid-full">
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} className="faq-card">
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>

      <section className="page-card notice-card">
        <h2>Dudas frecuentes fuera del gameplay</h2>
        <ul>
          <li>Otakle no publica una tabla global de estadísticas personales; tus datos se guardan localmente.</li>
          <li>El catálogo puede crecer con el tiempo, así que personajes y franquicias visibles hoy no son el límite final.</li>
          <li>Si detectas una pista inconsistente o una ficha mal clasificada, lo más útil es reportar personaje, anime y captura.</li>
        </ul>
      </section>

      <div className="page-card">
        <h2>¿Todavía tienes dudas?</h2>
        <p>
          Si tu pregunta no aparece aquí, puedes revisar la guía completa de <Link to="/how-to-play">cómo se juega</Link>,
          la página de <Link to="/strategy">estrategia</Link>, la guía de{' '}
          <Link to="/como-leer-pistas-otakle">cómo leer las pistas</Link> o escribir por la sección de{' '}
          <Link to="/contact">contacto</Link>.
        </p>
      </div>

      <SiteFooter />
    </div>
  )
}
