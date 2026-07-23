import { useState, useRef } from 'react'
import type { ApiConfig } from '../types'

interface Props {
  onParse: (script: string) => void
  onOpenConfig: () => void
  apiConfigured: boolean
  parsing: boolean
}

export default function UploadPage({ onParse, onOpenConfig, apiConfigured, parsing }: Props) {
  const [scriptText, setScriptText] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setScriptText(text)
    }
    reader.readAsText(file)
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

      <div className="upload-actions">
        <button
          className="btn-config"
          onClick={onOpenConfig}
        >
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
          ⚠️ 请先点击「配置 API」设置你的大模型接口
        </p>
      )}
    </div>
  )
}
