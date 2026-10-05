import './CCIMCAT2025Resources.css'

type Resource = {
  src: string
  name: string
}

const trainingFiles = import.meta.glob(
  '../assets/projects/ccimcat-2025/capacitacion/*.{jpg,jpeg,png,webp,svg}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
) as Record<string, string>

const socialFiles = import.meta.glob(
  '../assets/projects/ccimcat-2025/redes/*.{jpg,jpeg,png,webp,svg}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
) as Record<string, string>

const toResources = (files: Record<string, string>): Resource[] =>
  Object.entries(files)
    .map(([path, src]) => ({
      src,
      name:
        path
          .split('/')
          .pop()
          ?.replace(/\.(jpg|jpeg|png|webp|svg)$/i, '')
          .replace(/^\d+\.\s*/, '')
          .replace(/[-_]+/g, ' ')
          .trim() || 'Recurso',
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

const trainingResources = toResources(trainingFiles)
const socialResources = toResources(socialFiles)

function ResourceCard({
  resource,
  index,
}: {
  resource: Resource
  index: number
}) {
  return (
    <article className="resource-card">
      <div className="resource-card-image">
        <img
          src={resource.src}
          alt={resource.name}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="resource-card-footer">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <p>{resource.name}</p>
      </div>
    </article>
  )
}

function CCIMCAT2025Resources() {
  return (
    <div className="ccimcat-resources">

      {trainingResources.length > 0 && (
        <section className="resource-section">
          <div className="resource-section-heading">
            <span>01 / CAPACITACIÓN</span>
            <strong>{trainingResources.length}</strong>
          </div>

          <div className="resource-grid">
            {trainingResources.slice(0, 12).map((resource, index) => (
              <ResourceCard
                key={`${resource.src}-${index}`}
                resource={resource}
                index={index}
              />
            ))}
          </div>

          {trainingResources.length > 12 && (
            <p className="resource-more">
              + {trainingResources.length - 12} materiales
            </p>
          )}
        </section>
      )}

      {socialResources.length > 0 && (
        <section className="resource-section">
          <div className="resource-section-heading">
            <span>02 / REDES SOCIALES</span>
            <strong>{socialResources.length}</strong>
          </div>

          <div className="resource-grid">
            {socialResources.slice(0, 12).map((resource, index) => (
              <ResourceCard
                key={`${resource.src}-${index}`}
                resource={resource}
                index={index}
              />
            ))}
          </div>

          {socialResources.length > 12 && (
            <p className="resource-more">
              + {socialResources.length - 12} piezas
            </p>
          )}
        </section>
      )}

    </div>
  )
}

export default CCIMCAT2025Resources