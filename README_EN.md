## Smart Excalidraw

**A Next.js application for generating Excalidraw diagrams from natural language.**

This repository contains a self-hostable implementation of Smart Excalidraw, integrating Excalidraw canvas, a code editor, and LLM configuration management. It is suitable for personal use and further customization.

## Features

- **Natural language to diagrams**: Describe what you want (flows, architectures, mind maps, ER diagrams, etc.) and the app uses an LLM to generate Excalidraw elements.
- **Native Excalidraw canvas**: Full Excalidraw experience – drag, edit, restyle, and export.
- **Code editor integration**: View and edit the generated element JSON in a Monaco editor, then apply it back to the canvas with one click.
- **Layout optimization**: An “Optimize” action improves layout and arrow connections using a custom algorithm.
- **Flexible LLM configuration**:
  - Client-side LLM configs stored in browser (OpenAI / Anthropic style APIs).
  - Optional server-side LLM + access password pattern (requires your own backend implementation).
- **Custom design & typography**: Orange primary theme and a Tiempos + PingFang font setup for a clean UI experience.

## Project Structure (Core)

- `app/`
  - `page.js`: Main UI (chat + code editor + canvas layout)
  - `layout.js`: Global layout, fonts, and Vercel Analytics
- `components/`
  - `Chat.jsx`: Chat / prompt input area
  - `CodeEditor.jsx`: Monaco editor with “Optimize” and “Apply” actions
  - `ExcalidrawCanvas.jsx`: Excalidraw wrapper with `convertToExcalidrawElements`
  - `ConfigModal.jsx` / `ConfigManager.jsx`: LLM configuration dialogs
  - `ui/`: Basic UI components (`Button`, `Input`, `Modal`, etc.)
- `lib/`
  - `llm-client.js`: Client-side LLM request helper
  - `prompts.js`: Prompt templates
  - `optimizeArrows.js`: Arrow optimization utilities
  - `config-manager.js`: LocalStorage-based config manager
  - `design-system.js`: Design tokens (colors, radius, spacing)
  - `history-manager.js`: Generation history
- `docs/`: Internal documentation (Excalidraw skeleton API, arrow rules, requirements)

## Local Development

### Requirements

- Node.js 18+
- pnpm (recommended) or npm / yarn

### Setup

```bash
git clone <your-repo-url>
cd ExcaliDraw

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Then open `http://localhost:3000` in your browser.

## LLM Configuration (Frontend)

The frontend already provides a configuration UI for LLMs:

- Click **“配置 LLM / Configure LLM”** in the top-right corner to open the modal.
- Configure:
  - Provider type: `openai`-style / `anthropic`-style
  - Base URL, API key
  - Model (either typed manually or loaded via the “load models” endpoint)
- Use the **Config Manager** to create, edit, clone, and switch between multiple configurations.

> Note: This repository does not ship with any production API keys or access password logic – you are expected to adapt `/app/api/...` routes and `.env` according to your own backend and provider setup.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, Tailwind CSS 4
- **Canvas**: `@excalidraw/excalidraw`
- **Editor**: `@monaco-editor/react`
- **Analytics**: `@vercel/analytics`

## License

This project is released under the MIT License. See `LICENSE` in the repository if present.

---

**Draw professional diagrams with natural language – built on top of Excalidraw.**