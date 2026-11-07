import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-4 border-dashed border-sky-200 bg-white/90 p-8 text-center shadow-soft">
      <div className="mb-4 rounded-3xl bg-sky-100 p-4 text-sky-700">{icon}</div>
      <h2 className="font-display text-2xl text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-base font-semibold leading-relaxed text-slate-500">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
