import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-sky-200 bg-white/85 p-8 text-center shadow-sm backdrop-blur">
      <div className="mb-4 rounded-2xl bg-sky-100 p-3 text-sky-700">{icon}</div>
      <h2 className="text-xl font-black text-slate-800">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
