import './BrandGallery.css'

type BrandItem = {
  src: string
  name: string
}

const brandFiles = import.meta.glob(
  '../assets/projects/ccimcat-2025/branding/*.{jpg,jpeg,png,webp,svg}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
) as Record<string, string>

const brands: BrandItem[] = Object.entries(brandFiles)
  .map(([path, src]) => ({
    src,
    name: path
      .split('/')
      .pop()
      ?.replace(/\.(jpg|jpeg|png|webp|svg)$/i, '')
      .replace(/^\d+\.\s*/, '')
      .replace(/[-_]+/g, ' ')
      .trim() || 'Marca',
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

function BrandGallery() {
  const visibleBrands = brands.slice(0, 8)

  return (
    <div className="brand-gallery">
      <div className="brand-gallery-header">
        <div>
          <span className="brand-gallery-kicker">
            IDENTIDAD / CCIMCAT 2025
          </span>

          <h3>
            120 emprendimientos.
            <br />
            <span>Una identidad para cada uno.</span>
          </h3>
        </div>

        <div className="brand-gallery-count">
          <strong>{brands.length}</strong>
          <span>archivos cargados</span>
        </div>
      </div>

      <div className="brand-gallery-grid">
        {visibleBrands.map((brand, index) => (
          <article className="brand-card" key={`${brand.src}-${index}`}>
            <div className="brand-card-image">
              <img
                src={brand.src}
                alt={`Identidad de ${brand.name}`}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="brand-card-footer">
              <span>
                {String(index + 1).padStart(2, '0')}
              </span>

              <p>{brand.name}</p>
            </div>
          </article>
        ))}
      </div>

      {brands.length > 8 && (
  <details className="brand-gallery-preview">
    <summary className="brand-gallery-more">
      <span>+ VER MÁS</span>
      <span>{brands.length - 8} piezas</span>
    </summary>

    <div className="brand-gallery-grid brand-gallery-grid-more">
      {brands.slice(8).map((brand, index) => (
        <article
          className="brand-card"
          key={`${brand.src}-${index + 8}`}
        >
          <div className="brand-card-image">
            <img
              src={brand.src}
              alt={`Identidad de ${brand.name}`}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="brand-card-footer">
            <span>
              {String(index + 9).padStart(2, '0')}
            </span>

            <p>{brand.name}</p>
          </div>
        </article>
      ))}
    </div>
  </details>
)}
    </div>
  )
}

export default BrandGallery