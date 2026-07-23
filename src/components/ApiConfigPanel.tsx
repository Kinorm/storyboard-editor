import { useState, useEffect } from 'react'
import type { ApiConfig } from '../types'
import { DEFAULT_API_CONFIG } from '../types'

interface Props {
  config: ApiConfig
  onSave: (config: ApiConfig) => void
  onClose: () => void
}

const PRESETS = {
  openai: {
    textBaseUrl: 'https://api.openai.com/v1',
    textModel: 'gpt-4o',
    imageBaseUrl: 'https://api.openai.com/v1',
    imageModel: 'dall-e-3',
  },
  moonshot: {
    textBaseUrl: 'https://api.moonshot.cn/v1',
    textModel: 'moonshot-v1-8k',
    imageBaseUrl: '',
    imageModel: '',
  },
  deepseek: {
    textBaseUrl: 'https://api.deepseek.com',
    textModel: 'deepseek-chat',
    imageBaseUrl: '',
    imageModel: '',
  },
  siliconflow: {
    textBaseUrl: 'https://api.siliconflow.cn/v1',
    textModel: 'Qwen/Qwen2.5-72B-Instruct',
    imageBaseUrl: 'https://api.siliconflow.cn/v1',
    imageModel: 'stabilityai/stable-diffusion-3-5-large',
  },
  custom: {
    textBaseUrl: '',
    textModel: '',
    imageBaseUrl: '',
    imageModel: '',
  },
}

export default function ApiConfigPanel({ config, onSave, onClose }: Props) {
  const [form, setForm] = useState<ApiConfig>({ ...config })
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text')

  useEffect(() => {
    setForm({ ...config })
  }, [config])

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⚙️ API 配置</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

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

        <div className="config-tabs">
          <button className={activeTab === 'text' ? 'active' : ''} onClick={() => setActiveTab('text')}>
            📝 文本大模型
          </button>
          <button className={activeTab === 'image' ? 'active' : ''} onClick={() => setActiveTab('image')}>
            🎨 生图大模型
          </button>
        </div>

        {activeTab === 'text' && (
          <div className="config-section">
            <div className="form-group">
              <label>Base URL</label>
              <input
                value={form.textBaseUrl}
                onChange={(e) => setForm({ ...form, textBaseUrl: e.target.value })}
                placeholder="https://api.openai.com/v1"
              />
            </div>
            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                value={form.textApiKey}
                onChange={(e) => setForm({ ...form, textApiKey: e.target.value })}
                placeholder="sk-..."
              />
            </div>
            <div className="form-group">
              <label>模型名称</label>
              <input
                value={form.textModel}
                onChange={(e) => setForm({ ...form, textModel: e.target.value })}
                placeholder="gpt-4o"
              />
            </div>
            <div className="form-group">
              <label>系统提示词（System Prompt）</label>
              <textarea
                rows={6}
                value={form.textSystemPrompt}
                onChange={(e) => setForm({ ...form, textSystemPrompt: e.target.value })}
              />
              <small style={{ color: '#666' }}>控制 AI 如何解析剧本</small>
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="config-section">
            <div className="form-group">
              <label>Base URL</label>
              <input
                value={form.imageBaseUrl}
                onChange={(e) => setForm({ ...form, imageBaseUrl: e.target.value })}
                placeholder="https://api.openai.com/v1"
              />
            </div>
            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                value={form.imageApiKey}
                onChange={(e) => setForm({ ...form, imageApiKey: e.target.value })}
                placeholder="sk-..."
              />
            </div>
            <div className="form-group">
              <label>模型名称</label>
              <input
                value={form.imageModel}
                onChange={(e) => setForm({ ...form, imageModel: e.target.value })}
                placeholder="dall-e-3"
              />
            </div>
            <div className="form-group">
              <label>图片尺寸</label>
              <select
                value={form.imageSize}
                onChange={(e) => setForm({ ...form, imageSize: e.target.value })}
              >
                <option value="1024x1024">1024x1024</option>
                <option value="1024x1792">1024x1792 (竖版)</option>
                <option value="1792x1024">1792x1024 (横版)</option>
                <option value="512x512">512x512</option>
              </select>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setForm(DEFAULT_API_CONFIG)}>
            恢复默认
          </button>
          <button className="btn-primary" onClick={() => { onSave(form); onClose() }}>
            保存配置
          </button>
        </div>
      </div>
    </div>
  )
}
