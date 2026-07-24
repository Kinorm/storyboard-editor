// ===================== API 配置 =====================
export interface ApiConfigItem {
  id: string
  name: string
  // 文本大模型
  textBaseUrl: string
  textApiKey: string
  textModel: string
  textSystemPrompt: string
  // 生图大模型
  imageBaseUrl: string
  imageApiKey: string
  imageModel: string
  imageSize: string
}

export interface ApiConfigs {
  configs: ApiConfigItem[]
  activeTextConfigId: string | null
  activeImageConfigId: string | null
}

export const DEFAULT_SINGLE_CONFIG = {
  textBaseUrl: 'https://api.openai.com/v1',
  textApiKey: '',
  textModel: 'gpt-4o',
  textSystemPrompt: `你是一位资深影视分镜师。请根据用户提供的剧本内容，将其拆解为详细的分镜列表。

输出格式必须为 JSON 数组，每个元素包含以下字段：
- number: 镜号（数字）
- title: 镜头标题
- shotType: 景别（全景/远景/中景/近景/特写/双人中景等）
- cameraMove: 镜头运动（推/拉/摇/移/跟/升降/固定等）
- description: 画面描述（详细的视觉内容）
- dialogue: 对白/旁白（如有）
- action: 动作说明
- duration: 预估时长（秒）
- notes: 备注

要求：
1. 按时间顺序排列镜头
2. 每个镜头要足够详细，便于导演和摄影师理解
3. 景别和镜头运动要准确
4. 对白的镜头要标注说话人`,
  imageBaseUrl: 'https://api.openai.com/v1',
  imageApiKey: '',
  imageModel: 'dall-e-3',
  imageSize: '1024x1024',
}

export const DEFAULT_API_CONFIGS: ApiConfigs = {
  configs: [{ id: 'cfg_default', name: '默认配置', ...DEFAULT_SINGLE_CONFIG }],
  activeTextConfigId: 'cfg_default',
  activeImageConfigId: 'cfg_default',
}

// 兼容旧版单配置
export interface ApiConfig {
  textBaseUrl: string
  textApiKey: string
  textModel: string
  textSystemPrompt: string
  imageBaseUrl: string
  imageApiKey: string
  imageModel: string
  imageSize: string
}

// ===================== 分镜数据 =====================
export interface Shot {
  id: string
  number: number
  title: string
  scene: string
  shotType: string
  cameraMove: string
  description: string
  dialogue: string
  action: string
  duration: number
  imageUrl?: string
  imagePrompt?: string
  notes: string
  x?: number
  y?: number
}

// ===================== 项目数据 =====================
export interface Project {
  id: string
  name: string
  scriptContent: string
  shots: Shot[]
  createdAt: number
  updatedAt: number
}

// ===================== 旧类型兼容 =====================
export interface StoryboardPanel {
  id: string
  title: string
  description: string
  x: number
  y: number
  width: number
  height: number
  selected: boolean
  imageUrl?: string
}
