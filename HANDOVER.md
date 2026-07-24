# 分镜画板工具 — 项目交接文档

> 仓库：https://github.com/Kinorm/storyboard-editor  
> 创建时间：2026-07-23  
> 最后更新：2026-07-24

---

## 一、项目概述

本项目是一个**剧本自动拆解为分镜画板**的 Web 工具。用户上传剧本文件（txt/docx/md），AI 自动解析为分镜头列表，支持两种视图展示，并可为每个镜头生成 AI 参考图。

### 核心功能
- 📄 **剧本上传**：支持 `.txt`、`.docx`、`.md` 格式（pdf 暂未支持）
- 🤖 **AI 解析**：调用文本大模型将剧本拆解为分镜列表
- 🎨 **两种视图**：现代画板视图 + 传统分镜表视图
- 🖼️ **AI 生图**：为每个镜头生成参考图
- ⚙️ **多 API 配置**：支持保存多套 API 配置，文本/生图可分别选择
- 📋 **日志系统**：记录操作和错误，支持导出排查

---

## 二、文件结构

```
storyboard-editor/
├── preview.html              ← 核心文件：单文件可运行版本（用户直接使用）
├── start-server.bat          ← Windows 一键启动本地服务器
├── index.html                ← React 应用入口
├── src/
│   ├── App.tsx               ← React 主组件
│   ├── App.css               ← 样式
│   ├── types/index.ts        ← TypeScript 类型定义
│   ├── hooks/
│   │   ├── useAI.ts          ← AI 调用封装（文本解析 + 生图）
│   │   └── useLocalStorage.ts ← localStorage 封装
│   └── components/
│       ├── UploadPage.tsx    ← 上传页面
│       ├── ApiConfigPanel.tsx ← API 配置弹窗
│       ├── ModernView.tsx    ← 现代画板视图
│       ├── ClassicView.tsx   ← 传统分镜表视图
│       └── ShotDetailPanel.tsx ← 镜头详情编辑面板
├── package.json
├── vite.config.ts
└── .github/workflows/
    └── deploy.yml            ← GitHub Pages 自动部署
```

---

## 三、运行方式

### 方式 1：preview.html（推荐，最简单）

```bash
# 进入项目目录
cd storyboard-editor

# 方式 A：一键启动（Windows）
双击 start-server.bat

# 方式 B：手动启动
python -m http.server 8080
# 然后浏览器打开 http://localhost:8080/preview.html
```

> ⚠️ **不要直接双击打开 preview.html**（`file://` 协议会阻止 API 请求，触发 CORS 错误）

### 方式 2：React 开发模式

```bash
cd storyboard-editor
npm install
npm run dev
```

### 方式 3：GitHub Pages（部署后）

访问 `https://kinorm.github.io/storyboard-editor/preview.html`

---

## 四、技术栈

| 层面 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript + Vite |
| 单文件版 | 纯 HTML + CSS + JS（无框架依赖）|
| docx 解析 | mammoth.js（CDN）|
| UI 样式 | 自定义 CSS（暗色主题 + 传统分镜表亮色主题）|
| 数据存储 | localStorage |
| 部署 | GitHub Actions → GitHub Pages |

---

## 五、数据存储

所有数据保存在浏览器 `localStorage` 中：

| Key | 内容 |
|-----|------|
| `sb-api-config` | API 配置列表（多套配置 + 当前选中的文本/生图配置 ID）|
| `sb-logs` | 运行日志（最多保留 500 条）|

> 清空浏览器数据会丢失所有配置和日志。

---

## 六、日志系统

### 如何查看日志

点击页面上的 **📋 日志** 按钮（上传页、分镜页 header 都有）。

### 日志级别

- `INFO`（绿色）：正常操作记录
- `WARN`（橙色）：警告
- `ERROR`（红色）：错误

### 如何导出日志

在日志弹窗中点击 **📥 导出** 按钮，会下载一个 JSON 文件，可以发给开发者排查。

### 日志内容示例

```json
[
  {
    "t": 1721823600000,
    "time": "2026/7/24 21:00:00",
    "level": "info",
    "module": "file",
    "msg": "docx 解析成功",
    "detail": { "name": "剧本.docx", "length": 3200 }
  },
  {
    "t": 1721823700000,
    "time": "2026/7/24 21:01:40",
    "level": "error",
    "module": "parse",
    "msg": "剧本解析失败",
    "detail": { "error": "Connection timeout" }
  }
]
```

---

## 七、已知问题

| 问题 | 原因 | 解决方式 |
|------|------|----------|
| 双击 preview.html 无法调用 AI | 浏览器禁止 `file://` 发跨域请求 | 必须通过 HTTP 服务器打开 |
| 中国大陆访问 GitHub 不稳定 | 网络问题 | 使用本地文件 + 本地服务器 |
| React 版未完整测试 | 精力集中在 preview.html | 如需 React 版需补充测试 |
| pdf 文件不支持 | 未接入 pdf 解析库 | 建议用户复制粘贴文本 |
| .docx 表格/图片内容丢失 | mammoth.js 只提取纯文本 | 建议复杂格式先转为 txt |

---

## 八、后续可优化项

1. **pdf 支持**：接入 pdf.js 解析 pdf 剧本
2. **后端服务**：增加后端存储项目数据（目前全在 localStorage）
3. **用户系统**：登录后可云端保存项目
4. **批量生图**：一键为所有镜头生成参考图
5. **导出功能**：导出为 PDF 分镜表 / 图片序列
6. **剧本格式识别**：增强对特定剧本格式（如 Final Draft、 fountain）的支持
7. **撤销/重做**：支持操作历史回退
8. **React 版完善**：目前 React 源码以原型验证为主，可继续完善

---

## 九、API 配置说明

### 支持的模型提供商

| 提供商 | 文本模型 | 生图模型 |
|--------|---------|---------|
| OpenAI | ✅ | ✅ |
| Moonshot | ✅ | ❌ |
| DeepSeek | ✅ | ❌ |
| SiliconFlow | ✅ | ✅ |
| 自定义 | ✅ | ✅ |

### 配置格式

每套配置包含以下字段：
- `name`：配置名称（如"OpenAI 全栈"）
- `textBaseUrl`、`textApiKey`、`textModel`、`textSystemPrompt`
- `imageBaseUrl`、`imageApiKey`、`imageModel`、`imageSize`

### 配置存储结构

```js
{
  configs: [
    { id: 'cfg_xxx', name: '...', textBaseUrl: '...', ... },
    { id: 'cfg_yyy', name: '...', ... }
  ],
  activeTextConfigId: 'cfg_xxx',
  activeImageConfigId: 'cfg_yyy'
}
```

---

## 十、联系方式

如遇到使用问题，请：
1. 点击 **📋 日志** 按钮
2. 点击 **📥 导出** 保存日志 JSON
3. 将日志文件发送给开发者排查

---

*本文档由 Kimi 生成，最后更新于 2026-07-24*
