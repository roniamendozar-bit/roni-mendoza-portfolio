import { useEffect, useRef, useState } from 'react'

import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import './PDFBookViewer.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

interface PDFBookViewerProps {
  src: string
  title: string
  onClose: () => void
}

type PageDirection = 'next' | 'previous'

function PDFBookViewer({
  src,
  title,
  onClose,
}: PDFBookViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null)

  const [pdfDocument, setPdfDocument] =
    useState<pdfjsLib.PDFDocumentProxy | null>(null)

  const [pageNumber, setPageNumber] = useState(1)
  const [pageCount, setPageCount] = useState(0)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [isTurning, setIsTurning] = useState(false)
  const [turnDirection, setTurnDirection] =
    useState<PageDirection>('next')

  const [turnSnapshot, setTurnSnapshot] =
    useState<string | null>(null)

  /* ========================================
     CARGAR DOCUMENTO
  ======================================== */

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setError('')
    setPageNumber(1)
    setPageCount(0)
    setPdfDocument(null)

    const loadingTask = pdfjsLib.getDocument({
      url: src,
    })

    loadingTask.promise
      .then((document) => {
        if (cancelled) {
          return
        }

        setPdfDocument(document)
        setPageCount(document.numPages)
        setIsLoading(false)
      })
      .catch((loadError: unknown) => {
        if (cancelled) {
          return
        }

        console.error(
          'Error al cargar PDF:',
          loadError
        )

        setIsLoading(false)
        setError(
          'No se pudo cargar la cartilla.'
        )
      })

    return () => {
      cancelled = true

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
        renderTaskRef.current = null
      }

      void loadingTask.destroy()
    }
  }, [src])

  /* ========================================
     RENDERIZAR UNA PÁGINA
  ======================================== */

  const renderPage = async (targetPage: number) => {
    if (
      !pdfDocument ||
      !canvasRef.current ||
      !stageRef.current
    ) {
      return false
    }

    try {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
        renderTaskRef.current = null
      }

      const page =
        await pdfDocument.getPage(targetPage)

      if (
        !canvasRef.current ||
        !stageRef.current
      ) {
        return false
      }

      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (!context) {
        return false
      }

      const baseViewport =
        page.getViewport({
          scale: 1,
        })

      const stageWidth =
        stageRef.current.clientWidth

      const stageHeight =
        stageRef.current.clientHeight

      const availableWidth =
        Math.max(300, stageWidth - 80)

      const availableHeight =
        Math.max(300, stageHeight - 70)

      const widthScale =
        availableWidth / baseViewport.width

      const heightScale =
        availableHeight / baseViewport.height

      const scale = Math.min(
        widthScale,
        heightScale,
        1.8
      )

      const viewport =
        page.getViewport({
          scale,
        })

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

      canvas.style.width =
        `${Math.floor(viewport.width)}px`

      canvas.style.height =
        `${Math.floor(viewport.height)}px`

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      )

      context.clearRect(
        0,
        0,
        viewport.width,
        viewport.height
      )

      renderTaskRef.current =
        page.render({
          canvas,
          canvasContext: context,
          viewport,
        })

      await renderTaskRef.current.promise

      renderTaskRef.current = null

      return true
    } catch (renderError: unknown) {
      renderTaskRef.current = null

      if (
        renderError instanceof Error &&
        renderError.name ===
          'RenderingCancelledException'
      ) {
        return false
      }

      console.error(
        'Error al renderizar página:',
        renderError
      )

      setError(
        `No se pudo renderizar la página ${targetPage}.`
      )

      return false
    }
  }

  /* ========================================
     RENDER INICIAL
  ======================================== */

  useEffect(() => {
    if (!pdfDocument) {
      return
    }

    void renderPage(1)
  }, [pdfDocument])

  /* ========================================
     CAMBIAR DE PÁGINA
  ======================================== */

  const changePage = async (
    targetPage: number,
    direction: PageDirection
  ) => {
    if (
      !pdfDocument ||
      isTurning ||
      targetPage < 1 ||
      targetPage > pageCount ||
      !canvasRef.current
    ) {
      return
    }

    /*
      Capturamos la página actual antes de
      cambiarla. Esa captura será la "hoja"
      que físicamente girará.
    */

    const snapshot =
      canvasRef.current.toDataURL(
        'image/png'
      )

    setTurnSnapshot(snapshot)
    setTurnDirection(direction)

    /*
      Renderizamos la página siguiente
      debajo de la hoja actual.
    */

    const rendered =
      await renderPage(targetPage)

    if (!rendered) {
      setTurnSnapshot(null)
      return
    }

    setPageNumber(targetPage)
    setIsTurning(true)

    window.setTimeout(() => {
      setIsTurning(false)
      setTurnSnapshot(null)
    }, 620)
  }

  const nextPage = () => {
    void changePage(
      pageNumber + 1,
      'next'
    )
  }

  const previousPage = () => {
    void changePage(
      pageNumber - 1,
      'previous'
    )
  }

  /* ========================================
     TECLADO
  ======================================== */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'ArrowRight') {
        nextPage()
      }

      if (event.key === 'ArrowLeft') {
        previousPage()
      }

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
  })

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div className="pdf-book-viewer">

      <div className="pdf-book-header">

        <div className="pdf-book-title">

          <span>
            DOCUMENTO / CARTILLA
          </span>

          <strong>
            {title}
          </strong>

        </div>

        <button
          type="button"
          className="pdf-book-close"
          onClick={onClose}
        >
          CERRAR ×
        </button>

      </div>

      <div
        ref={stageRef}
        className="pdf-book-stage"
      >

        {isLoading && (
          <div className="pdf-book-loading">

            <span />

            <p>
              CARGANDO CARTILLA
            </p>

          </div>
        )}

        {error && (
          <div className="pdf-book-error">

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.reload()
              }}
            >
              RECARGAR
            </button>

          </div>
        )}

        {!isLoading && !error && (
          <div className="pdf-page-shell">

            <div className="pdf-page-shadow" />

            <canvas
              ref={canvasRef}
              className="pdf-page-canvas"
            />

            {turnSnapshot && (
              <div
                className={[
                  'pdf-page-turn',
                  isTurning
                    ? `is-turning-${turnDirection}`
                    : '',
                ].join(' ')}
              >

                <img
                  src={turnSnapshot}
                  alt=""
                  className="pdf-page-turn-image"
                  aria-hidden="true"
                />

                <div className="pdf-page-curl" />

              </div>
            )}

          </div>
        )}

        {!isLoading && !error && (
          <>
            <button
              type="button"
              className="pdf-nav pdf-nav-previous"
              onClick={previousPage}
              disabled={
                pageNumber <= 1 ||
                isTurning
              }
              aria-label="Página anterior"
            >
              <span>←</span>
              <small>ANTERIOR</small>
            </button>

            <button
              type="button"
              className="pdf-nav pdf-nav-next"
              onClick={nextPage}
              disabled={
                pageNumber >= pageCount ||
                isTurning
              }
              aria-label="Página siguiente"
            >
              <small>SIGUIENTE</small>
              <span>→</span>
            </button>
          </>
        )}

      </div>

      {!isLoading && !error && (
        <div className="pdf-book-footer">

          <span>
            RUTA DEL EMPRENDEDOR
          </span>

          <span className="pdf-page-counter">
            {pageNumber
              .toString()
              .padStart(2, '0')}
            {' / '}
            {pageCount
              .toString()
              .padStart(2, '0')}
          </span>

          <span>
            ← → PARA NAVEGAR
          </span>

        </div>
      )}

    </div>
  )
}

export default PDFBookViewer