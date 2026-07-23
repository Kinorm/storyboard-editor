import { useState, useCallback } from 'react'
import type { Shot, ApiConfig } from './types'
import { DEFAULT_API_CONFIG } from './types'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAI } from './hooks/useAI'
import UploadPage from './components/UploadPage'
import ApiConfigPanel from './components/ApiConfigPanel'
import ModernView from './components/ModernView'
import ClassicView from './components/ClassicView'
import ShotDetailPanel from './components/ShotDetailPanel'
import './App.css'

type Page = 'upload' | 'storyboard'
type ViewMode = 'modern' | 'classic'

function App() {
  const [page, setPage] = useState<Page>('upload')
  const [viewMode, setViewMode] = useState<ViewMode>('modern')
  const [apiConfig, setApiConfig] = useLocalStorage<ApiConfig>('sb-api-config', DEFAULT_API_CONFIG)
  const [showConfig, setShowConfig] = useState(false)
  const [shots, setShots] = useState<Shot[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [generatingMap, setGeneratingMap] = useState<Record<string, boolean>>({})
  const [parseError, setParseError] = useState<string | null>(null)

  const { parseScript, generateImage, parsing, error: aiError } = useAI(apiConfig)

  const apiConfigured = !!(apiConfig.textApiKey && apiConfig.textBaseUrl)

  const handleParse = useCallback(async (script: string) => {
    if (!script.trim()) return
    setParseError(null)
    try {
      const result = await parseScript(script)
      setShots(result)
      setPage('storyboard')
      setSelectedId(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '解析失败'
      setParseError(msg)
      alert(`解析失败：${msg}\n\n将使用演示数据展示。`)
      const demoShots: Shot[] = [
        { id: '1', number: 1, title: '雪夜庭院', scene: '开场', shotType: '全景', cameraMove: '缓慢推进', description: '雪夜庭院与廊桥，薄雾细雪，女子从右侧缓缓入画。远处灯火阑珊。', dialogue: '', action: '人物向左前方移动', duration: 5, notes: '氛围清冷', imagePrompt: '雪夜庭院，古风建筑，雪花飘落，女子白衣背影' },
        { id: '2', number: 2, title: '女子特写', scene: '开场', shotType: '近景', cameraMove: '镜头推近', description: '女子低头看掌心玉坠，神情犹豫不舍，轻轻握紧。', dialogue: '（内心独白）此去经年……', action: '轻轻握紧玉坠', duration: 4, notes: '表情特写', imagePrompt: '古风女子低头看玉坠，神情忧伤，特写' },
        { id: '3', number: 3, title: '男子登场', scene: '开场', shotType: '中远景', cameraMove: '镜头右移', description: '白衣男子背对站在廊下，听见脚步声后微微侧身回头。', dialogue: '', action: '微微侧身回头', duration: 4, notes: '背影构图', imagePrompt: '古风白衣男子背影，雪夜廊桥，侧身回头' },
        { id: '4', number: 4, title: '双人相望', scene: '高潮', shotType: '双人中景', cameraMove: '镜头轻推', description: '两人隔着几步距离相望，风吹衣袖，雪花飘落。', dialogue: '', action: '相望，几步距离', duration: 6, notes: '眼神交流', imagePrompt: '古风男女雪夜相望，双人中景，雪花飘落' },
        { id: '5', number: 5, title: '递出玉坠', scene: '高潮', shotType: '特写', cameraMove: '镜头推近', description: '女子递出玉坠，男子伸手接过，指尖接近未触碰。', dialogue: '', action: '递出玉坠，指尖接近', duration: 5, notes: '画面重点：玉坠', imagePrompt: '古风女子递玉坠给男子，手部特写' },
        { id: '6', number: 6, title: '女子离去', scene: '结尾', shotType: '中景', cameraMove: '镜头跟随', description: '女子转身离开，向廊桥深处走去；男子原地未追。', dialogue: '', action: '女子远离，镜头跟随', duration: 6, notes: '离别氛围', imagePrompt: '古风女子转身离去背影，雪夜廊桥' },
        { id: '7', number: 7, title: '收束远景', scene: '结尾', shotType: '远景', cameraMove: '镜头缓慢拉远', description: '男子独自立于画面中，手中玉坠微垂，望向女子离去方向。', dialogue: '', action: '雪雾流动', duration: 7, notes: '收尾镜头', imagePrompt: '古风男子独自站立雪夜中，远景，玉坠微光' },
      ]
      setShots(demoShots)
      setPage('storyboard')
    }
  }, [parseScript])

  const handleGenerateImage = useCallback(async (shot: Shot) => {
    setGeneratingMap(prev => ({ ...prev, [shot.id]: true }))
    try {
      const prompt = shot.imagePrompt || `${shot.shotType}，${shot.description}，影视分镜参考图`
      const url = await generateImage(prompt)
      setShots(prev => prev.map(s => s.id === shot.id ? { ...s, imageUrl: url, imagePrompt: prompt } : s))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '生成失败'
      alert(`生成失败：${msg}\n\n请检查生图 API 配置。`)
    } finally {
      setGeneratingMap(prev => ({ ...prev, [shot.id]: false }))
    }
  }, [generateImage])

  const handleUpdate = useCallback((updated: Shot) => {
    setShots(prev => prev.map(s => s.id === updated.id ? updated : s))
  }, [])

  const handleDelete = useCallback((id: string) => {
    setShots(prev => prev.filter(s => s.id !== id))
    setSelectedId(prev => prev === id ? null : prev)
  }, [])

  if (page === 'upload') {
    return (
      <>
        <UploadPage
          onParse={handleParse}
          onOpenConfig={() => setShowConfig(true)}
          apiConfigured={apiConfigured}
          parsing={parsing}
        />
        {showConfig && (
          <ApiConfigPanel
            config={apiConfig}
            onSave={setApiConfig}
            onClose={() => setShowConfig(false)}
          />
        )}
      </>
    )
  }

  return (
    <div className="storyboard-app">
      <header className="app-header">
        <div className="left">
          <button className="back-btn" onClick={() => setPage('upload')}>← 返回</button>
          <h2>《剧本分镜》</h2>
          <span className="scene-info">共 {shots.length} 个镜头</span>
        </div>
        <div className="view-tabs">
          <button className={viewMode === 'modern' ? 'active' : ''} onClick={() => setViewMode('modern')}>
            🎨 现代画板
          </button>
          <button className={viewMode === 'classic' ? 'active' : ''} onClick={() => setViewMode('classic')}>
            📋 分镜表
          </button>
        </div>
        <button className="btn-config-header" onClick={() => setShowConfig(true)}>⚙️ API</button>
      </header>

      <div className="app-body">
        {viewMode === 'modern' ? (
          <div className="modern-layout">
            <ModernView
              shots={shots}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onUpdate={handleUpdate}
              generatingMap={generatingMap}
              onGenerateImage={handleGenerateImage}
            />
            <ShotDetailPanel
              shot={shots.find(s => s.id === selectedId) || null}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              generatingMap={generatingMap}
              onGenerateImage={handleGenerateImage}
            />
          </div>
        ) : (
          <ClassicView shots={shots} />
        )}
      </div>

      {showConfig && (
        <ApiConfigPanel
          config={apiConfig}
          onSave={setApiConfig}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  )
}

export default App
