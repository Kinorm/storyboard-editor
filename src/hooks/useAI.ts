import { useCallback, useState } from 'react'
import type { ApiConfig, Shot } from '../types'

export function useAI(config: ApiConfig) {
  const [parsing, setParsing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 调用文本大模型解析剧本
  const parseScript = useCallback(async (scriptContent: string): Promise<Shot[]> => {
    if (!config.textApiKey) {
      throw new Error('请先配置文本大模型 API Key')
    }
    setParsing(true)
    setError(null)
    try {
      const response = await fetch(`${config.textBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.textApiKey}`,
        },
        body: JSON.stringify({
          model: config.textModel,
          messages: [
            { role: 'system', content: config.textSystemPrompt },
            { role: 'user', content: `请将以下剧本内容拆解为分镜列表：\n\n${scriptContent}` },
          ],
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error?.message || `请求失败: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || ''

      // 尝试从回复中提取 JSON
      let shots: Shot[] = []
      try {
        // 先尝试直接解析整个内容
        shots = JSON.parse(content)
      } catch {
        // 尝试提取 ```json 代码块
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (jsonMatch) {
          shots = JSON.parse(jsonMatch[1])
        } else {
          // 尝试提取方括号包裹的内容
          const bracketMatch = content.match(/\[[\s\S]*\]/)
          if (bracketMatch) {
            shots = JSON.parse(bracketMatch[0])
          }
        }
      }

      // 为每个 shot 添加 id
      return shots.map((s, i) => ({
        ...s,
        id: `shot_${Date.now()}_${i}`,
        scene: s.scene || '',
        imageUrl: '',
        imagePrompt: '',
        notes: s.notes || '',
      }))
    } finally {
      setParsing(false)
    }
  }, [config])

  // 调用生图大模型生成参考图
  const generateImage = useCallback(async (prompt: string): Promise<string> => {
    if (!config.imageApiKey) {
      throw new Error('请先配置生图大模型 API Key')
    }
    setGenerating(true)
    setError(null)
    try {
      const response = await fetch(`${config.imageBaseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.imageApiKey}`,
        },
        body: JSON.stringify({
          model: config.imageModel,
          prompt: `分镜参考图，影视画面构图，${prompt}`,
          size: config.imageSize,
          n: 1,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error?.message || `请求失败: ${response.status}`)
      }

      const data = await response.json()
      return data.data?.[0]?.url || ''
    } finally {
      setGenerating(false)
    }
  }, [config])

  return { parseScript, generateImage, parsing, generating, error, setError }
}
