import { useEffect, useRef, useState } from 'react'

type MediaType = 'image' | 'video' | 'pdf'

interface MediaViewerProps {
  isOpen: boolean
  type: MediaType
  src: string
  title: string
  onClose: () => void
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) {
    return '00:00'
  }

  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

function PremiumVideoPlayer({
  src,
  title,
}: {
  src: string
  title: string
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
    useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    const playVideo = async () => {
      try {
        await video.play()
        setIsPlaying(true)
      } catch {
        setIsPlaying(false)
      }
    }

    playVideo()
  }, [src])

  const togglePlay = async () => {
    const video = videoRef.current

    if (!video) {
      return
    }

    if (video.paused) {
      await video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current

    if (!video) {
      return
    }

    setCurrentTime(video.currentTime)
  }

  const handleLoadedMetadata = () => {
    const video = videoRef.current

    if (!video) {
      return
    }

    setDuration(video.duration)
  }

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    const nextTime = Number(event.target.value)

    if (!video) {
      return
    }

    video.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  const toggleMute = () => {
    const video = videoRef.current

    if (!video) {
      return
    }

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const enterFullscreen = async () => {
    const video = videoRef.current

    if (!video) {
      return
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }

    await video.requestFullscreen()
  }

  return (
    <div className="premium-player">

      <video
        ref={videoRef}
        className="premium-video"
        src={src}
        preload="metadata"
        playsInline
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        aria-label={title}
        onClick={togglePlay}
      />

      <div className="premium-player-bottom">

        <button
          type="button"
          className="player-control"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
        >
          {isPlaying ? 'Ⅱ' : '▶'}
        </button>

        <span className="player-time">
          {formatTime(currentTime)}
        </span>

        <input
          className="player-progress"
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          aria-label="Progreso del video"
        />

        <span className="player-time">
          {formatTime(duration)}
        </span>

        <button
          type="button"
          className="player-control"
          onClick={toggleMute}
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar video'}
        >
          {isMuted ? 'VOL' : 'VOL+'}
        </button>

        <button
          type="button"
          className="player-control player-fullscreen"
          onClick={enterFullscreen}
          aria-label="Pantalla completa"
        >
          ⛶
        </button>

      </div>

    </div>
  )
}

function MediaViewer({
  isOpen,
  type,
  src,
  title,
  onClose,
}: MediaViewerProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="media-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose()
        }
      }}
    >
      <div className="media-viewer-top">

        <div>
          <span>VISUALIZADOR</span>
          <strong>{title}</strong>
        </div>

        <button
          type="button"
          className="viewer-close"
          onClick={onClose}
          aria-label="Cerrar visor"
        >
          CERRAR ×
        </button>

      </div>

      <div className={`media-viewer-content media-${type}`}>

        {type === 'image' && (
          <img
            src={src}
            alt={title}
            className="viewer-image"
          />
        )}

        {type === 'video' && (
          <PremiumVideoPlayer
            src={src}
            title={title}
          />
        )}

        {type === 'pdf' && (
          <iframe
            src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
            title={title}
            className="viewer-pdf"
          />
        )}

      </div>

    </div>
  )
}

export default MediaViewer