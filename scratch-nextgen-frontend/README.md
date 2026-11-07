# Scratch NextGen Frontend

Scratch NextGen is a frontend-only, Scratch-inspired visual programming playground for **kids ages 6 to 18**. It runs in the browser with React, TypeScript, Vite, Tailwind CSS, Zustand, Blockly, IndexedDB, the File API, Canvas, and Web Audio.

There is no backend, cloud storage, server-side database, remote authentication, or generated JavaScript execution. Projects stay on this device.

## For kids

1. Open the home page.
2. Tap a colorful sample, or start a new project and give it a fun name.
3. Snap blocks together. Yellow starts, blue moves, purple talks, orange repeats.
4. Press the big green **Play** button and watch the stage.
5. Click characters or press keys if the project uses those.
6. Change a number, press Play again, and see what happens.

On a phone or tablet, use the **Code**, **Stage**, and **Characters** buttons at the bottom. Play switches you to the stage so you can watch.

Buddy (the orange mascot) gives short tips. Nothing is sent to the internet.

## For parents and teachers

- **Ages 6–8:** start with Easy samples (Dance Party, Tiny Story, Hide and Seek). Large buttons, short words, and a first-visit how-to.
- **Ages 9–12:** samples plus their own games. Arrow keys, loops, and costumes.
- **Ages 13–18:** same editor, less babyish. Import/export, variables, and full block control.

Projects are saved in this browser only. Use **Download a copy** if a child might switch computers. There is no account and no chat.

## What Is Included

- Kid-friendly project dashboard with samples, search, and friendly dialogs
- Create, open, rename, duplicate, delete, import, and export projects
- IndexedDB local project storage through Dexie
- Scratch-style editor with a phone/tablet tab layout
- Blockly workspace with event, motion, looks, sound, and loop blocks
- Safe TypeScript interpreter that reads Blockly XML and maps blocks to controlled runtime actions
- Canvas stage with a 480x360 Scratch-like coordinate system
- Default character, movement, speech bubbles, waits, repeats, clicks, and keyboard starts
- Character details, local image looks, and local sound uploads
- Kid-readable activity log
- Rule-based frontend-only Buddy helper (not AI)

## Requirements

- Windows 10 or newer, macOS, or Linux
- Node.js 18 or newer
- npm

## Run Locally

```bash
cd scratch-nextgen-frontend/frontend
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

On Windows, you can also run:

```bat
start-all.bat
```

or:

```bat
cd frontend
start-frontend.bat
```

## Build

```bash
cd scratch-nextgen-frontend/frontend
npm run build
```

## GitHub Pages Hosting

The app uses `HashRouter` and Vite relative asset paths, so it can be hosted from a GitHub Pages project URL such as:

```text
https://your-user.github.io/your-repo/
```

To deploy with GitHub Actions:

1. Push this repository to GitHub.
2. In GitHub, open Settings > Pages.
3. Set Source to GitHub Actions.
4. Push to the `main` branch, or run the `Deploy Scratch NextGen to GitHub Pages` workflow manually.

The workflow builds `scratch-nextgen-frontend/frontend` and publishes `scratch-nextgen-frontend/frontend/dist`.

You can also build the Pages-ready static files locally:

```bash
cd scratch-nextgen-frontend/frontend
npm run build:github
```

## Test Steps

1. Open the dashboard. The how-to dialog should appear the first time.
2. Create a new project with a suggested name.
3. Press Play. The default character should move and say hello.
4. Drag a Repeat block around Move, change the numbers, and press Play again.
5. On a narrow window, use Code / Stage / Characters tabs. Play should show the stage.
6. Add a look from your computer and confirm it appears on the stage.
7. Save the project, return to My projects, rename it, and reopen it.
8. Download the project file, then open it again from the dashboard.
9. Try clicking a character on the stage after adding a "when this sprite clicked" stack.

## Local Data

Projects are stored in the browser's IndexedDB database named `ScratchNextGenDatabase`. Uploaded images and sounds are stored inside project JSON as data URLs, so exported files remain portable.

First-visit tips use `localStorage` keys `sng-welcome-v1` and `sng-editor-tour-v1`.

## Folder Structure

```text
scratch-nextgen-frontend/
  frontend/
    public/
      assets/
      templates/
    src/
      app/
      components/
      pages/
      editor/
      store/
      storage/
      templates/
      types/
      utils/
    package.json
    vite.config.ts
    tsconfig.json
    tailwind.config.js
    postcss.config.js
    .env.example
    start-frontend.bat
  README.md
  start-all.bat
```
