import { useState } from 'react'
import MediaViewer from './MediaViewer'
import PDFBookFlipViewer from './PDFBookFlipViewer'
import './BDPRadioNovela.css'

type SelectedMedia = {
  type: 'video' | 'pdf'
  src: string
  title: string
}

const chapterFiles = import.meta.glob(
'../assets/projects/bdp-radio-novela/capitulos-publicar/*.{mp4,webm,mov}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
) as Record<string, string>

const scriptFiles = import.meta.glob(
  '../assets/projects/bdp-radio-novela/guion/*.pdf',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
) as Record<string, string>

const chapters = Object.entries(chapterFiles)
  .map(([path, src]) => ({
    src,
    name:
      path
        .split('/')
        .pop()
        ?.replace(/\.(mp4|webm|mov)$/i, '')
        .replace(/^\d+[\s._-]*/, '')
        .replace(/[-_]+/g, ' ')
        .trim() || 'Capítulo',
  }))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))

const script = Object.entries(scriptFiles)[0]

function BDPRadioNovela() {
  const [selectedMedia, setSelectedMedia] =
    useState<SelectedMedia | null>(null)

  const closeMedia = () => {
    setSelectedMedia(null)
  }

  return (
    <>
      <div className="bdp-radio-novela">

        <div className="bdp-radio-header">
          <div>
            <span className="bdp-radio-kicker">
              BDP / PRODUCCIÓN AUDIOVISUAL
            </span>

            <h3>
              Una historia.
              <br />
              <span>Diez capítulos animados.</span>
            </h3>
          </div>

          <div className="bdp-radio-meta">
            <span>FORMATO</span>
            <strong>RADIO NOVELA ANIMADA</strong>
          </div>
        </div>

        <div className="bdp-radio-description">
          <p>
            Desarrollo de una producción narrativa y audiovisual compuesta
            por diez capítulos animados, desde la construcción del guion
            hasta la producción y postproducción de las piezas finales.
          </p>
        </div>

        {script && (
          <button
            type="button"
            className="bdp-script-card"
            onClick={() =>
              setSelectedMedia({
                type: 'pdf',
                src: script[1],
                title: 'Guion técnico — BDP Radio Novela',
              })
            }
          >
            <div className="bdp-script-index">01</div>

            <div className="bdp-script-content">
              <span>DOCUMENTO DE PRODUCCIÓN</span>
              <strong>Guion técnico</strong>
              <p>ABRIR DOCUMENTO ↗</p>
            </div>

            <div className="bdp-script-arrow">→</div>
          </button>
        )}

        <div className="bdp-chapters-header">
          <span>02 / CAPÍTULOS TERMINADOS</span>
          <strong>{chapters.length}</strong>
        </div>

        <div className="bdp-chapters-grid">
          {chapters.slice(0, 4).map((chapter, index) => (
            <button
              type="button"
              className="bdp-chapter-card"
              key={chapter.src}
              onClick={() =>
                setSelectedMedia({
                  type: 'video',
                  src: chapter.src,
                  title: chapter.name,
                })
              }
            >
              <div className="bdp-chapter-number">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="bdp-chapter-body">
                <span>CAPÍTULO</span>
                <strong>{chapter.name}</strong>
              </div>

              <div className="bdp-chapter-play">
                ▶
              </div>
            </button>
          ))}
        </div>

      </div>
      
      {chapters.length > 4 && (
  <details className="bdp-more">
    <summary className="bdp-more-button">
      <span>+ VER MÁS</span>
      <span>{chapters.length - 4} capítulos</span>
    </summary>

    <div className="bdp-chapters-grid bdp-chapters-grid-more">
      {chapters.slice(4).map((chapter, index) => (
        <button
          type="button"
          className="bdp-chapter-card"
          key={chapter.src}
          onClick={() =>
            setSelectedMedia({
              type: 'video',
              src: chapter.src,
              title: chapter.name,
            })
          }
        >
          <div className="bdp-chapter-number">
            {String(index + 5).padStart(2, '0')}
          </div>

          <div className="bdp-chapter-content">
            <span>CAPÍTULO</span>
            <strong>{chapter.name}</strong>
          </div>

          <div className="bdp-chapter-play">
            ▶
          </div>
        </button>
      ))}
    </div>
  </details>
)}

      {selectedMedia?.type === 'video' && (
        <MediaViewer
          isOpen={true}
          type="video"
          src={selectedMedia.src}
          title={selectedMedia.title}
          onClose={closeMedia}
        />
      )}

      {selectedMedia?.type === 'pdf' && (
        <PDFBookFlipViewer
          src={selectedMedia.src}
          title={selectedMedia.title}
          onClose={closeMedia}
        />
      )}
    </>
  )
}

export default BDPRadioNovela