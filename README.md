# 🍽️ 正念饮食日记 · Mindful Eating Diary

> Taro 微信小程序版 · 进食行为研究记录工具

基于原 React Web 项目 [MindfulEatingDiaryApp](https://github.com) 迁移至 Taro 4.x，适配微信小程序运行环境。

---

## 📱 功能概览

| 页面 | 路径 | 功能 |
|------|------|------|
| 🏠 **主页** | `pages/home/index` | 研究进度追踪、今日记录状态、近期记录一览 |
| 📝 **记录** | `pages/entry/index` | 用餐详情记录：食物描述、照片、时间、咀嚼频率、环境、心情等 |
| 💭 **反思** | `pages/reflection/index` | 每日反思提示、研究观察指标、情绪状态记录 |
| 📊 **总结** | `pages/summary/index` | 本周数据汇总、进食趋势图、环境分布、研究发现 |

### 功能亮点

- **14 天研究进度追踪**：圆形进度环 + 天级打卡点
- **11 项用餐记录字段**：食物描述、照片、进食时间、咀嚼频率、地点、陪伴、媒体使用、餐前心情、满足感、饥饿回归、备注
- **5 个反思提示**：正念觉察、进食速度、环境、饥饿感、手机干扰
- **4 组数据图表**：进食时长趋势、咀嚼频率、环境分布、饥饿感规律
- **便利贴风格 UI**：和纸胶带、贴纸卡片、笔记本横线、手写体文字

---

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Taro 4.2 + React 18 |
| 语言 | TypeScript |
| 样式 | Less + CSS 自定义属性（变量） |
| 构建 | Webpack 5 |
| 目标平台 | 微信小程序（WeApp） |

### 核心依赖

```json
{
  "@tarojs/taro": "4.2.0",
  "@tarojs/components": "4.2.0",
  "@tarojs/react": "4.2.0",
  "react": "^18.0.0",
  "typescript": "^5.4.5",
  "less": "^4.2.0"
}
```

---

## 📁 项目结构

```
mindful-eating-miniapp/
├── config/                     # Taro 构建配置
├── src/
│   ├── app.tsx                 # 应用入口
│   ├── app.config.ts           # 全局配置（路由、TabBar、窗口样式）
│   ├── app.less                # 全局样式（CSS 变量定义）
│   ├── components/
│   │   └── SharedElements.tsx  # 共享 UI 组件库
│   └── pages/
│       ├── home/               # 主页
│       │   ├── index.tsx
│       │   └── index.less
│       ├── entry/              # 用餐记录
│       │   ├── index.tsx
│       │   └── index.less
│       ├── reflection/         # 每日反思
│       │   ├── index.tsx
│       │   └── index.less
│       └── summary/            # 本周总结
│           ├── index.tsx
│           └── index.less
├── types/                      # TypeScript 类型声明
├── package.json
├── tsconfig.json
├── babel.config.js
├── project.config.json         # 微信小程序项目配置
└── README.md
```

### 共享组件 (`SharedElements.tsx`)

| 组件 | 说明 |
|------|------|
| `WashiTape` | 和纸胶带装饰（支持圆点/条纹/纯色） |
| `StickyNote` | 便利贴卡片（可旋转、自定义颜色） |
| `PaperRuledLines` | 纸张横线背景 |
| `NotebookMarginLine` | 笔记本红色边距线 |
| `ProgressRing` | 圆形进度环（border 实现，无 SVG 依赖） |
| `SpiralBinding` | 螺旋装订装饰 |
| `ChineseHandwritten` | 中文手写体文字（楷体） |
| `HandwrittenLabel` | 英文手写体文字（Segoe Script） |
| `PencilDivider` | 铅笔虚线分隔线 |
| `EmojiRating` | 5 级表情评分 😞😕😐😊😄 |
| `TagChip` | 可选标签芯片 |
| `PaperTextarea` | 仿纸张横线文本输入框 |

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- 微信开发者工具（[下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)）

### 安装依赖

```bash
cd mindful-eating-miniapp
npm install
```

### 开发运行

```bash
# 微信小程序开发模式（热更新）
npm run dev:weapp

# 其他平台
npm run dev:h5        # H5 网页
npm run dev:alipay    # 支付宝小程序
npm run dev:swan      # 百度小程序
npm run dev:tt        # 字节跳动小程序
```

### 构建发布

```bash
# 生产构建
npm run build:weapp

# 编译产物在 dist/ 目录，用微信开发者工具打开即可预览
```

### 微信开发者工具配置

1. 打开微信开发者工具
2. 导入项目 → 选择 `dist/` 目录
3. 填入 AppID（测试可用「测试号」）
4. 关闭「将 JS 编译成 ES5」
5. 关闭「不校验合法域名」

---

## 🔄 从原 React 项目迁移说明

本项目从 `MindfulEatingDiaryApp`（React Web）迁移而来，主要变更：

| 原项目 | Taro 小程序版 |
|--------|-------------|
| `react` + `react-dom` | `@tarojs/react` + `@tarojs/components` |
| `<div>` / `<span>` | `<View>` / `<Text>` |
| `<input>` / `<textarea>` | `<Input>` / `<Textarea>` |
| `<button>` | `<View onClick>`（自定义按钮） |
| Tailwind CSS `className` | 内联 `style` 对象 |
| `lucide-react` 图标 | Emoji 替代 |
| `recharts` 图表库 | 自建简易图表组件（View 模拟） |
| `navigator.mediaDevices` | `Taro.chooseImage` |
| React Router 导航 | `Taro.switchTab` TabBar 导航 |
| Google Fonts (Ma Shan Zheng / Caveat) | 系统字体回退（楷体 / Segoe Script） |

---

## ⚠️ 注意事项

### 拍照功能

模拟器中暂不可用，已切换为模拟模式。**真机调试**时取消 `src/pages/entry/index.tsx` 第 195-204 行的注释即可恢复真实拍照：

```tsx
// 真机调试时取消此注释块
Taro.chooseImage({
  count: 1,
  sizeType: ['compressed'],
  sourceType: ['camera', 'album'],
  // ...
})
```

### 图表组件

原项目使用 `recharts`，小程序环境暂不支持 Canvas/SVG 图表。当前使用 View 模拟的简易图表：
- `SimpleBarChart` — 高度模拟柱状图
- `SimpleLineChart` — 圆点标记折线图
- `SimplePieChart` — 图例列表

后续可替换为 Taro 生态图表方案（如 `echarts-for-weixin`）。

### 字体

原项目使用 Google Fonts（Ma Shan Zheng 中文手写 + Caveat 英文手写），小程序可通过 `Taro.loadFontFace()` 加载。当前回退方案：

| 用途 | 回退字体 |
|------|---------|
| 中文手写 | `STKaiti`（华文楷体）→ `KaiTi`（楷体）→ `serif` |
| 英文手写 | `Segoe Script` → `Comic Sans MS` → `cursive` |

### 尺寸单位

- Less 样式文件使用 **rpx**（小程序响应式单位，1rpx = 屏幕宽度/750）
- TSX 内联 style 使用 **px**（React CSSProperties 标准单位，编译时自动适配）

---

## 🎨 设计风格

采用**日系手帐 / 文具风**设计语言：

- 🎨 暖色调纸张底色（米白/牛皮纸色系）
- 📝 手写字体排版（中文楷体 + 英文手写体）
- ✂️ 和纸胶带（washi tape）装饰元素
- 📌 便利贴（sticky note）卡片风格
- 📒 笔记本横线 + 红色边距线纹理
- 🔗 螺旋装订（spiral binding）侧边装饰
- ✏️ 铅笔虚线分隔线

### CSS 变量色板

```css
--background: #f5efe0;        /* 纸张底色 */
--foreground: #3d2b1f;        /* 文字色 */
--primary: #8b5e3c;           /* 主色（棕色） */
--secondary: #8fa98a;         /* 辅助色（鼠尾草绿） */
--accent: #d4856a;            /* 强调色（陶土橙） */
--muted: #e8dfd0;             /* 弱化背景 */
--muted-foreground: #7a6555;  /* 弱化文字 */
--border: rgba(139,94,60,0.18); /* 边框 */
```

---

## 📄 页面截图说明

| 页面 | 内容模块 |
|------|---------|
| 主页 | 和纸胶带装饰 → 标题（正念饮食日记） → 研究进度卡片（天/进度环/打卡点） → 今日记录状态 → 开始记录按钮 → 近期记录便利贴 → 研究员备注 |
| 记录 | 顶部导航栏（返回/保存） → 餐次标签 → 食物描述 → 拍照 → 进食时间 → 咀嚼频率 → 地点 → 陪伴 → 媒体使用 → 餐前心情 → 满足感 → 饥饿回归 → 备注 → 保存按钮 |
| 反思 | 和纸胶带 → 标题（每日反思） → 进度条 → 5 个反思提示（可展开） → 研究观察指标 → 研究者备忘 → 今日状态心情 → 保存按钮 |
| 总结 | 和纸胶带 → 标题（本周总结） → 统计卡片（4个） → 进食时长趋势图 → 咀嚼频率图 → 环境分布饼图 → 饥饿感规律图 → 研究发现 → 数据导出提示 |

---

## 📋 待办事项

- [ ] 真机测试拍照功能（取消 `Taro.chooseImage` 注释）
- [ ] 接入字体文件（`Taro.loadFontFace` 加载 Ma Shan Zheng + Caveat）
- [ ] 图表替换为 `echarts-for-weixin` 或 Taro Canvas
- [ ] 数据持久化（接入 `Taro.setStorage` / 云开发数据库）
- [ ] 替换 px inline style 为 rpx（使用 postcss-pxtransform）
- [ ] 暗色模式支持
- [ ] 数据导出功能（CSV/JSON）

---

## 📝 License

Private — 正念饮食研究项目 · Mindful Eating Study · IRB #2026-MEL-042
