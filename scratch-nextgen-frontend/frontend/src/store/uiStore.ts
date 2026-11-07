import { create } from 'zustand';

export type EditorTab = 'code' | 'stage' | 'cast';
export type WorkspacePane = 'code' | 'looks' | 'sounds';

type UiState = {
  isCodeBuddyOpen: boolean;
  selectedBlockType?: string;
  editorTab: EditorTab;
  workspacePane: WorkspacePane;
  setCodeBuddyOpen: (open: boolean) => void;
  setSelectedBlockType: (blockType?: string) => void;
  setEditorTab: (tab: EditorTab) => void;
  setWorkspacePane: (pane: WorkspacePane) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isCodeBuddyOpen: true,
  selectedBlockType: undefined,
  editorTab: 'code',
  workspacePane: 'code',
  setCodeBuddyOpen: (open) => set({ isCodeBuddyOpen: open }),
  setSelectedBlockType: (blockType) => set({ selectedBlockType: blockType }),
  setEditorTab: (tab) => set({ editorTab: tab }),
  setWorkspacePane: (pane) => set({ workspacePane: pane }),
}));
