import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ReactNode;
};

export function IconButton({ label, icon, className = '', ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white text-slate-700 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 active:translate-y-0 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
