import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonTone = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'play' | 'stop' | 'sun';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: ButtonTone;
  icon?: ReactNode;
};

const toneClasses: Record<ButtonTone, string> = {
  primary: 'bg-sky-500 text-white hover:bg-sky-600 focus-visible:outline-sky-500/40 shadow-sticker',
  secondary: 'border-2 border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50',
  danger: 'bg-rose-500 text-white hover:bg-rose-600 focus-visible:outline-rose-500/40',
  ghost: 'bg-transparent text-slate-700 shadow-none hover:bg-white/80',
  success: 'bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:outline-emerald-500/40 shadow-sticker',
  play: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-play',
  stop: 'bg-rose-500 text-white hover:bg-rose-600 shadow-stop',
  sun: 'bg-amber-400 text-amber-950 hover:bg-amber-300',
};

export function Button({ tone = 'primary', icon, children, className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-base font-extrabold shadow-sm transition duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:translate-y-0 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:opacity-100 ${toneClasses[tone]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
