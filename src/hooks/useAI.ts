import { useCallback, useState } from 'react'
import type { ApiConfigItem, Shot } from '../types'

export function useAI(textConfig: ApiConfigItem | undefined, imageConfig: ApiConfigItem | undefined) {
  const [parsing, setParsing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 调用文本大模型解析剧本
  const parseScript = useCallback(async (scriptContent: string): Promise<Shot[]> => {
    if (!textConfig || !textConfig.textApiKey) {
      throw new Error('请先配置并选择文本大模型 API')
    }
    setParsing(true)
    setError(null)
    try {
      const response = await fetch(`${textConfig.textBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${textConfig.textApiKey}`,
        },
        body: JSON.stringify({
          model: textConfig.textModel,
          messages: [
            { role: 'system', content: textConfig.textSystemPrompt },
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

      let shots: Shot[] = []
      try {
        shots = JSON.parse(content)
      } catch {
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (jsonMatch) {
          shots = JSON.parse(jsonMatch[1])
        } else {
          const bracketMatch = content.match(/\[[\s\S]*\]/)
          if (bracketMatch) {
            shots = JSON.parse(bracketMatch[0])
          }
        }
      }

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
  }, [textConfig])

  // 调用生图大模型生成参考图
  const generateImage = useCallback(async (prompt: string): Promise<string> => {
    if (!imageConfig || !imageConfig.imageApiKey) {
      throw new Error('请先配置并选择生图大模型 API')
    }
    setGenerating(true)
    setError(null)
    try {
      const response = await fetch(`${imageConfig.imageBaseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${imageConfig.imageApiKey}`,
        },
        body: JSON.stringify({
          model: imageConfig.imageModel,
          prompt: `分镜参考图，影视画面构图，${prompt}`,
          size: imageConfig.imageSize,
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
  }, [imageConfig])

  return { parseScript, generateImage, parsing, generating, error, setError }
}
