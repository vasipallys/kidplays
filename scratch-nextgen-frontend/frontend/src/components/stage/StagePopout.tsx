import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Square, X } from 'lucide-react';
import type { Project } from '../../types/project';
import { StageCanvas } from '../../editor/stage/StageCanvas';
import { Button } from '../ui/Button';

type StagePopoutProps = {
  open: boolean;
  title: string;
  playing: boolean;
  project: Project;
  onClose: () => void;
  onStop: () => void;
  onSpriteClick: (spriteId: string) => void;
};

export function StagePopout({ open, title, playing, project, onClose, onStop, onSpriteClick }: StagePopoutProps) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stage-popout-title"
        className="flex max-h-[96dvh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border-4 border-white bg-sky-50 shadow-2xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 bg-white px-4 py-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-sky-700">Big screen</p>
            <h2 id="stage-popout-title" className="font-display text-2xl text-slate-950">
              {title}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-extrabold ${
                playing ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {playing ? 'Playing' : 'Ready'}
            </span>
            <Button tone="stop" icon={<Square size={16} />} onClick={onStop} disabled={!playing} className="min-h-12">
              Stop
            </Button>
            <Button tone="secondary" icon={<X size={16} />} onClick={onClose} className="min-h-12">
              Back
            </Button>
          </div>
        </div>
        <div className={`min-h-0 flex-1 p-3 sm:p-5 ${playing ? 'bg-emerald-100' : ''}`}>
          <StageCanvas project={project} onSpriteClick={onSpriteClick} />
          <p className="mt-3 text-center text-sm font-bold text-slate-600">
            Click a character to hear more about this lesson. Press Esc or Back to return to the blocks.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
