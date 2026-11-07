import { create } from 'zustand';

const STORAGE_KEY = 'kidplays-editor-docks';

export type EditorTab = 'code' | 'stage' | 'cast';
export type DockKey = 'blocksMenu' | 'stageDock' | 'toolsMenu' | 'sprites' | 'buddy' | 'logs';

type Docks = Record<DockKey, boolean>;

const defaultDocks: Docks = {
  blocksMenu: true,
  stageDock: true,
  toolsMenu: true,
  sprites: true,
  buddy: true,
  logs: true,
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
  editorTab: EditorTab;
  docks: Docks;
  setSelectedBlockType: (blockType?: string) => void;
  setEditorTab: (tab: EditorTab) => void;
  setDock: (key: DockKey, open: boolean) => void;
};

export const useUiStore = create<UiState>((set, get) => ({
  selectedBlockType: undefined,
  editorTab: 'code',
  docks: loadDocks(),
  setSelectedBlockType: (blockType) => set({ selectedBlockType: blockType }),
  setEditorTab: (tab) => set({ editorTab: tab }),
  setDock: (key, open) => {
    const docks = { ...get().docks, [key]: open };
    saveDocks(docks);
    set({ docks });
  },
}));
