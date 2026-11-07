import type { ReactNode } from 'react';

type DockSectionProps = {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  extra?: ReactNode;
};

export function DockSection({ title, open, onToggle, children, extra }: DockSectionProps) {
  const panelId = `dock-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 px-2 py-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-11 flex-1 items-center justify-between gap-2 rounded-xl px-2 text-left hover:bg-slate-50"
        >
          <span className="text-sm font-black uppercase tracking-wide text-slate-700">{title}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
            {open ? 'Hide' : 'Show'}
          </span>
        </button>
        {extra}
      </div>
      {open ? (
        <div id={panelId} className="px-3 pb-3">
          {children}
        </div>
      ) : null}
    </section>
  );
}
