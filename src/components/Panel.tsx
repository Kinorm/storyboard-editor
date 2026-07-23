import type { StoryboardPanel } from '../types'
import './Panel.css'

interface Props {
  panel: StoryboardPanel | null
  onUpdate: (panel: StoryboardPanel) => void
  onDelete: (id: string) => void
}

export default function Panel({ panel, onUpdate, onDelete }: Props) {
  if (!panel) {
    return (
      <div className="side-panel empty">
        <p>👈 在画布上选择一个分镜进行编辑</p>
      </div>
    )
  }

  return (
    <div className="side-panel">
      <h3>✏️ 分镜属性</h3>
      <div className="form-group">
        <label>标题</label>
        <input
          type="text"
          value={panel.title}
          onChange={(e) =>
            onUpdate({ ...panel, title: e.target.value })
          }
        />
      </div>
      <div className="form-group">
        <label>描述</label>
        <textarea
          rows={4}
          value={panel.description}
          onChange={(e) =>
            onUpdate({ ...panel, description: e.target.value })
          }
        />
      </div>
      <div className="form-group">
        <label>位置</label>
        <div className="input-row">
          <input
            type="number"
            value={Math.round(panel.x)}
            onChange={(e) =>
              onUpdate({ ...panel, x: Number(e.target.value) })
            }
          />
          <input
            type="number"
            value={Math.round(panel.y)}
            onChange={(e) =>
              onUpdate({ ...panel, y: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="form-group">
        <label>尺寸</label>
        <div className="input-row">
          <input
            type="number"
            value={panel.width}
            onChange={(e) =>
              onUpdate({ ...panel, width: Number(e.target.value) })
            }
          />
          <span>×</span>
          <input
            type="number"
            value={panel.height}
            onChange={(e) =>
              onUpdate({ ...panel, height: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="form-actions">
        <button
          className="btn-delete"
          onClick={() => onDelete(panel.id)}
        >
          🗑️ 删除分镜
        </button>
      </div>
    </div>
  )
}
