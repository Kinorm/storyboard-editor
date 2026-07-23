import { useState, useCallback } from 'react'
import StoryboardCanvas from './components/StoryboardCanvas.tsx'
import Panel from './components/Panel.tsx'
import type { StoryboardPanel } from './types'
import './App.css'

function App() {
  const [panels, setPanels] = useState<StoryboardPanel[]>([
    {
      id: '1',
      title: '开场镜头',
      description: '远景，城市全景，日出',
      x: 100,
      y: 100,
      width: 240,
      height: 135,
      selected: false,
    },
    {
      id: '2',
      title: '角色登场',
      description: '中景，主角从画面左侧走入',
      x: 400,
      y: 100,
      width: 240,
      height: 135,
      selected: false,
    },
    {
      id: '3',
      title: '对话场景',
      description: '近景，双人对话，表情特写',
      x: 700,
      y: 100,
      width: 240,
      height: 135,
      selected: false,
    },
  ])

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handlePanelSelect = useCallback((id: string | null) => {
    setSelectedId(id)
    setPanels((prev) =>
      prev.map((p) => ({ ...p, selected: p.id === id }))
    )
  }, [])

  const handlePanelMove = useCallback((id: string, x: number, y: number) => {
    setPanels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, x, y } : p))
    )
  }, [])

  const handlePanelUpdate = useCallback((updated: StoryboardPanel) => {
    setPanels((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
  }, [])

  const handleAddPanel = useCallback(() => {
    const newPanel: StoryboardPanel = {
      id: Date.now().toString(),
      title: `分镜 ${panels.length + 1}`,
      description: '',
      x: 100 + panels.length * 50,
      y: 100 + panels.length * 50,
      width: 240,
      height: 135,
      selected: false,
    }
    setPanels((prev) => [...prev, newPanel])
    handlePanelSelect(newPanel.id)
  }, [panels.length, handlePanelSelect])

  const handleDeletePanel = useCallback((id: string) => {
    setPanels((prev) => prev.filter((p) => p.id !== id))
    setSelectedId((prev) => (prev === id ? null : prev))
  }, [])

  const selectedPanel = panels.find((p) => p.id === selectedId) || null

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 分镜画板工具</h1>
        <button className="btn-add" onClick={handleAddPanel}>
          + 新建分镜
        </button>
      </header>
      <div className="app-body">
        <div className="canvas-area">
          <StoryboardCanvas
            panels={panels}
            onSelect={handlePanelSelect}
            onMove={handlePanelMove}
          />
        </div>
        <Panel
          panel={selectedPanel}
          onUpdate={handlePanelUpdate}
          onDelete={handleDeletePanel}
        />
      </div>
    </div>
  )
}

export default App
