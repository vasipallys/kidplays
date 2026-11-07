import { create } from 'zustand';
import { runtimeLine } from '../utils/logger';

type RuntimeStatus = 'idle' | 'running';

type RuntimeState = {
  status: RuntimeStatus;
  logs: string[];
  runToken: number;
  startRun: (message?: string) => number;
  finishRun: (runToken: number) => void;
  stopRun: () => number;
  addLog: (message: string) => void;
  clearLogs: () => void;
};

export const useRuntimeStore = create<RuntimeState>((set, get) => ({
  status: 'idle',
  logs: [],
  runToken: 0,
  startRun: (message = 'Project started.') => {
    const nextToken = get().runToken + 1;
    set({
      status: 'running',
      runToken: nextToken,
      logs: [runtimeLine(message)],
    });
    return nextToken;
  },
  finishRun: (runToken) => {
    if (get().runToken === runToken) {
      set({ status: 'idle' });
    }
  },
  stopRun: () => {
    const nextToken = get().runToken + 1;
    set((state) => ({
      status: 'idle',
      runToken: nextToken,
      logs: [...state.logs, runtimeLine('Stopped. Press Play to try again.')].slice(-60),
    }));
    return nextToken;
  },
  addLog: (message) => {
    set((state) => ({
      logs: [...state.logs, runtimeLine(message)].slice(-60),
    }));
  },
  clearLogs: () => set({ logs: [] }),
}));
