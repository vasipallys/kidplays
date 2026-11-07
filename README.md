# KidPlays — Scratch NextGen

A **frontend-only** Scratch-inspired coding playground for **kids ages 6 to 18**. Snap colorful blocks, press Play, and make games, stories, and dances. Everything stays on this device. There is no account, no chat, and no server.

The app lives in [`scratch-nextgen-frontend/frontend/`](scratch-nextgen-frontend/frontend/). Full how-to for kids, parents, teachers, and developers is in [`scratch-nextgen-frontend/README.md`](scratch-nextgen-frontend/README.md).

## Quick start

```bash
cd scratch-nextgen-frontend/frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). On Windows you can also run `scratch-nextgen-frontend/start-all.bat`.

## How kids use it

1. Tap a sample (Dance Party is a good first try).
2. Snap blocks. Yellow starts, blue moves, purple talks, orange repeats.
3. Press the green **Play** button and watch the stage.
4. On a computer, **Code**, **Looks**, and **Sounds** are tabs. The stage stays docked on the right with your characters under it.
5. On a phone, use **Code**, **Stage**, and **Characters** at the bottom.

Buddy (the orange mascot) gives short tips. Projects save in this browser. Use **Download a copy** before switching computers.

## What this repository contains

| Path | What it is |
| --- | --- |
| `scratch-nextgen-frontend/` | The kid coding app (React + Blockly) |
| `AGENTS.md` / `CLAUDE.md` | Notes for coding agents working in this repo |
| `llm-*.html` | Standalone LLM explainer pages, **not** part of the playground |

## License-friendly note

The playground never evaluates user text as code. It reads Blockly XML, maps known blocks to typed instructions, and runs a small interpreter in the browser.
