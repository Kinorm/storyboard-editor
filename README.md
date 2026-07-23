# 分镜画板工具 (Storyboard Editor)

一个基于 Web 的分镜画板工具，支持拖拽、缩放、排列分镜，适用于动画、影视、广告等创意工作的分镜设计与预览。

## 功能特性

- 🎨 **可视化画布** — 支持拖拽分镜卡片，自由排列布局
- 🖱️ **交互操作** — 拖拽移动、选中、删除分镜
- 📐 **比例适配** — 支持 16:9、4:3、1:1 等常见画面比例
- 💾 **导出功能** — 支持导出为图片或 PDF
- 🖼️ **素材支持** — 支持上传参考图到分镜中

## 技术栈

- React 18 + TypeScript
- Vite
- HTML5 Canvas（画布渲染）

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/Kinorm/storyboard-editor.git
cd storyboard-editor

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 使用说明

1. 打开应用后，在画布区域右键点击可新建分镜
2. 拖拽分镜卡片可调整位置
3. 选中分镜后可在右侧属性面板编辑信息
4. 支持添加描述、备注、参考图等

## 项目结构

```
storyboard-editor/
├── src/
│   ├── components/      # 组件
│   │   ├── StoryboardCanvas.tsx   # 画布主组件
│   │   └── Panel.tsx              # 侧边属性面板
│   ├── types/           # 类型定义
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## License

MIT
