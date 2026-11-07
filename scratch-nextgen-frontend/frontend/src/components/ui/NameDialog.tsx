import { FormEvent, useEffect, useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

type NameDialogProps = {
  open: boolean;
  title: string;
  label: string;
  initialValue?: string;
  confirmLabel?: string;
  suggestions?: string[];
  onSubmit: (name: string) => void;
  onCancel: () => void;
};

export function NameDialog({
  open,
  title,
  label,
  initialValue = '',
  confirmLabel = 'Save',
  suggestions = [],
  onSubmit,
  onCancel,
}: NameDialogProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
    }
  }, [open, initialValue]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const name = value.trim();
    if (!name) {
      return;
    }
    onSubmit(name);
  };

  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <form onSubmit={submit}>
        <label className="block text-sm font-extrabold uppercase tracking-wide text-slate-500">
          {label}
          <input
            value={value}
            autoFocus
            maxLength={40}
            onChange={(event) => setValue(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-2xl border-2 border-slate-200 px-4 text-lg font-extrabold text-slate-900 outline-none transition focus:border-sky-400"
          />
        </label>
        {suggestions.length > 0 ? (
          <div className="mt-4">
            <p className="text-sm font-extrabold text-slate-500">Need an idea?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setValue(suggestion)}
                  className="rounded-full bg-sky-100 px-3 py-2 text-sm font-extrabold text-sky-800 transition hover:bg-sky-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button tone="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" tone="success" disabled={!value.trim()}>
            {confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
