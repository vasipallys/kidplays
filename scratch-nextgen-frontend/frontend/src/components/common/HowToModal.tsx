import { Blocks, Flag, MousePointerClick, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Mascot } from './Mascot';

type HowToModalProps = {
  open: boolean;
  onClose: () => void;
};

const steps = [
  {
    icon: Sparkles,
    title: 'Start with a sample',
    body: 'Tap a colorful sample on the home page. Each one already moves, talks, or listens to keys.',
  },
  {
    icon: Blocks,
    title: 'Snap blocks like stickers',
    body: 'Use the Code tab. Yellow blocks start the story. Blue moves. Purple talks. Orange repeats. Looks and Sounds have their own tabs.',
  },
  {
    icon: Flag,
    title: 'Press the green Play button',
    body: 'Watch the stage. That is the movie screen for your characters.',
  },
  {
    icon: MousePointerClick,
    title: 'Click, type, and try again',
    body: 'Click a character or press a key if your project uses those. Change a number, then Play again.',
  },
];

export function HowToModal({ open, onClose }: HowToModalProps) {
  return (
    <Modal open={open} title="How to make something cool" onClose={onClose} wide>
      <div className="flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3">
        <Mascot size={64} mood="cheer" />
        <p className="text-base font-bold leading-relaxed text-amber-950">
          You do not need to type code. Snap blocks, press Play, and see what happens. Made for ages 6 to 18.
        </p>
      </div>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.title} className="rounded-2xl border-2 border-slate-100 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-sm font-black text-white">
                  {index + 1}
                </span>
                <Icon size={18} className="text-sky-700" />
                <h3 className="font-display text-lg text-slate-900">{step.title}</h3>
              </div>
              <p className="text-sm font-semibold leading-relaxed text-slate-600">{step.body}</p>
            </li>
          );
        })}
      </ol>
      <div className="mt-6 flex justify-end">
        <Button tone="play" onClick={onClose}>
          Got it - let's go
        </Button>
      </div>
    </Modal>
  );
}
