import { create } from 'zustand';

export type EditorTab = 'code' | 'stage' | 'cast';

type UiState = {
  isCodeBuddyOpen: boolean;
  selectedBlockType?: string;
  editorTab: EditorTab;
  setCodeBuddyOpen: (open: boolean) => void;
  setSelectedBlockType: (blockType?: string) => void;
  setEditorTab: (tab: EditorTab) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isCodeBuddyOpen: true,
  selectedBlockType: undefined,
  editorTab: 'code',
  setCodeBuddyOpen: (open) => set({ isCodeBuddyOpen: open }),
  setSelectedBlockType: (blockType) => set({ selectedBlockType: blockType }),
  setEditorTab: (tab) => set({ editorTab: tab }),
}));
