import { useRef, useState, useCallback, useEffect } from 'react'
import type { StoryboardPanel } from '../types'
import './StoryboardCanvas.css'

interface Props {
  panels: StoryboardPanel[]
  onSelect: (id: string | null) => void
  onMove: (id: string, x: number, y: number) => void
}

export default function StoryboardCanvas({ panels, onSelect, onMove }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<{
    id: string
    offsetX: number
    offsetY: number
  } | null>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, panel: StoryboardPanel) => {
      e.stopPropagation()
      onSelect(panel.id)
      setDragging({
        id: panel.id,
        offsetX: e.clientX - panel.x,
        offsetY: e.clientY - panel.y,
      })
    },
    [onSelect]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return
      const x = e.clientX - dragging.offsetX
      const y = e.clientY - dragging.offsetY
      onMove(dragging.id, x, y)
    },
    [dragging, onMove]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragging, handleMouseMove, handleMouseUp])

  const handleCanvasClick = useCallback(() => {
    onSelect(null)
  }, [onSelect])

  return (
    <div
      ref={canvasRef}
      className="storyboard-canvas"
      onClick={handleCanvasClick}
    >
      <div className="canvas-grid" />
      {panels.map((panel) => (
        <div
          key={panel.id}
          className={`panel-card ${panel.selected ? 'selected' : ''}`}
          style={{
            left: panel.x,
            top: panel.y,
            width: panel.width,
            height: panel.height,
          }}
          onMouseDown={(e) => handleMouseDown(e, panel)}
        >
          <div className="panel-header">
            <span className="panel-number">#{panel.id}</span>
            <span className="panel-title">{panel.title}</span>
          </div>
          <div className="panel-body">
            {panel.imageUrl ? (
              <img src={panel.imageUrl} alt={panel.title} />
            ) : (
              <div className="panel-placeholder">
                <span>🖼️</span>
                <small>点击添加参考图</small>
              </div>
            )}
          </div>
          <div className="panel-footer">
            <span>{panel.description || '暂无描述'}</span>
          </div>
          {panel.selected && (
            <>
              <div className="resize-handle nw" />
              <div className="resize-handle ne" />
              <div className="resize-handle sw" />
              <div className="resize-handle se" />
            </>
          )}
        </div>
      ))}
    </div>
  )
}
