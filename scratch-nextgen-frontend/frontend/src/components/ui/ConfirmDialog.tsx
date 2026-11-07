import { Button } from './Button';
import { Modal } from './Modal';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Yes',
  cancelLabel = 'Keep it',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-base font-semibold leading-relaxed text-slate-600">{body}</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button tone="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button tone={danger ? 'danger' : 'success'} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
