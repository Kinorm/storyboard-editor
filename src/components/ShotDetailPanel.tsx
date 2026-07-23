import type { Shot } from '../types'

interface Props {
  shot: Shot | null
  onUpdate: (shot: Shot) => void
  onDelete: (id: string) => void
  generatingMap: Record<string, boolean>
  onGenerateImage: (shot: Shot) => void
}

export default function ShotDetailPanel({ shot, onUpdate, onDelete, generatingMap, onGenerateImage }: Props) {
  if (!shot) {
    return (
      <div className="detail-panel empty">
        <div style={{ fontSize: 48, opacity: 0.3 }}>🎬</div>
        <p style={{ textAlign: 'center', lineHeight: 1.8 }}>
          点击分镜卡片<br />查看和编辑详情
        </p>
      </div>
    )
  }

  return (
    <div className="detail-panel">
      <h3>✏️ 镜头 #{shot.number} 详情</h3>

      <div className="form-group">
        <label>镜头标题</label>
        <input
          value={shot.title}
          onChange={(e) => onUpdate({ ...shot, title: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>景别</label>
          <select
            value={shot.shotType}
            onChange={(e) => onUpdate({ ...shot, shotType: e.target.value })}
          >
            <option>全景</option>
            <option>远景</option>
            <option>中景</option>
            <option>近景</option>
            <option>特写</option>
            <option>双人中景</option>
          </select>
        </div>
        <div className="form-group">
          <label>时长(秒)</label>
          <input
            type="number"
            value={shot.duration}
            onChange={(e) => onUpdate({ ...shot, duration: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>镜头运动</label>
        <input
          value={shot.cameraMove}
          onChange={(e) => onUpdate({ ...shot, cameraMove: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>画面描述</label>
        <textarea
          rows={3}
          value={shot.description}
          onChange={(e) => onUpdate({ ...shot, description: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>对白 / 旁白</label>
        <textarea
          rows={2}
          value={shot.dialogue}
          onChange={(e) => onUpdate({ ...shot, dialogue: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>动作说明</label>
        <input
          value={shot.action}
          onChange={(e) => onUpdate({ ...shot, action: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>备注</label>
        <input
          value={shot.notes}
          onChange={(e) => onUpdate({ ...shot, notes: e.target.value })}
        />
      </div>

      <button
        className="btn-primary"
        onClick={() => onGenerateImage(shot)}
        disabled={generatingMap[shot.id]}
      >
        {generatingMap[shot.id] ? '⏳ 生成中……' : '🎨 生成参考图'}
      </button>

      <button
        className="btn-secondary"
        onClick={() => { if (confirm('确定删除此镜头吗？')) onDelete(shot.id) }}
      >
        🗑️ 删除镜头
      </button>
    </div>
  )
}
