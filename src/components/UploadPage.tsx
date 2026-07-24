import { useState, useRef, useEffect } from 'react'
import type { ApiConfigs } from '../types'

interface Props {
  onParse: (script: string) => void
  onOpenConfig: () => void
  apiConfigured: boolean
  parsing: boolean
  apiConfigs: ApiConfigs
  onSelectTextConfig: (id: string) => void
  onSelectImageConfig: (id: string) => void
}

export default function UploadPage({
  onParse,
  onOpenConfig,
  apiConfigured,
  parsing,
  apiConfigs,
  onSelectTextConfig,
  onSelectImageConfig,
}: Props) {
  const [scriptText, setScriptText] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setScriptText(text)
    }
    reader.onerror = () => { alert('文件读取失败，请尝试手动粘贴内容') }
    reader.readAsText(file, 'UTF-8')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const textOpts = apiConfigs.configs.map(c => (
    <option key={c.id} value={c.id} selected={c.id === apiConfigs.activeTextConfigId}>
      {c.name}
    </option>
  ))
  const imgOpts = apiConfigs.configs.map(c => (
    <option key={c.id} value={c.id} selected={c.id === apiConfigs.activeImageConfigId}>
      {c.name}
    </option>
  ))

  return (
    <div className="upload-page">
      <h1>🎬 分镜画板工具</h1>
      <p style={{ color: '#888', fontSize: 14, marginTop: -20 }}>
        上传剧本，AI 自动解析生成分镜
      </p>

      <div
        className={`upload-box ${isDragOver ? 'dragover' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="icon">📄</div>
        <p>点击或拖拽上传剧本文件</p>
        <p className="sub">支持 .txt / .docx / .pdf / .md 格式</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.docx,.pdf"
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
      </div>

      <div className="script-editor">
        <label>或直接粘贴剧本内容：</label>
        <textarea
          rows={10}
          placeholder="在此粘贴剧本内容……"
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
        />
      </div>

      <div className="model-selectors">
        <div className="model-select-box">
          <label>📝 文本模型</label>
          <select onChange={(e) => onSelectTextConfig(e.target.value)} value={apiConfigs.activeTextConfigId || ''}>
            {apiConfigs.configs.length === 0 && <option>请先配置 API</option>}
            {textOpts}
          </select>
        </div>
        <div className="model-select-box">
          <label>🎨 生图模型</label>
          <select onChange={(e) => onSelectImageConfig(e.target.value)} value={apiConfigs.activeImageConfigId || ''}>
            {apiConfigs.configs.length === 0 && <option>请先配置 API</option>}
            {imgOpts}
          </select>
        </div>
      </div>

      <div className="upload-actions">
        <button className="btn-config" onClick={onOpenConfig}>
          ⚙️ {apiConfigured ? 'API 已配置' : '配置 API'}
        </button>
        <button
          className="btn-parse"
          onClick={() => onParse(scriptText)}
          disabled={!scriptText.trim() || parsing}
        >
          {parsing ? '⏳ AI 解析中……' : '🤖 AI 解析剧本'}
        </button>
      </div>

      {!apiConfigured && (
        <p style={{ color: '#e94560', fontSize: 13 }}>
          ⚠️ 请先点击「配置 API」添加至少一套文本模型配置
        </p>
      )}
    </div>
  )
}
