import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { Sprite } from '../../types/sprite';

type SpriteEditorProps = {
  sprite: Sprite;
  onUpdate: (patch: Partial<Sprite>) => void;
};

export function SpriteEditor({ sprite, onUpdate }: SpriteEditorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <label className="col-span-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        Name
        <input
          value={sprite.name}
          onChange={(event) => onUpdate({ name: event.target.value })}
          maxLength={40}
          className="mt-1 min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-500"
        />
      </label>
      <NumberField label="X" value={sprite.x} min={-240} max={240} onChange={(value) => onUpdate({ x: value })} />
      <NumberField label="Y" value={sprite.y} min={-180} max={180} onChange={(value) => onUpdate({ y: value })} />
      <NumberField label="Direction" value={sprite.direction} onChange={(value) => onUpdate({ direction: value })} />
      <NumberField label="Size %" value={sprite.size} min={5} max={300} onChange={(value) => onUpdate({ size: value })} />
      <button
        type="button"
        onClick={() => onUpdate({ visible: !sprite.visible })}
        aria-pressed={sprite.visible}
        className="col-span-2 flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
      >
        {sprite.visible ? <Eye size={16} /> : <EyeOff size={16} />}
        {sprite.visible ? 'Visible' : 'Hidden'}
      </button>
    </div>
  );
}

type NumberFieldProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

function NumberField({ label, value, min, max, onChange }: NumberFieldProps) {
  const roundedValue = Math.round(value);
  const [draft, setDraft] = useState(String(roundedValue));

  useEffect(() => {
    setDraft(String(roundedValue));
  }, [roundedValue]);

  const commit = () => {
    const parsed = Number(draft);
    if (!Number.isFinite(parsed)) {
      setDraft(String(roundedValue));
      return;
    }

    const bounded = Math.min(max ?? parsed, Math.max(min ?? parsed, parsed));
    setDraft(String(bounded));
    onChange(bounded);
  };

  return (
    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
      {label}
      <input
        type="number"
        value={draft}
        min={min}
        max={max}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.currentTarget.blur();
          }
        }}
        className="mt-1 min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-500"
      />
    </label>
  );
}
