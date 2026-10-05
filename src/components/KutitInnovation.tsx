import { useState } from 'react'
import MediaViewer from './MediaViewer'
import './KutitInnovation.css'

type MediaItem = {
  src: string
  name: string
  type: 'video' | 'image'
}

const spotFiles = import.meta.glob(
  '../assets/projects/kutit-innovation/spots/*.{mp4,webm,mov,m4v}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
) as Record<string, string>

const reelFiles = import.meta.glob(
  '../assets/projects/kutit-innovation/reels/*.{mp4,webm,mov,m4v}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
) as Record<string, string>

const postFiles = import.meta.glob(
  '../assets/projects/kutit-innovation/posts/*.{jpg,jpeg,png,webp,svg}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
) as Record<string, string>

const cleanName = (path: string) =>
  path
    .split('/')
    .pop()
    ?.replace(/\.(mp4|webm|mov|m4v|jpg|jpeg|png|webp|svg)$/i, '')
    .replace(/^\d+[\s._-]*/, '')
    .replace(/[-_]+/g, ' ')
    .trim() || 'Pieza'

const toItems = (
  files: Record<string, string>,
  type: 'video' | 'image'
): MediaItem[] =>
  Object.entries(files)
    .map(([path, src]) => ({
      src,
      name: cleanName(path),
      type,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))

const spots = toItems(spotFiles, 'video')
const reels = toItems(reelFiles, 'video')
const posts = toItems(postFiles, 'image')

function KutitInnovation() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  const openMedia = (item: MediaItem) => {
    setSelectedMedia(item)
  }

  const closeMedia = () => {
    setSelectedMedia(null)
  }

  const renderVideoSection = (
    title: string,
    items: MediaItem[],
    number: string
  ) => {
    if (!items.length) return null

    return (
      <section className="kutit-media-section">
        <div className="kutit-section-heading">
          <span>
            {number} / {title}
          </span>
          <strong>{items.length}</strong>
        </div>

        <div className="kutit-video-grid">
          {items.map((item, index) => (
            <button
              type="button"
              className="kutit-video-card"
              key={item.src}
              onClick={() => openMedia(item)}
            >
              <div className="kutit-video-index">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="kutit-video-content">
                <span>{title}</span>
                <strong>{item.name}</strong>
              </div>

              <div className="kutit-play">
                ▶
              </div>
            </button>
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <div className="kutit-innovation">
        <div className="kutit-header">
          <div>
            <span className="kutit-kicker">
              KUTIT INNOVATION / CONTENIDO DIGITAL
            </span>

            <h3>
              Comunicación en movimiento.
              <br />
              <span>Contenido para conectar.</span>
            </h3>
          </div>

          <div className="kutit-meta">
            <span>FORMATO</span>
            <strong>
              SPOTS · REELS · POSTS
            </strong>
          </div>
        </div>

        <div className="kutit-description">
          <p>
            Selección de contenidos desarrollados para comunicación digital,
            combinando piezas gráficas y producción audiovisual para redes.
          </p>
        </div>

        {renderVideoSection('SPOTS', spots, '01')}
        {renderVideoSection('REELS', reels, '02')}

        {posts.length > 0 && (
          <section className="kutit-media-section">
            <div className="kutit-section-heading">
              <span>03 / POSTS</span>
              <strong>{posts.length}</strong>
            </div>

            <div className="kutit-post-grid">
              {posts.map((item, index) => (
                <button
                  type="button"
                  className="kutit-post-card"
                  key={item.src}
                  onClick={() => openMedia(item)}
                >
                  <div className="kutit-post-image">
                    <img
                      src={item.src}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="kutit-post-footer">
                    <span>
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <p>{item.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {selectedMedia && (
        <MediaViewer
          isOpen={true}
          type={selectedMedia.type}
          src={selectedMedia.src}
          title={selectedMedia.name}
          onClose={closeMedia}
        />
      )}
    </>
  )
}

export default KutitInnovation