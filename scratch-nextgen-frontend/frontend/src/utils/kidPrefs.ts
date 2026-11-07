const WELCOME_KEY = 'sng-welcome-v1';
const TOUR_KEY = 'sng-editor-tour-v1';

function readFlag(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function writeFlag(key: string): void {
  try {
    window.localStorage.setItem(key, '1');
  } catch {
    // Storage can be blocked in private browsing; skip quietly.
  }
}

export function hasSeenWelcome(): boolean {
  return readFlag(WELCOME_KEY);
}

export function markWelcomeSeen(): void {
  writeFlag(WELCOME_KEY);
}

export function hasSeenEditorTour(): boolean {
  return readFlag(TOUR_KEY);
}

export function markEditorTourSeen(): void {
  writeFlag(TOUR_KEY);
}

export const funProjectNames = [
  'Sunny Adventure',
  'Rainbow Race',
  'Secret Story',
  'Space Game',
  'Dance Time',
  'My First Game',
  'Happy Pets',
  'Magic Show',
];

export const friendNames = ['Sunny', 'Buddy', 'Pip', 'Nova', 'Ziggy', 'Mango', 'Sky', 'Bean'];

export const friendColors = ['#F97316', '#EC4899', '#2563EB', '#8B5CF6', '#10B981', '#F59E0B', '#06B6D4', '#F43F5E'];
