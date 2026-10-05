import { useState } from 'react'
import roniRetrato from './assets/roni-retrato.jpg'
import MediaViewer from './components/MediaViewer'
import PDFBookFlipViewer from './components/PDFBookFlipViewer'
import BrandGallery from './components/BrandGallery'
import CCIMCAT2025Resources from './components/CCIMCAT2025Resources'
import BDPRadioNovela from './components/BDPRadioNovela'
import KutitInnovation from './components/KutitInnovation'

import ccimcatCuaderno from './assets/projects/ccimcat/01-cuaderno-mockup.png'
import ccimcatBanner from './assets/projects/ccimcat/02-banner-ami-v2.png'
import ccimcatLetrero from './assets/projects/ccimcat/03-letrero-semillitas-al-aire.png'
import ccimcatPodcast from './assets/projects/ccimcat/videos-publicar/04-podcast-semillitas-al-aire-episodio-03.mp4'
import ccimcatSpot from './assets/projects/ccimcat/videos-publicar/05-spot-m3k-de-la-mano-de-una-nina.mp4'
import ccimcatCartilla from './assets/projects/ccimcat/06-cartilla-ruta-del-emprendedor.pdf'

import './App.css'

type MediaType = 'image' | 'video' | 'pdf'

type SelectedMedia = {
  type: MediaType
  src: string
  title: string
} | null

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia>(null)

const openMedia = (media: Exclude<SelectedMedia, null>) => {
  setSelectedMedia(media)
}

const closeMedia = () => {
  setSelectedMedia(null)
}

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <main className="site">

      {/* ================= HEADER ================= */}

      <header className="topbar">

        <a className="brand" href="#inicio" onClick={closeMenu}>
          RONI MENDOZA
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#proyectos">Proyectos</a>
          <a href="#servicios">Servicios</a>
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? 'CERRAR' : 'MENU'}
        </button>

        <nav
          className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}
          aria-label="Navegación móvil"
        >
          <a href="#proyectos" onClick={closeMenu}>
            Proyectos
          </a>

          <a href="#servicios" onClick={closeMenu}>
            Servicios
          </a>

          <a href="#sobre-mi" onClick={closeMenu}>
            Sobre mí
          </a>

          <a href="#contacto" onClick={closeMenu}>
            Contacto
          </a>
        </nav>

      </header>

      {/* ================= HERO ================= */}

      <section className="hero" id="inicio">

        <div className="hero-grid" />

        <div className="hero-meta">
          <span>01 / PORTAFOLIO</span>
          <span>COMUNICACIÓN INTEGRAL</span>
        </div>

        <div className="hero-copy">

          <p className="eyebrow">
            RONI MENDOZA / COMUNICADOR
          </p>

          <h1 className="hero-title">

            <span>COMUNICACIÓN</span>

            <span>QUE</span>

            <span className="hero-title-outline">
              CONECTA.
            </span>

          </h1>

          <p className="hero-description">
            Transformo objetivos de comunicación en ideas, contenidos y
            experiencias que se ven, se entienden y generan acción.
          </p>

          <a className="hero-link" href="#proyectos">
            VER PROYECTOS
            <span aria-hidden="true">↗</span>
          </a>

        </div>

        <div className="hero-visual">

          <div className="blue-circle" />

          <div className="portrait-frame">

            <img
              src={roniRetrato}
              alt="Roni Mendoza"
              className="portrait-image"
            />

          </div>

          <div className="visual-label">

            <span>COMUNICACIÓN</span>
            <span>CONTENIDO</span>
            <span>AUDIOVISUAL</span>

          </div>

        </div>

        <div className="hero-services">

          <span>CONTENIDO</span>
          <span>DISEÑO</span>
          <span>AUDIOVISUAL</span>
          <span>ESTRATEGIA</span>

        </div>

        <div className="hero-number">
          01
        </div>

      </section>

      {/* ================= PERFIL ================= */}

      <section className="profile-section" id="sobre-mi">

  <div className="profile-top">

    <div className="section-label">
      02 / PERFIL
    </div>

    <div className="profile-top-note">
      COMUNICACIÓN INTEGRAL / 2026
    </div>

  </div>

  <div className="profile-main">

    <div className="profile-title-block">

      <p className="section-kicker">
        COMUNICACIÓN CON PROPÓSITO
      </p>

      <h2 className="profile-title">
        <span>Ideas que</span>
        <span>encuentran</span>
        <span className="profile-title-accent">forma.</span>
      </h2>

    </div>

    <div className="profile-copy">

      <div className="profile-orbit">
        <div className="orbit-ring orbit-ring-one" />
        <div className="orbit-ring orbit-ring-two" />

        <div className="orbit-core">
          <span>RONI</span>
          <strong>↗</strong>
        </div>
      </div>

      <p className="profile-lead">
        Soy comunicador social especializado en conectar estrategia,
        contenido, diseño y producción audiovisual.
      </p>

      <p>
        Desarrollo soluciones de comunicación para organizaciones,
        instituciones, proyectos y emprendimientos, desde la
        conceptualización hasta la producción y ejecución.
      </p>

      <p>
        Mi trabajo combina pensamiento estratégico, narrativa y capacidad
        de producción para transformar ideas e información en comunicación
        clara, visual y funcional.
      </p>

    </div>

  </div>

  <div className="profile-skills">

    <article className="profile-skill">
      <span className="skill-number">01</span>

      <div className="skill-content">
        <h3>Estrategia</h3>
        <p>
          Planificación, campañas y comunicación institucional.
        </p>
      </div>

      <span className="skill-arrow">↗</span>
    </article>

    <article className="profile-skill">
      <span className="skill-number">02</span>

      <div className="skill-content">
        <h3>Contenido</h3>
        <p>
          Conceptualización, narrativa, copy y contenidos digitales.
        </p>
      </div>

      <span className="skill-arrow">↗</span>
    </article>

    <article className="profile-skill">
      <span className="skill-number">03</span>

      <div className="skill-content">
        <h3>Diseño</h3>
        <p>
          Diseño gráfico, editorial, materiales y branding.
        </p>
      </div>

      <span className="skill-arrow">↗</span>
    </article>

    <article className="profile-skill">
      <span className="skill-number">04</span>

      <div className="skill-content">
        <h3>Audiovisual</h3>
        <p>
          Guion, producción, fotografía y edición.
        </p>
      </div>

      <span className="skill-arrow">↗</span>
    </article>

  </div>

  <div className="profile-marquee">
    <div>
      COMUNICACIÓN · CONTENIDO · DISEÑO · AUDIOVISUAL · ESTRATEGIA ·
      COMUNICACIÓN · CONTENIDO · DISEÑO · AUDIOVISUAL · ESTRATEGIA ·
    </div>
  </div>

</section>

      {/* ================= SERVICIOS ================= */}

      <section className="services" id="servicios">

        <div className="section-label">
          03 / LO QUE HAGO
        </div>

        <div className="services-heading">

          <h2>
            Comunicación
            <br />
            integral.
          </h2>

          <p>
            Desde la idea y la estrategia hasta la pieza final. Un perfil que
            conecta pensamiento, producción y ejecución.
          </p>

        </div>

        <div className="services-grid">

          <article className="service-card">

            <span>01</span>

            <div>

              <h3>
                Comunicación integral
              </h3>

              <p>
                Estrategia, planificación, campañas, comunicación institucional
                y contenidos.
              </p>

            </div>

          </article>

          <article className="service-card">

            <span>02</span>

            <div>

              <h3>
                Contenido
              </h3>

              <p>
                Conceptualización, copywriting, publicaciones, campañas,
                podcast y narrativas.
              </p>

            </div>

          </article>

          <article className="service-card">

            <span>03</span>

            <div>

              <h3>
                Diseño
              </h3>

              <p>
                Diseño gráfico, editorial, materiales educativos, piezas para
                redes y branding.
              </p>

            </div>

          </article>

          <article className="service-card">

            <span>04</span>

            <div>

              <h3>
                Audiovisual
              </h3>

              <p>
                Guion, producción, fotografía, edición y contenidos para
                diferentes formatos.
              </p>

            </div>

          </article>

        </div>

      </section>

      {/* ================= PROYECTOS ================= */}

     <section className="projects" id="proyectos">

  <div className="section-label">
    04 / PROYECTOS
  </div>

  <div className="projects-heading">

    <div>
      <p className="section-kicker">
        TRABAJO REAL
      </p>

      <h2>
        Proyectos que
        <br />
        cuentan algo.
      </h2>
    </div>

    <p>
      Una selección de trabajos que muestran diferentes dimensiones de mi
      experiencia en comunicación, contenido, diseño y producción audiovisual.
    </p>

  </div>

  <article className="featured-project">

    <div className="featured-project-header">

      <div>
        <span className="project-number">
          01 / 06
        </span>

        <h3>
          CCIMCAT
        </h3>

        <p className="project-client">
          Comunicación integral / Plan International / 2026
        </p>
      </div>

      <div className="featured-project-role">
        <span>ROL</span>
        <strong>CONSULTOR DE COMUNICACIÓN INTEGRAL</strong>
      </div>

    </div>

    <div className="featured-project-description">

      <p>
        Desarrollo de materiales institucionales y educativos,
        contenidos gráficos y audiovisuales, piezas de difusión y
        comunicación para proyectos vinculados con mujeres, niñez,
        adolescencia y emprendimiento.
      </p>

    </div>

    <div className="project-gallery">

      <button
        type="button"
        className="project-media project-media-large project-media-button"
        onClick={() =>
          openMedia({
            type: 'image',
            src: ccimcatCuaderno,
            title: 'Cuaderno educativo — CCIMCAT',
          })
        }
        aria-label="Abrir cuaderno educativo de CCIMCAT"
      >
        <img
          src={ccimcatCuaderno}
          alt="Cuaderno educativo desarrollado para CCIMCAT"
        />

        <span className="media-caption">
          <span>01</span>
          <span>CUADERNO / MATERIAL EDUCATIVO</span>
        </span>

        <span className="media-open-hint">
          VER PIEZA ↗
        </span>
      </button>

      <button
        type="button"
        className="project-media project-media-button"
        onClick={() =>
          openMedia({
            type: 'image',
            src: ccimcatBanner,
            title: 'Banner AMI — CCIMCAT',
          })
        }
        aria-label="Abrir Banner AMI"
      >
        <img
          src={ccimcatBanner}
          alt="Banner AMI desarrollado para CCIMCAT"
        />

        <span className="media-caption">
          <span>02</span>
          <span>BANNER / COMUNICACIÓN VISUAL</span>
        </span>

        <span className="media-open-hint">
          VER PIEZA ↗
        </span>
      </button>

      <button
        type="button"
        className="project-media project-media-button"
        onClick={() =>
          openMedia({
            type: 'image',
            src: ccimcatLetrero,
            title: 'Semillitas al Aire — Identidad',
          })
        }
        aria-label="Abrir pieza Semillitas al Aire"
      >
        <img
          src={ccimcatLetrero}
          alt="Letrero de Semillitas al Aire"
        />

        <span className="media-caption">
          <span>03</span>
          <span>IDENTIDAD / APLICACIÓN</span>
        </span>

        <span className="media-open-hint">
          VER PIEZA ↗
        </span>
      </button>

      <button
        type="button"
        className="project-media project-video project-media-button"
        onClick={() =>
          openMedia({
            type: 'video',
            src: ccimcatPodcast,
            title: 'Semillitas al Aire — Episodio 03',
          })
        }
        aria-label="Reproducir podcast Semillitas al Aire, episodio 3"
      >
        <video
          src={ccimcatPodcast}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />

        <span className="media-caption">
          <span>04</span>
          <span>PODCAST / EPISODIO 03</span>
        </span>

        <span className="media-open-hint">
          VER VIDEO ↗
        </span>

      </button>

      <button
        type="button"
        className="project-media project-video project-media-button"
        onClick={() =>
          openMedia({
            type: 'video',
            src: ccimcatSpot,
            title: 'Spot M3K — De la mano de una niña',
          })
        }
        aria-label="Reproducir Spot M3K — De la mano de una niña"
      >
        <video
          src={ccimcatSpot}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />

        <span className="media-caption">
          <span>05</span>
          <span>SPOT / CAMPAÑA</span>
        </span>

        <span className="media-open-hint">
          VER VIDEO ↗
        </span>
      </button>

      <button
  type="button"
  className="project-pdf project-pdf-button"
  onClick={() =>
    openMedia({
      type: 'pdf',
      src: ccimcatCartilla,
      title: 'Ruta del Emprendedor',
    })
  }
  aria-label="Abrir Cartilla Ruta del Emprendedor"
>
  <div>
    <span>06</span>

    <h4>
      Ruta del
      <br />
      Emprendedor
    </h4>

    <p>
      Cartilla final / PDF
    </p>
  </div>

  <span className="pdf-arrow">
    ↗
  </span>
</button>

    </div>

  </article>

<article className="featured-project">
  <div className="featured-project-header">
    <div>
      <span className="project-number">02 / 06</span>

      <h3>CCIMCAT 2025</h3>

      <p className="project-client">
        Emprender para Crecer / Fortalece
      </p>
    </div>

    <div className="featured-project-role">
      <span>ROL</span>
      <strong>COMUNICACIÓN Y MARCA</strong>
    </div>
  </div>

  <div className="featured-project-description">
    <p>
      Desarrollo de comunicación y herramientas visuales para
      emprendimientos participantes del programa, incluyendo
      construcción de identidad de marca, materiales de capacitación
      y contenidos digitales.
    </p>
  </div>

  <BrandGallery />
  <CCIMCAT2025Resources />
</article>

  <BDPRadioNovela />
  <KutitInnovation />

</section>

      {/* ================= STATEMENT ================= */}

      <section className="statement">

        <div className="statement-number">
          05
        </div>

        <p>
          NO SOLO CREO PIEZAS.
          <br />
          CONSTRUYO FORMAS
          <br />
          DE COMUNICAR.
        </p>

      </section>

      {/* ================= CONTACTO ================= */}

      <section className="contact section-blue" id="contacto">

        <div className="section-label">
          06 / CONTACTO
        </div>

        <div className="contact-content">

          <p className="section-kicker">
            ¿TENEMOS ALGO QUE CONTAR?
          </p>

          <h2>
            Hablemos
            <br />
            de comunicación.
          </h2>

          <a
            className="contact-email"
            href="mailto:roni.a.mendoza.r@gmail.com"
          >
            roni.a.mendoza.r@gmail.com

            <span>
              ↗
            </span>

          </a>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <span>
          RONI MENDOZA
        </span>

        <span>
          COMUNICACIÓN QUE CONECTA.
        </span>

        <span>
          2026
        </span>

      </footer>
      {selectedMedia &&
      (selectedMedia.type === 'pdf' ? (
        <PDFBookFlipViewer
          src={selectedMedia.src}
          title={selectedMedia.title}
          onClose={closeMedia}
        />
      ) : (
        <MediaViewer
          isOpen={true}
          type={selectedMedia.type}
          src={selectedMedia.src}
          title={selectedMedia.title}
          onClose={closeMedia}
        />
      ))}
    </main>
  )
}

export default App