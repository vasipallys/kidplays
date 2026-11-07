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
          1. Stay on the <span className="text-sky-700">Code</span> tab. Drag a yellow Events block from the left menu.
        </li>
        <li className="rounded-2xl bg-emerald-50 px-4 py-3">
          2. Press the big green <span className="text-emerald-700">Play</span> button.
        </li>
        <li className="rounded-2xl bg-sky-50 px-4 py-3">
          3. Watch the <span className="text-sky-700">stage</span> on the right. It stays there. Click a character if you want.
        </li>
      </ol>
      <p className="mt-4 text-sm font-semibold text-slate-500">
        Code, Looks, and Sounds are tabs at the top. Characters sit under the stage. On a phone, use the buttons at the bottom.
      </p>
      <div className="mt-6">
        <Button tone="play" className="w-full" onClick={onClose}>
          I'm ready
        </Button>
      </div>
    </Modal>
  );
}
