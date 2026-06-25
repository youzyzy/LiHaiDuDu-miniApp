# 🍽️ 正念饮食日记 · Mindful Eating Diary

> Taro 4.x 微信小程序 · 进食行为研究记录工具  
> 基于手帐/文具风设计 · 数据接入微信云开发

---

## 📱 功能总览

| Tab | 页面 | 数据来源 | 核心功能 |
|-----|------|---------|---------|
| 🏠 **主页** | `pages/home/` | ☁️ 云数据库 | 5天研究进度（环形图+打卡点）· 今日餐次统计 · 近期记录卡片（可展开详情+餐次左右切换） |
| 📖 **记录** | `pages/entry/` | ☁️ 云数据库+云存储 | 食物描述 · 拍照上传 · 进食起止时间 · 咀嚼频率 · 地点/陪伴/场景/媒体选择 · 心情评分 · 保存到云数据库 |
| 🪶 **反思** | `pages/reflection/` | 💬 本地状态 | 4组反思提示 · 可展开文本框 · 情绪标签选择 · 完成进度条 |
| 📊 **总结** | `pages/summary/` | ☁️ 云数据库 | 4项统计卡片（最长/最短用餐可展开查看记录详情）· 进食时长柱状图 · 咀嚼频率趋势 · 环形饼图（环境分布）· 餐前vs餐后心情对比 · 照片墙 |

---

## ☁️ 微信云开发架构

### 云环境

```
环境 ID: cloud1-d8gvp57swad6f10f4
```

### 云函数

| 函数 | 文件 | 超时 | 功能 |
|------|------|------|------|
| `saveRecord` | `cloudfunctions/saveRecord/index.js` | 3s（默认） | 保存用餐记录到 `meal_records` 集合 |
| `getRecords` | `cloudfunctions/getRecords/index.js` | 10s | 按 openid 查询当前用户所有记录（按 createdAt 降序，限制200条） |

### 数据库集合：`meal_records`

| 字段 | 类型 | 说明 |
|------|------|------|
| `_id` | string | 自动生成 |
| `openid` | string | 用户标识（由 `wxContext.OPENID` 自动填充） |
| `date` | string | 日期，格式 `"2026年6月25日"` |
| `mealNumber` | number | 当天第几餐（1-3） |
| `mealType` | `"breakfast"` \| `"lunch"` \| `"dinner"` | 餐次类型 |
| `foodDesc` | string | 食物描述 |
| `photoTaken` | boolean | 是否拍照 |
| `photoFileID` | string | 云存储文件 ID（`cloud://...`） |
| `startTime` | string | 开始时间 `"12:00"` |
| `endTime` | string | 结束时间 `"12:28"` |
| `duration` | number \| `"--"` | 进食时长（分钟） |
| `chewFreq` | number | 咀嚼频率（次/口） |
| `location` | string | 进食地点（家里/宿舍/餐厅/食堂/办公室/路上/咖啡厅/其他） |
| `companions` | string[] | 陪伴（独自/家人/朋友/同事/伴侣） |
| `mealScenes` | string[] | 用餐场景（工作间隙/聚餐/家庭用餐/吃漂亮饭/其他） |
| `media` | string[] | 媒体使用（手机/电视/电脑/音乐/播客/无） |
| `satisfaction` | number | 餐后满足感（1-5） |
| `moodBefore` | number | 餐前心情（1-5） |
| `notes` | string | 备注 |
| `createdAt` | Date | 服务端时间戳 |
| `updatedAt` | Date | 更新时间戳 |

### 云存储

照片上传路径：`food-photos/{timestamp}-{random}.jpg`

---

## 🗺️ 数据流

```
┌─────────────────────────────────────────────────────┐
│  Entry 页                                            │
│  ├── Taro.chooseImage() → 选择/拍摄照片              │
│  ├── Taro.cloud.uploadFile() → 上传到云存储          │
│  └── Taro.cloud.callFunction('saveRecord') → 保存记录│
│       └── 写入 meal_records 集合                      │
├─────────────────────────────────────────────────────┤
│  Home 页 · Summary 页                                │
│  └── Taro.cloud.callFunction('getRecords')           │
│       ├── 按 openid 查询全部记录                      │
│       ├── Home: 分组 → 研究进度 + 今日统计 + 近期卡片 │
│       └── Summary: 聚合 → 统计 + 图表 + 照片墙       │
├─────────────────────────────────────────────────────┤
│  Summary 页 · 照片墙                                 │
│  └── Taro.cloud.getTempFileURL() → cloud:// → https:// │
└─────────────────────────────────────────────────────┘
```

---

## 🛠 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 跨端框架 | Taro | 4.2.0 |
| UI 框架 | React | 18 |
| 类型系统 | TypeScript | 5.4 |
| 样式方案 | Less + CSS Variables | 4.2 |
| 构建工具 | Webpack | 5 |
| 后端 | 微信云开发（云函数+云数据库+云存储） | wx-server-sdk 2.6 |
| 目标平台 | 微信小程序 | lib 3.16.1 |

---

## 📁 项目结构

```
mindful-eating-miniapp/
├── cloudfunctions/              # 微信云函数
│   ├── saveRecord/              # 保存用餐记录
│   │   ├── index.js
│   │   └── package.json
│   └── getRecords/              # 查询用餐记录
│       ├── index.js
│       ├── package.json
│       └── config.json          # timeout: 10s
├── config/                      # Taro 构建配置
│   ├── index.ts
│   ├── dev.ts
│   └── prod.ts
├── src/
│   ├── app.tsx                  # 应用入口（云开发初始化）
│   ├── app.config.ts            # 路由·TabBar·窗口
│   ├── app.less                 # CSS 变量 · 全局样式
│   ├── components/
│   │   └── SharedElements.tsx   # 12个共享 UI 组件（508行）
│   └── pages/
│       ├── home/index.tsx       # 主页（1016行）☁️
│       ├── entry/index.tsx      # 用餐记录（852行）☁️
│       ├── reflection/index.tsx # 每日反思（352行）💬
│       └── summary/index.tsx    # 数据总结（784行）☁️
├── types/global.d.ts
├── project.config.json          # 微信小程序项目配置
├── package.json
└── tsconfig.json
```

☁️ = 接入云开发数据库 &emsp; 💬 = 本地状态

---

## 🧩 共享组件库 (`SharedElements.tsx`)

| 组件 | 用途 |
|------|------|
| `WashiTape` | 和纸胶带装饰（dots / stripes / solid 三种图案，可调颜色、宽度、旋转角） |
| `StickyNote` | 便利贴卡片（可旋转、自定义颜色、顶部折叠阴影） |
| `PaperRuledLines` | 纸张横线底纹（可调行高） |
| `NotebookMarginLine` | 笔记本红色边距线（可调左边距） |
| `ProgressRing` | 圆形进度环（纯 border 实现，无 SVG 依赖） |
| `SpiralBinding` | 螺旋装订装饰（18 个圆环） |
| `ChineseHandwritten` | 中文手写体（STKaiti → KaiTi → serif，5 级字号） |
| `HandwrittenLabel` | 英文手写体（Segoe Script → Comic Sans MS → cursive，5 级字号） |
| `PencilDivider` | 铅笔虚线分隔线（可带标签文字） |
| `EmojiRating` | 5 级表情评分 😞😕😐😊😄（选中放大+上移动画） |
| `TagChip` | 多选/单选标签芯片（选中缩放动画+投影） |
| `PaperTextarea` | 仿纸张横线 Textarea（行高52px 对齐横线） |

---

## 📊 总结页专属图表组件

| 组件 | 说明 |
|------|------|
| `SimpleBarChart` | 柱状图（View 高度模拟，支持自定义颜色和最大值） |
| `DonutChart` | 环形饼图（半圆裁剪 + border 旋转模拟扇区，中心显示总数，底部图例） |
| `StatCard` | 统计卡片（图标 + 数值 + 单位 + 标签） |

---

## 🎨 设计系统

日系手帐/文具风：

```
纸张底色    #f5efe0  ████████
主色（棕）  #8b5e3c  ████████
辅助（绿）  #8fa98a  ████████
强调（橙）  #d4856a  ████████
便利贴黄    #fff3a3  ████████
便利贴粉    #ffd6d6  ████████
便利贴绿    #d6f0d6  ████████
便利贴蓝    #d6e8ff  ████████
胶带玫瑰    #f2c4c4  ████████
胶带鼠尾    #c4d9c4  ████████
胶带琥珀    #f2dba4  ████████
胶带薰衣    #d4c4e8  ████████
```

---

## 🚀 快速开始

### 前置条件

- Node.js ≥ 18
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 微信小程序 AppID（`wxf89977fbb49b1399`，可在 `project.config.json` 中修改）

### 安装

```bash
git clone <repo-url>
cd mindful-eating-miniapp
npm install
```

### 开发

```bash
npm run dev:weapp     # 微信小程序（热更新）
npm run dev:h5        # H5 网页预览
```

### 构建

```bash
npm run build:weapp   # 输出到 dist/
```

### 微信开发者工具操作

1. 打开工具 → 导入项目 → 选择 `dist/` 目录
2. 填入 AppID（或选"测试号"）
3. 关闭「将 JS 编译成 ES5」
4. 关闭「不校验合法域名」

### 部署云函数

在微信开发者工具中：

1. 右键 `cloudfunctions/saveRecord` → **上传并部署：云端安装依赖**
2. 右键 `cloudfunctions/getRecords` → **上传并部署：云端安装依赖**

> 注意：`getRecords` 需先在云开发控制台创建 `meal_records` 集合（或首次 `saveRecord` 调用时自动创建），并为 `openid` 字段建立索引。

---

## 🔄 从原 React 项目迁移对照

| 原项目 | Taro 小程序版 |
|--------|-------------|
| `react-dom` | `@tarojs/components`（`<View>` `<Text>` `<Image>` `<Input>` `<Textarea>`） |
| Tailwind CSS | 内联 `style` 对象 |
| `lucide-react` 图标 | Emoji |
| `recharts` 图表 | 自建 `SimpleBarChart` + `DonutChart` |
| `navigator.mediaDevices` | `Taro.chooseImage` |
| React Router | `Taro.switchTab`（底部 TabBar，4 个 tab） |
| Google Fonts | 系统字体回退（楷体 / Segoe Script） |
| LocalStorage | 微信云开发数据库 `meal_records` |

---

## 📋 待办

- [ ] 真机测试拍照上传完整流程
- [ ] `Taro.loadFontFace()` 加载手写字体（Ma Shan Zheng + Caveat）
- [ ] 图表升级为 `echarts-for-weixin`
- [ ] 反思页接入云数据库持久化
- [ ] 照片墙点击放大预览
- [ ] 数据导出（CSV/JSON）
- [ ] 暗色模式

---

## 📄 页面详情

### 🏠 主页 (`home`)

| 区域 | 数据流 |
|------|--------|
| 研究进度卡片 | `getRecords` → 去重日期数 / 5 → 环形进度 + 5 个打卡点 |
| 今日记录 | 当天记录 → 餐次数 / 平均时长 / 平均满足感 |
| 近期记录卡片（含今天，最多 5 天） | 按日期降序 → 便利贴摘要 + 点击展开详情 |
| 展开详情 · 餐次左右切换 | 按 `mealNumber` 排序 → ← 第X餐/共N餐 → 导航 |

### 📖 记录 (`entry`)

17 个表单字段 → `saveRecord` 云函数 → 云数据库 `meal_records`

拍照流程：`chooseImage` → `cloud.uploadFile` → 保存 `photoFileID`

### 🪶 反思 (`reflection`)

4 组反思提示（正念觉察 / 进食速度 / 环境 / 饥饿信号），可展开文本框输入，6 个情绪标签，完成进度条。当前数据不持久化。

### 📊 总结 (`summary`)

| 模块 | 计算方式 |
|------|---------|
| 平均时长 / 平均咀嚼 | `avg(allRecords.duration)` / `avg(allRecords.chewFreq)` |
| 最长/最短用餐 | 排序 `_dur` → 点击卡片展开详情（起止时间/食物/地点/陪伴/评分） |
| 进食时长趋势 | 按日期分组 → 每日平均时长 → 柱状图 |
| 咀嚼频率趋势 | 按日期分组 → 每日平均咀嚼 → 柱状图 |
| 环境分布 | 按 `location` 计数 → DonutChart 环形饼图 |
| 心情对比 | 按 4 个时段分组 → 餐前🌱 vs 餐后✨ 双进度条对比 |
| 照片墙 | 筛选 `photoTaken=true` → `getTempFileURL` → 3 列网格（日期+食物描述） |

---

## 📝 License

Private — 正念饮食研究项目 · Mindful Eating Study
