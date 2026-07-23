import { useState } from 'react'
import type { Shot } from '../types'

interface Props {
  shots: Shot[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onUpdate: (shot: Shot) => void
  generatingMap: Record<string, boolean>
  onGenerateImage: (shot: Shot) => void
}

const MOCK_STYLES = [
  'linear-gradient(135deg, #2a1a3a, #4a3050)',
  'linear-gradient(135deg, #1a2a3a, #2a4050)',
  'linear-gradient(135deg, #3a2a1a, #504030)',
  'linear-gradient(135deg, #1a3a2a, #2a5030)',
  'linear-gradient(135deg, #3a1a1a, #503030)',
  'linear-gradient(135deg, #2a2a3a, #404050)',
]

export default function ModernView({ shots, selectedId, onSelect, onUpdate, generatingMap, onGenerateImage }: Props) {
  return (
    <div className="modern-body">
      <div className="modern-canvas-area">
        <div className="shot-strip">
          {shots.map((shot, i) => (
            <div
              key={shot.id}
              className={`shot-card ${shot.id === selectedId ? 'selected' : ''}`}
              onClick={() => onSelect(shot.id === selectedId ? null : shot.id)}
            >
              <div className="shot-header">
                <span className="shot-number">{shot.number}</span>
                <span style={{ flex: 1, fontWeight: 500 }}>{shot.title}</span>
                <div className="shot-meta">
                  <span className="meta-tag">{shot.shotType}</span>
                  <span className="meta-tag">{shot.duration}s</span>
                </div>
              </div>
              <div
                className="shot-image"
                style={{
                  background: shot.imageUrl
                    ? `url(${shot.imageUrl}) center/cover`
                    : MOCK_STYLES[i % MOCK_STYLES.length],
                }}
              >
                {!shot.imageUrl && (
                  <>
                    <div className="placeholder-text">
                      🎨<br /><small>点击生成参考图</small>
                    </div>
                    <span className="ai-badge">AI 生成</span>
                  </>
                )}
                {generatingMap[shot.id] && (
                  <div className="generating-overlay">
                    <div className="spinner" /> 生成中……
                  </div>
                )}
              </div>
              <div className="shot-content">
                <div className="shot-field">
                  <label>画面描述</label>
                  <div className="value">{shot.description}</div>
                </div>
                {shot.dialogue && (
                  <div className="shot-field">
                    <label>对白 / 旁白</label>
                    <div className="value dialogue">{shot.dialogue}</div>
                  </div>
                )}
                <div className="shot-field">
                  <label>镜头运动</label>
                  <div className="value">{shot.cameraMove}</div>
                </div>
              </div>
              <button
                className="btn-gen-img"
                onClick={(e) => { e.stopPropagation(); onGenerateImage(shot) }}
                disabled={generatingMap[shot.id]}
              >
                {generatingMap[shot.id] ? '⏳' : '🎨'} 生成参考图
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
