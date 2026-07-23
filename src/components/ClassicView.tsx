import type { Shot } from '../types'

interface Props {
  shots: Shot[]
}

const MOCK_STYLES = [
  'linear-gradient(135deg, #2a1a3a, #4a3050)',
  'linear-gradient(135deg, #1a2a3a, #2a4050)',
  'linear-gradient(135deg, #3a2a1a, #504030)',
  'linear-gradient(135deg, #1a3a2a, #2a5030)',
  'linear-gradient(135deg, #3a1a1a, #503030)',
  'linear-gradient(135deg, #2a2a3a, #404050)',
]

export default function ClassicView({ shots }: Props) {
  return (
    <div className="classic-body">
      <div className="storyboard-grid">
        {shots.map((shot, i) => {
          let annotations = ''
          if (shot.cameraMove.includes('推')) {
            annotations += `<div class="arrow-annotation" style="top:10px;left:50%;transform:translateX(-50%);"><span class="arrow">←</span> ${shot.cameraMove}</div>`
          }
          if (shot.action.includes('移动') || shot.action.includes('远离') || shot.action.includes('回头')) {
            annotations += `<div class="arrow-annotation" style="bottom:40px;left:20px;"><span class="arrow">→</span> ${shot.action}</div>`
          }

          return (
            <div className="storyboard-cell" key={shot.id}>
              <div
                className="cell-image"
                style={{
                  background: shot.imageUrl
                    ? `url(${shot.imageUrl}) center/cover`
                    : MOCK_STYLES[i % MOCK_STYLES.length],
                }}
              >
                {!shot.imageUrl && (
                  <div className="placeholder-text">🎨<br />AI 参考图</div>
                )}
                <div className="cell-annotations" dangerouslySetInnerHTML={{ __html: annotations }} />
              </div>
              <div className="cell-info">
                <div className="cell-info-top">
                  <span className="cell-number">{shot.number}</span>
                  <span className="cell-shot-type">{shot.shotType}</span>
                </div>
                <div className="cell-desc">{shot.description}</div>
                <div className="cell-camera">
                  镜头：{shot.cameraMove}{shot.action ? ` · ${shot.action}` : ''}
                </div>
                {shot.dialogue && (
                  <div className="cell-dialogue">「{shot.dialogue}」</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
