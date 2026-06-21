import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonTone = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: ButtonTone;
  icon?: ReactNode;
};

const toneClasses: Record<ButtonTone, string> = {
  primary: 'bg-sky-600 text-white hover:bg-sky-700 focus-visible:outline-sky-500/40',
  secondary: 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-500/40',
  ghost: 'bg-transparent text-slate-700 shadow-none hover:bg-slate-100',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-500/40',
};

export function Button({ tone = 'primary', icon, children, className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black shadow-sm transition duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 ${toneClasses[tone]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
