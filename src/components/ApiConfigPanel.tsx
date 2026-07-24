import { useState, useEffect } from 'react'
import type { ApiConfigs, ApiConfigItem } from '../types'
import { DEFAULT_SINGLE_CONFIG } from '../types'

interface Props {
  configs: ApiConfigs
  onSave: (configs: ApiConfigs) => void
  onClose: () => void
}

const PRESETS = {
  openai: {
    textBaseUrl: 'https://api.openai.com/v1', textModel: 'gpt-4o',
    imageBaseUrl: 'https://api.openai.com/v1', imageModel: 'dall-e-3',
  },
  moonshot: {
    textBaseUrl: 'https://api.moonshot.cn/v1', textModel: 'moonshot-v1-8k',
    imageBaseUrl: '', imageModel: '',
  },
  deepseek: {
    textBaseUrl: 'https://api.deepseek.com', textModel: 'deepseek-chat',
    imageBaseUrl: '', imageModel: '',
  },
  siliconflow: {
    textBaseUrl: 'https://api.siliconflow.cn/v1', textModel: 'Qwen/Qwen2.5-72B-Instruct',
    imageBaseUrl: 'https://api.siliconflow.cn/v1', imageModel: 'stabilityai/stable-diffusion-3-5-large',
  },
  custom: { textBaseUrl: '', textModel: '', imageBaseUrl: '', imageModel: '' },
}

type ViewMode = 'list' | 'edit'

export default function ApiConfigPanel({ configs, onSave, onClose }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text')
  const [form, setForm] = useState<Partial<ApiConfigItem>>({})

  const editingConfig = editingId ? configs.configs.find(c => c.id === editingId) : undefined

  useEffect(() => {
    if (viewMode === 'edit') {
      if (editingConfig) {
        setForm({ ...editingConfig })
      } else {
        setForm({
          name: '',
          textBaseUrl: '', textApiKey: '', textModel: '', textSystemPrompt: DEFAULT_SINGLE_CONFIG.textSystemPrompt,
          imageBaseUrl: '', imageApiKey: '', imageModel: '', imageSize: '1024x1024',
        })
      }
      setActiveTab('text')
    }
  }, [viewMode, editingId, editingConfig])

  const applyPreset = (key: keyof typeof PRESETS) => {
    const preset = PRESETS[key]
    setForm(prev => ({
      ...prev,
      textBaseUrl: preset.textBaseUrl || prev.textBaseUrl,
      textModel: preset.textModel || prev.textModel,
      imageBaseUrl: preset.imageBaseUrl || prev.imageBaseUrl,
      imageModel: preset.imageModel || prev.imageModel,
    }))
  }

  const handleSave = () => {
    const name = form.name?.trim()
    if (!name) { alert('请输入配置名称'); return }

    const newCfg: ApiConfigItem = {
      id: editingId || `cfg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      textBaseUrl: form.textBaseUrl || '',
      textApiKey: form.textApiKey || '',
      textModel: form.textModel || '',
      textSystemPrompt: form.textSystemPrompt || DEFAULT_SINGLE_CONFIG.textSystemPrompt,
      imageBaseUrl: form.imageBaseUrl || '',
      imageApiKey: form.imageApiKey || '',
      imageModel: form.imageModel || '',
      imageSize: form.imageSize || '1024x1024',
    }

    let newConfigs = [...configs.configs]
    const idx = newConfigs.findIndex(c => c.id === newCfg.id)
    if (idx >= 0) {
      newConfigs[idx] = newCfg
    } else {
      newConfigs.push(newCfg)
    }

    const next: ApiConfigs = {
      configs: newConfigs,
      activeTextConfigId: configs.activeTextConfigId || newCfg.id,
      activeImageConfigId: configs.activeImageConfigId || newCfg.id,
    }

    onSave(next)
    setViewMode('list')
  }

  const handleDelete = () => {
    if (!editingId) return
    if (!confirm('确定删除此配置吗？')) return

    const newConfigs = configs.configs.filter(c => c.id !== editingId)
    const next: ApiConfigs = {
      configs: newConfigs,
      activeTextConfigId: configs.activeTextConfigId === editingId ? (newConfigs[0]?.id || null) : configs.activeTextConfigId,
      activeImageConfigId: configs.activeImageConfigId === editingId ? (newConfigs[0]?.id || null) : configs.activeImageConfigId,
    }
    onSave(next)
    setViewMode('list')
  }

  const handleSetActive = (id: string) => {
    onSave({
      ...configs,
      activeTextConfigId: id,
      activeImageConfigId: id,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: 560 }}>
        <div className="modal-header">
          <h3>⚙️ API 配置管理</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {viewMode === 'list' && (
          <div className="config-list">
            <div className="config-list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: '#888' }}>已保存的配置</span>
              <button
                className="btn-add-config"
                style={{ padding: '4px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 5, fontSize: 12, cursor: 'pointer' }}
                onClick={() => { setEditingId(null); setViewMode('edit') }}
              >
                ＋ 新建配置
              </button>
            </div>
            {configs.configs.length === 0 && (
              <p style={{ color: '#666', fontSize: 13, textAlign: 'center', padding: 20 }}>
                暂无配置，点击「新建配置」添加
              </p>
            )}
            {configs.configs.map(cfg => (
              <div
                key={cfg.id}
                className={`config-item ${cfg.id === configs.activeTextConfigId || cfg.id === configs.activeImageConfigId ? 'active' : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  background: 'var(--bg-dark)', border: `1px solid ${cfg.id === configs.activeTextConfigId ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 8, marginBottom: 8, cursor: 'pointer',
                }}
                onClick={() => handleSetActive(cfg.id)}
              >
                <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{cfg.name}</span>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'rgba(255,255,255,0.08)', color: '#aaa' }}>
                  {cfg.textModel || '未配置文本'}
                </span>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'rgba(255,255,255,0.08)', color: '#aaa' }}>
                  {cfg.imageModel || '未配置生图'}
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    className="cfg-btn"
                    style={{ padding: '3px 8px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 4, color: '#aaa', fontSize: 11, cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); setEditingId(cfg.id); setViewMode('edit') }}
                  >
                    编辑
                  </button>
                  <button
                    className="cfg-btn"
                    style={{ padding: '3px 8px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 4, color: '#aaa', fontSize: 11, cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); handleSetActive(cfg.id) }}
                  >
                    设为默认
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'edit' && (
          <>
            <div className="preset-buttons">
              <label>快速选择：</label>
              {Object.entries(PRESETS).map(([key]) => (
                <button key={key} className="preset-btn" onClick={() => applyPreset(key as keyof typeof PRESETS)}>
                  {key === 'openai' ? 'OpenAI' :
                   key === 'moonshot' ? 'Moonshot' :
                   key === 'deepseek' ? 'DeepSeek' :
                   key === 'siliconflow' ? 'SiliconFlow' : '自定义'}
                </button>
              ))}
            </div>
            <div className="config-edit" style={{ padding: '14px 18px', overflowY: 'auto', flex: 1 }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 12, cursor: 'pointer', marginBottom: 12 }}
                onClick={() => setViewMode('list')}
              >
                ← 返回配置列表
              </div>
              <div className="form-group">
                <label>配置名称</label>
                <input
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="例如：OpenAI 全栈"
                />
              </div>
              <div className="config-tabs">
                <button className={activeTab === 'text' ? 'active' : ''} onClick={() => setActiveTab('text')}>
                  📝 文本大模型
                </button>
                <button className={activeTab === 'image' ? 'active' : ''} onClick={() => setActiveTab('image')}>
                  🎨 生图大模型
                </button>
              </div>

              {activeTab === 'text' && (
                <div className="config-section" style={{ display: 'block' }}>
                  <div className="form-group">
                    <label>Base URL</label>
                    <input value={form.textBaseUrl || ''} onChange={(e) => setForm({ ...form, textBaseUrl: e.target.value })} placeholder="https://api.openai.com/v1" />
                  </div>
                  <div className="form-group">
                    <label>API Key</label>
                    <input type="password" value={form.textApiKey || ''} onChange={(e) => setForm({ ...form, textApiKey: e.target.value })} placeholder="sk-..." />
                  </div>
                  <div className="form-group">
                    <label>模型名称</label>
                    <input value={form.textModel || ''} onChange={(e) => setForm({ ...form, textModel: e.target.value })} placeholder="gpt-4o" />
                  </div>
                  <div className="form-group">
                    <label>系统提示词（System Prompt）</label>
                    <textarea rows={6} value={form.textSystemPrompt || ''} onChange={(e) => setForm({ ...form, textSystemPrompt: e.target.value })} />
                    <small style={{ color: '#666' }}>控制 AI 如何解析剧本</small>
                  </div>
                </div>
              )}

              {activeTab === 'image' && (
                <div className="config-section" style={{ display: 'block' }}>
                  <div className="form-group">
                    <label>Base URL</label>
                    <input value={form.imageBaseUrl || ''} onChange={(e) => setForm({ ...form, imageBaseUrl: e.target.value })} placeholder="https://api.openai.com/v1" />
                  </div>
                  <div className="form-group">
                    <label>API Key</label>
                    <input type="password" value={form.imageApiKey || ''} onChange={(e) => setForm({ ...form, imageApiKey: e.target.value })} placeholder="sk-..." />
                  </div>
                  <div className="form-group">
                    <label>模型名称</label>
                    <input value={form.imageModel || ''} onChange={(e) => setForm({ ...form, imageModel: e.target.value })} placeholder="dall-e-3" />
                  </div>
                  <div className="form-group">
                    <label>图片尺寸</label>
                    <select value={form.imageSize || '1024x1024'} onChange={(e) => setForm({ ...form, imageSize: e.target.value })}>
                      <option value="1024x1024">1024x1024</option>
                      <option value="1024x1792">1024x1792 (竖版)</option>
                      <option value="1792x1024">1792x1024 (横版)</option>
                      <option value="512x512">512x512</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-actions">
              {editingId && (
                <button className="btn-secondary" style={{ marginRight: 'auto', color: '#ff4444', borderColor: '#ff4444' }} onClick={handleDelete}>
                  🗑️ 删除
                </button>
              )}
              <button className="btn-secondary" onClick={() => setForm({ ...DEFAULT_SINGLE_CONFIG, name: form.name })}>
                恢复默认
              </button>
              <button className="btn-primary" onClick={handleSave}>
                保存配置
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
