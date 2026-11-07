# Scratch NextGen

Scratch NextGen is a frontend-only, Scratch-inspired visual programming playground for **kids ages 6 to 18**. It runs in the browser with React, TypeScript, Vite, Tailwind CSS, Zustand, Blockly, IndexedDB, the File API, Canvas, and Web Audio.

There is no backend, cloud storage, server-side database, remote authentication, or generated JavaScript execution. Projects stay on this device.

The app code is in `frontend/`.

## For kids

1. Open the home page.
2. Tap a colorful sample, or tap **New project** and pick a fun name.
3. Snap blocks together.
   - **Yellow Events** start the story (Play, click, or a key).
   - **Blue Motion** moves and turns.
   - **Purple Looks** talk, think, hide, and grow.
   - **Pink Sound** plays a sound you added.
   - **Orange Loops** wait, repeat, and go forever.
4. Press the big green **Play** button and watch the stage.
5. Click characters or press keys if your project uses those.
6. Change a number, press Play again, and see what happens.

On a phone or tablet, use **Code**, **Stage**, and **Characters** at the bottom. Play switches you to the stage so you can watch.

Buddy (the orange mascot) gives short tips. Nothing is sent to the internet.

Tap the **?** button any time to see “How to make something cool” again.

## For parents and teachers

| Ages | What to try |
| --- | --- |
| **6–8** | Easy samples: Dance Party, Tiny Story, Hide and Seek. Large buttons, short words, first-visit how-to. |
| **9–12** | Their own games. Arrow keys, loops, looks, and extra characters. |
| **13–18** | Same editor. Open a file / download a copy, variables, and the full block list. |

Projects are saved in **this browser only**. Use **Download a copy** if a child might switch computers. There is no account and no chat.

If a how-to dialog should appear again, clear this site’s local storage for keys `sng-welcome-v1` and `sng-editor-tour-v1`.

## Ready-to-play samples

| Sample | Level | Ages | What it teaches |
| --- | --- | --- | --- |
| Dance Party | Easy | 6+ | Repeat loops, turns, size |
| Tiny Story | Easy | 6+ | Say blocks and taking turns |
| Hide and Seek | Easy | 6+ | Click a character to start a script |
| Bounce Lab | Fun | 7+ | Forever loops and edge bounce |
| Keyboard Quest | Fun | 8+ | Space, A, and B keys |
| Space Chase | Challenge | 8+ | Arrow keys to fly |

Each sample is copied into My projects, so kids can change it safely.

## What is included

- Kid-friendly home: samples, search, name dialogs, delete confirmations
- Create, open, rename, duplicate, delete, import, and export projects
- IndexedDB storage through Dexie (`ScratchNextGenDatabase`)
- Editor with Play / Stop / Reset / Save
- Docked menus: Code, Looks, and Sounds tabs; stage and characters stay on the right
- Phone and tablet tabs: Code, Stage, Characters
- Blockly workspace (Zelos renderer) with Events, Motion, Looks, Sound, Loops, Sensing, Variables
- Safe TypeScript interpreter that reads Blockly XML and maps blocks to controlled actions
- Canvas stage, 480×360, Scratch-style centered coordinates
- Speech bubbles, waits, repeats, clicks, and keyboard starts
- Character details, local image looks, local sound uploads
- Kid-readable “What just happened” activity log
- Rule-based Buddy helper (not AI)
- First-visit how-to and a three-step editor tour

## Requirements

- Windows 10 or newer, macOS, or Linux
- Node.js 18 or newer
- npm

## Run locally

```bash
cd scratch-nextgen-frontend/frontend
npm install
npm run dev
```

Then open the Vite URL, usually:

```text
http://localhost:5173
```

The dev server binds `0.0.0.0`, so other devices on the same network can join.

On Windows:

```bat
start-all.bat
```

or:

```bat
cd frontend
start-frontend.bat
```

Routes use a hash (needed for GitHub Pages):

```text
http://localhost:5173/#/
http://localhost:5173/#/editor/<project-id>
```

## Build

```bash
cd scratch-nextgen-frontend/frontend
npm run build
```

That runs `tsc -b` (strict TypeScript) and then Vite. There is no separate test runner or linter.

Preview the production build:

```bash
npm run preview
```

Pages-ready static files (relative asset paths):

```bash
npm run build:github
```

`vite.config.ts` already sets `base: './'`, so both build scripts produce portable files.

## GitHub Pages

The app uses `HashRouter` and relative asset paths, so it can live at a project URL such as:

```text
https://your-user.github.io/your-repo/
```

This repository does not currently ship a GitHub Actions workflow. To host it:

1. Run `npm run build:github` in `frontend/`.
2. Publish the `frontend/dist` folder (includes `.nojekyll`).
3. Or add a Pages workflow that builds `scratch-nextgen-frontend/frontend` and uploads `dist`.

## Try this checklist

1. Open the home page. The how-to dialog should appear the first time.
2. Close it, then tap **Dance Party**.
3. Close the editor tour if it appears. Press **Play**. The dancers should move and talk.
4. Press **Stop**, then **Reset**.
5. Tap the project name to rename it.
6. On a narrow window, use Code / Stage / Characters. Play should show the stage.
7. Add a look from your computer and confirm it appears on the stage.
8. Go back. The project should sit under **My projects**. Rename and delete should open in-app dialogs, not browser prompts.
9. **New project**, pick a suggested name, press Play. The starter character should walk and say hello.
10. Download a copy, then **Open a file** to bring it back.

## Local data

| Store | What it holds |
| --- | --- |
| IndexedDB `ScratchNextGenDatabase` | Projects, including looks and sounds as data URLs |
| `localStorage` `sng-welcome-v1` | Home how-to already seen |
| `localStorage` `sng-editor-tour-v1` | Editor tour already seen |

Exported files are `.scratch-nextgen.json` and are fully portable.

## Keyboard starts

These keys can start scripts if a character has a matching **when key pressed** block:

- Space
- Arrow Up / Down / Left / Right
- A, B

Keys are ignored while typing in a name field or Blockly input.

## Folder structure

```text
scratch-nextgen-frontend/
  frontend/
    public/
      .nojekyll
      favicon.svg
      blockly-media/          # Blockly zoom, trash, and click sounds
    src/
      app/                    # HashRouter, routes, providers
      components/
        common/               # Mascot, HowToModal, EditorTour, EmptyState
        layout/
        ui/                   # Button, Modal, NameDialog, ConfirmDialog
      pages/                  # DashboardPage, EditorPage
      editor/
        blocks/               # Blockly definitions, toolbox, workspace
        runtime/              # XML → instructions → interpreter
        sprites/
        stage/
        assets/
        codeBuddy/            # Rule-based tips (not AI)
      store/                  # Zustand: project, runtime, UI tabs
      storage/                # Dexie + import/export
      templates/              # Blank project and six samples
      types/
      utils/
    index.html
    package.json
    vite.config.ts
    tsconfig.json
    tailwind.config.js
    .env.example
    start-frontend.bat
  README.md
  start-all.bat
```

## Kid UI conventions (for contributors)

- Copy should work for a six-year-old without talking down to a teen.
- Prefer **Play**, **character**, **look**, and **Download a copy** over JSON, sprite, or runtime.
- Use `NameDialog` and `ConfirmDialog`. Do not add `window.prompt` / `window.confirm` for create, rename, or delete.
- Keep tap targets at least 48px. Play and Stop should stay obvious on a phone.
- Phone tabs are `editorTab` in `src/store/uiStore.ts`: `code` | `stage` | `cast`. Play should move a phone to the stage.
- Buddy is rule-based. Do not add a network model or `eval`.
