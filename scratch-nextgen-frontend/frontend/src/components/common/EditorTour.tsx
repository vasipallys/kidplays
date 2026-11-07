import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Mascot } from './Mascot';

type EditorTourProps = {
  open: boolean;
  onClose: () => void;
};

export function EditorTour({ open, onClose }: EditorTourProps) {
  return (
    <Modal open={open} title="Three things to try" onClose={onClose}>
      <div className="flex justify-center">
        <Mascot size={84} mood="happy" className="animate-kid-float" />
      </div>
      <ol className="mt-4 space-y-3 text-base font-bold text-slate-700">
        <li className="rounded-2xl bg-amber-50 px-4 py-3">
          1. Drag a yellow <span className="text-amber-700">Events</span> block, then snap more blocks under it.
        </li>
        <li className="rounded-2xl bg-emerald-50 px-4 py-3">
          2. Press the big green <span className="text-emerald-700">Play</span> button.
        </li>
        <li className="rounded-2xl bg-sky-50 px-4 py-3">
          3. Watch the stage. Click a character or press a key if your project uses those.
        </li>
      </ol>
      <p className="mt-4 text-sm font-semibold text-slate-500">
        On a phone or tablet, use the Code, Stage, and Characters buttons at the bottom.
      </p>
      <div className="mt-6">
        <Button tone="play" className="w-full" onClick={onClose}>
          I'm ready
        </Button>
      </div>
    </Modal>
  );
}
