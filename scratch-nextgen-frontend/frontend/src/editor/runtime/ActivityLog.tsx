type ActivityLogProps = {
  lines: string[];
};

export function ActivityLog({ lines }: ActivityLogProps) {
  return (
    <details className="rounded-2xl border-2 border-slate-100 bg-white p-3">
      <summary className="cursor-pointer font-display text-base text-slate-800">What just happened</summary>
      <div
        className="mt-2 max-h-32 space-y-1.5 overflow-y-auto rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700"
        role="log"
        aria-live="polite"
      >
        {lines.length === 0 ? (
          <p className="text-slate-500">Press Play to see your project talk back here.</p>
        ) : (
          lines.map((line, index) => (
            <p key={`${index}-${line}`} className="rounded-xl bg-white px-3 py-2 shadow-sm">
              {line}
            </p>
          ))
        )}
      </div>
    </details>
  );
}
