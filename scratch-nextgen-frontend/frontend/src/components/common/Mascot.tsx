type MascotProps = {
  mood?: 'happy' | 'think' | 'cheer';
  size?: number;
  className?: string;
};

export function Mascot({ mood = 'happy', size = 88, className = '' }: MascotProps) {
  const mouth =
    mood === 'think'
      ? 'M72 102 Q88 112 104 102'
      : mood === 'cheer'
        ? 'M64 96 Q88 128 112 96'
        : 'M66 100 Q88 122 110 100';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      aria-hidden="true"
      className={className}
    >
      <circle cx="80" cy="84" r="52" fill="#F97316" />
      <circle cx="64" cy="74" r="8" fill="#111827" />
      <circle cx="100" cy="74" r="8" fill="#111827" />
      <circle cx="67" cy="71" r="3" fill="#FFFFFF" />
      <circle cx="103" cy="71" r="3" fill="#FFFFFF" />
      <path d={mouth} fill="none" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
      <path d="M36 48 L58 18 L70 58 Z" fill="#F97316" />
      <path d="M124 48 L102 18 L90 58 Z" fill="#F97316" />
      <circle cx="128" cy="112" r="14" fill="#FDE68A" />
      <path
        d="M128 98 L132 110 L145 110 L134 118 L138 131 L128 123 L118 131 L122 118 L111 110 L124 110 Z"
        fill="#F59E0B"
      />
    </svg>
  );
}
