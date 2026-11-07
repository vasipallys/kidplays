import { create } from 'zustand';

<<<<<<< HEAD
const STORAGE_KEY = 'kidplays-editor-docks';

export type DockKey = 'blocksMenu' | 'stageDock' | 'toolsMenu' | 'sprites' | 'buddy' | 'logs';

type Docks = Record<DockKey, boolean>;

const defaultDocks: Docks = {
  blocksMenu: true,
  stageDock: true,
  toolsMenu: true,
  sprites: true,
  buddy: true,
  logs: true,
=======
export type EditorTab = 'code' | 'stage' | 'cast';

type UiState = {
  isCodeBuddyOpen: boolean;
  selectedBlockType?: string;
  editorTab: EditorTab;
  setCodeBuddyOpen: (open: boolean) => void;
  setSelectedBlockType: (blockType?: string) => void;
  setEditorTab: (tab: EditorTab) => void;
>>>>>>> d974eb40138a060b605b9d4d9658a9e6385fdc4b
};

function loadDocks(): Docks {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultDocks;
    }
    return { ...defaultDocks, ...JSON.parse(raw) };
  } catch {
    return defaultDocks;
  }
}

function saveDocks(docks: Docks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docks));
  } catch {
    // Private mode can block storage. The buttons still work for this visit.
  }
}

type UiState = {
  selectedBlockType?: string;
  docks: Docks;
  setSelectedBlockType: (blockType?: string) => void;
  setDock: (key: DockKey, open: boolean) => void;
};

export const useUiStore = create<UiState>((set, get) => ({
  selectedBlockType: undefined,
<<<<<<< HEAD
  docks: loadDocks(),
  setSelectedBlockType: (blockType) => set({ selectedBlockType: blockType }),
  setDock: (key, open) => {
    const docks = { ...get().docks, [key]: open };
    saveDocks(docks);
    set({ docks });
  },
=======
  editorTab: 'code',
  setCodeBuddyOpen: (open) => set({ isCodeBuddyOpen: open }),
  setSelectedBlockType: (blockType) => set({ selectedBlockType: blockType }),
  setEditorTab: (tab) => set({ editorTab: tab }),
>>>>>>> d974eb40138a060b605b9d4d9658a9e6385fdc4b
}));
