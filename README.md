## Smart Excalidraw

**用自然语言生成 Excalidraw 图表的 Next.js 应用。**

> 这是一个本地可部署的 Smart Excalidraw 实现，集成 Excalidraw 画布、代码编辑器和 LLM 配置管理，适合自用或二次开发。

## 功能特性

- **自然语言生成图表**：在聊天区输入需求（流程、架构、思维导图等），后端调用大模型生成 Excalidraw 元素。
- **原生 Excalidraw 画布**：支持拖拽、编辑、样式调整、导出等原生能力。
- **代码编辑器联动**：右侧 Monaco Editor 中可直接查看 / 修改生成的元素 JSON，点击“应用”同步到画布。
- **图表自动优化**：支持一键“优化”按钮，对布局和箭头连接做自动整理。
- **多种模型配置方式**：
  - 本地浏览器保存的 LLM 配置（OpenAI / Anthropic 风格接口）；
  - 可选的“访问密码 + 服务器端 LLM 配置”（需要自行扩展后端）。
- **自定义设计与字体**：项目内置橙色主题按钮，以及 Tiempos + 苹方的中英文字体方案。

## 目录结构（核心部分）

- `app/`：Next.js App Router 页面入口
  - `page.js`：主界面（聊天 + 编辑器 + 画布布局）
  - `layout.js`：全局布局、字体与 Analytics 配置
- `components/`：UI 组件
  - `Chat.jsx`：聊天与输入区域
  - `CodeEditor.jsx`：代码编辑器与“优化 / 应用”按钮
  - `ExcalidrawCanvas.jsx`：Excalidraw 画布封装
  - `ConfigModal.jsx` / `ConfigManager.jsx`：LLM 配置弹窗与管理器
  - `ui/`：基础 UI（`Button` / `Input` / `Modal` 等）
- `lib/`：业务逻辑与工具
  - `llm-client.js`：与后端 LLM 交互
  - `prompts.js`：提示词模板
  - `optimizeArrows.js`：箭头优化算法
  - `config-manager.js`：浏览器本地配置管理
  - `design-system.js`：颜色、圆角、间距等设计系统
  - `history-manager.js`：图表生成历史
- `docs/`：开发相关说明（Excalidraw API、箭头规则、需求文档等）

## 本地开发

### 环境要求

- Node.js 18+
- pnpm（推荐）或 npm / yarn

### 安装与启动

```bash
git clone <your-repo-url>
cd ExcaliDraw

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 `http://localhost:3000` 即可使用。

## LLM 配置说明（前端部分）

前端已经实现了 LLM 配置和管理能力：

- 点击右上角 **“配置 LLM”** 打开配置弹窗：
  - 提供商类型：`openai` / `anthropic` 风格接口
  - Base URL：如 `https://api.openai.com/v1`
  - API Key：模型访问密钥
  - 模型：可手动填写或通过“加载可用模型”接口拉取
- `ConfigManager` 支持：新建、编辑、克隆、删除、多配置切换。

> 注意：当前仓库默认没有强绑定任何线上 key 或访问密码，请根据你自己的后端部署情况，补充 `.env` 和 `/app/api` 下的路由实现。

## 技术栈

- **框架**：Next.js 16（App Router）
- **前端**：React 19, Tailwind CSS 4
- **画布**：`@excalidraw/excalidraw`
- **编辑器**：`@monaco-editor/react`
- **分析**：`@vercel/analytics`

## 许可证

本项目使用 MIT License，具体见仓库中的 `LICENSE` 文件（如有）。

## 英文说明

详见：[README_EN.md](README_EN.md)
