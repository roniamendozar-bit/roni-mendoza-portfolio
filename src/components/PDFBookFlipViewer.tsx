import { useEffect, useMemo, useRef, useState } from 'react'
import HTMLFlipBook, {
  type BookSnapshot,
  type FlipBookHandle,
} from '@gullabs/react-flipbook'
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

import './PDFBookFlipViewer.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

interface PDFBookFlipViewerProps {
  src: string
  title: string
  onClose: () => void
}

interface PageImage {
  src: string
  number: number
}

function PDFBookFlipViewer({
  src,
  title,
  onClose,
}: PDFBookFlipViewerProps) {
  const bookRef = useRef<FlipBookHandle | null>(null)
  const [pages, setPages] = useState<PageImage[]>([])
  const [pageNumber, setPageNumber] = useState(0)
  const [visiblePages, setVisiblePages] = useState<number[]>([])
  const [pageCount, setPageCount] = useState(0)

  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  } catch (fullscreenError) {
    console.error(
      'No se pudo cambiar a pantalla completa:',
      fullscreenError
    )
  }
}

useEffect(() => {
  const handleFullscreenChange = () => {
    setIsFullscreen(Boolean(document.fullscreenElement))
  }

  document.addEventListener(
    'fullscreenchange',
    handleFullscreenChange
  )

  return () => {
    document.removeEventListener(
      'fullscreenchange',
      handleFullscreenChange
    )
  }
}, [])

  const [bookWidth, setBookWidth] = useState(620)
  const [bookHeight, setBookHeight] = useState(440)

  /* ========================================
     TAMAÑO RESPONSIVE DEL LIBRO
  ======================================== */

  useEffect(() => {
    const updateBookSize = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      const width = Math.min(
        1000,
        Math.max(
          300,
          Math.floor(viewportWidth * 0.62)
        )
      )

      const height = Math.min(
        760,
        Math.max(
          220,
          Math.floor(viewportHeight * 0.82)
        )
      )

      setBookWidth(width)
      setBookHeight(height)
    }

    updateBookSize()

    window.addEventListener(
      'resize',
      updateBookSize
    )

    return () => {
      window.removeEventListener(
        'resize',
        updateBookSize
      )
    }
  }, [])

  /* ========================================
     CARGAR Y CONVERTIR EL PDF
  ======================================== */

  useEffect(() => {
    let cancelled = false
    let documentProxy:
      | pdfjsLib.PDFDocumentProxy
      | null = null

    const loadPdf = async () => {
      try {
        setLoading(true)
        setError('')
        setPages([])
        setPageNumber(0)
        setPageCount(0)
        setProgress(0)

        const loadingTask =
          pdfjsLib.getDocument({
            url: src,
          })

        documentProxy =
          await loadingTask.promise

        if (cancelled) {
          return
        }

        const totalPages =
          documentProxy.numPages

        setPageCount(totalPages)

        const generatedPages: PageImage[] = []

        for (
          let index = 1;
          index <= totalPages;
          index += 1
        ) {
          if (cancelled) {
            break
          }

          const page =
            await documentProxy.getPage(index)

          const baseViewport =
            page.getViewport({
              scale: 1,
            })

          /*
            Renderizamos a una resolución suficiente
            para conservar nitidez en escritorio.
          */

          const targetWidth = 1500

          const scale = Math.min(
            2,
            targetWidth / baseViewport.width
          )

          const viewport =
            page.getViewport({
              scale,
            })

          const canvas =
            document.createElement('canvas')

          const context =
            canvas.getContext('2d')

          if (!context) {
            continue
          }

          const pixelRatio =
            window.devicePixelRatio || 1

          canvas.width =
            Math.floor(
              viewport.width * pixelRatio
            )

          canvas.height =
            Math.floor(
              viewport.height * pixelRatio
            )

          context.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
          )

          context.fillStyle = '#ffffff'

          context.fillRect(
            0,
            0,
            viewport.width,
            viewport.height
          )

          const renderTask =
            page.render({
              canvas,
              canvasContext: context,
              viewport,
            })

          await renderTask.promise

          if (cancelled) {
            break
          }

          /*
            WebP reduce considerablemente el peso
            sin sacrificar demasiado la calidad.
            Si el navegador no lo soporta,
            utilizamos PNG.
          */

          const webp =
            canvas.toDataURL(
              'image/webp',
              0.96
            )

          const imageSrc =
            webp.startsWith(
              'data:image/webp'
            )
              ? webp
              : canvas.toDataURL(
                  'image/png'
                )

          generatedPages.push({
            src: imageSrc,
            number: index,
          })

          setProgress(
            Math.round(
              (index / totalPages) * 100
            )
          )
        }

        if (!cancelled) {
          setPages(generatedPages)
          setLoading(false)
        }
      } catch (loadError: unknown) {
        if (cancelled) {
          return
        }

        console.error(
          'Error preparando el flipbook:',
          loadError
        )

        setError(
          'No se pudo preparar la cartilla.'
        )

        setLoading(false)
      } finally {
  // PDF.js libera el documento al finalizar
}
    }

    void loadPdf()

    return () => {
      cancelled = true
    }
  }, [src])

  /* ========================================
     PÁGINAS ESTABLES
     IMPORTANTÍSIMO PARA EL MOTOR
  ======================================== */

  const pageElements = useMemo(() => {
    return pages.map((page) => (
      <div
        key={page.number}
        className="flipbook-page"
      >
        <div className="flipbook-page-inner">
          <img
            src={page.src}
            alt={`Página ${page.number}`}
            draggable={false}
          />
        </div>
      </div>
    ))
  }, [pages])

  /* ========================================
     ESTADO DEL LIBRO
  ======================================== */

  const syncBook = (
    snapshot: BookSnapshot
  ) => {
    setPageNumber(snapshot.page)
    setPageCount(snapshot.pageCount)
    const visible = bookRef.current?.pageFlip()?.getVisiblePages() ?? []
setVisiblePages(visible)
  }

  /* ========================================
     TECLADO
  ======================================== */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [onClose])

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div className="pdf-flip-viewer">

      <header className="pdf-flip-header">

        <div className="pdf-flip-heading">

          <span>
            DOCUMENTO / CARTILLA
          </span>

          <strong>
            {title}
          </strong>

        </div>

        <button
        type="button"
        className="pdf-flip-fullscreen"
        onClick={toggleFullscreen}
        aria-label={
          isFullscreen
            ? 'Salir de pantalla completa'
            : 'Ver en pantalla completa'
        }
      >
        {isFullscreen ? 'SALIR' : 'PANTALLA COMPLETA'} ↗
      </button>

        <button
          type="button"
          className="pdf-flip-close"
          onClick={onClose}
        >
          CERRAR ×
        </button>

      </header>

      <main className="pdf-flip-stage">

        {loading && (
          <div className="pdf-flip-loading">

            <div className="pdf-flip-loading-number">
              {progress}
              <span>%</span>
            </div>

            <div className="pdf-flip-loading-line">
              <div
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p>
              PREPARANDO CARTILLA
            </p>

          </div>
        )}

        {!loading && error && (
          <div className="pdf-flip-error">

            <p>{error}</p>

            <button
              type="button"
              onClick={onClose}
            >
              CERRAR
            </button>

          </div>
        )}

        {!loading &&
          !error &&
          pages.length > 0 && (
            <div className="pdf-flip-book-wrap">

              <div className="pdf-flip-glow" />

              <HTMLFlipBook
                ref={bookRef}
                width={bookWidth}
                height={bookHeight}
                className="premium-flipbook"
                pageBackground="#ffffff"
                controls="none"
                lazyRadius={2}
                useKeyboard={true}
                aria-label={title}
                onLoaded={syncBook}
                onPageChange={syncBook}
              >
                {pageElements}
              </HTMLFlipBook>

              <div className="pdf-flip-spine" />

            </div>
          )}

        {!loading &&
          !error &&
          pages.length > 0 && (
            <>

              <button
                type="button"
                className="pdf-flip-nav pdf-flip-prev"
                disabled={pageNumber <= 0}
                onClick={() => {
  bookRef.current?.flipPrev()
}}
              >
                <span>←</span>
                <small>ANTERIOR</small>
              </button>

              <button
                type="button"
                className="pdf-flip-nav pdf-flip-next"
                disabled={
                  pageNumber >=
                  pageCount - 1
                }
                onClick={() => {
                  bookRef.current?.flipNext()
                }}
              >
                <small>SIGUIENTE</small>
                <span>→</span>
              </button>

            </>
          )}

      </main>

      {!loading &&
        !error &&
        pages.length > 0 && (
          <footer className="pdf-flip-footer">

            <span>
              RUTA DEL EMPRENDEDOR
            </span>

            <strong>
            {visiblePages.length > 1
              ? `${visiblePages[0] + 1}—${
                  visiblePages[visiblePages.length - 1] + 1
                }`
              : `${(visiblePages[0] ?? pageNumber) + 1}`}
            {' / '}
            {pageCount
              .toString()
              .padStart(2, '0')}
          </strong>

            <span>
              ARRASTRA · HAZ CLIC · ← →
            </span>

          </footer>
        )}

    </div>
  )
}

export default PDFBookFlipViewer