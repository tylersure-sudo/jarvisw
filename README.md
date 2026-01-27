# 灵感回响 (Cosmic Echo)

一款融合东方智慧与现代科技的宇宙对话应用，帮助你探索内心、解读梦境、感知宇宙能量。

## 功能特色

### 呼叫宇宙
通过精美的视觉界面与宇宙建立连接，开启神秘对话之旅。

- **今日运势** - 感应今日的宇宙能量场，获取每日灵感指引
- **心情回响** - 分享你的感受，让宇宙与你的情绪共鸣
- **梦境解析** - 探索潜意识的奥秘，解读梦境中的象征意义
- **问问宇宙** - 向宇宙提出你的疑问，寻找内心的答案

### 心情感知
五种核心心境，捕捉你此刻的情感状态：

- 喜悦 - 阳光般的温暖能量
- 宁静 - 如水般的平和状态
- 忧郁 - 细雨般的沉思时刻
- 焦虑 - 漩涡般的不安情绪
- 希望 - 星光般的期待之心

### 能量注入
在生成回响的过程中，点击能量块为结果注入不同的灵感元素：

- 光明 - 带来清晰与启示
- 智慧 - 增添深度与洞察
- 宁静 - 注入平和与安宁
- 力量 - 赋予勇气与决心

### 语音交互
- 语音输入 - 用声音与宇宙对话
- 语音播放 - 聆听宇宙的回响

## 东方智慧模块

应用融合了丰富的东方文化元素：

- **易经** - 六十四卦的智慧解读
- **六爻预测** - 古老的占卜艺术
- **黄帝内经** - 养生与健康指导
- **十二时辰** - 传统时间观念
- **二十四节气** - 自然节律感知
- **农历** - 传统历法支持
- **天干地支** - 时空能量计算

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **AI 服务**: Google Gemini API
  - gemini-2.0-flash - 文本生成
  - imagen-3.0-generate-002 - 图片生成
- **语音技术**: Web Speech API
  - SpeechRecognition - 语音识别
  - SpeechSynthesis - 语音合成

## 项目结构

```
src/
├── components/          # UI 组件
│   ├── CallUniverse.tsx       # 呼叫宇宙主界面
│   ├── ConversationScreen.tsx # 对话界面
│   ├── CosmicButton.tsx       # 宇宙风格按钮
│   ├── CosmicIcon.tsx         # 宇宙风格图标
│   ├── MoodBubbles.tsx        # 心情选择气泡
│   ├── StarryBackground.tsx   # 星空背景
│   ├── SpaceTimeDisplay.tsx   # 时空显示
│   ├── VoiceInput.tsx         # 语音输入
│   ├── VoiceOutput.tsx        # 语音输出
│   └── ...
├── utils/               # 工具函数
│   ├── easternTime.ts         # 东方时间计算
│   ├── gemini.ts              # Gemini API 集成
│   ├── imageGenerator.ts      # 图片生成工具
│   ├── moods.ts               # 心情配置
│   └── culturalWisdom.ts      # 文化智慧模块
├── types/               # 类型定义
├── App.tsx              # 应用入口
└── main.tsx             # 主入口
```

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件并添加：

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## PWA 支持

应用支持 PWA (Progressive Web App)，可以安装到手机主屏幕：

- **iOS**: 在 Safari 中打开，点击分享按钮，选择"添加到主屏幕"
- **Android**: 在 Chrome 中打开，点击菜单，选择"添加到主屏幕"

## 设计理念

灵感回响的设计融合了：

- **宇宙美学** - 深邃的星空背景、流动的星光、神秘的光晕效果
- **东方意境** - 含蓄内敛的交互方式、天人合一的哲学思想
- **现代体验** - 流畅的动画、直觉的操作、沉浸式的视觉

## 隐私说明

- 所有对话内容仅存储在本地设备
- 语音数据不会上传到服务器
- API 调用仅用于生成回响内容

## 许可证

MIT License

---

*愿宇宙的智慧照亮你的心灵之路*
