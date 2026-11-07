import { Lightbulb } from 'lucide-react';
import type { Project } from '../../types/project';
import { Mascot } from '../../components/common/Mascot';
import { getCodeBuddyHints } from './rules';

type CodeBuddyPanelProps = {
  project: Project;
  spriteId: string;
  selectedBlockType?: string;
  compact?: boolean;
};

export function CodeBuddyPanel({ project, spriteId, selectedBlockType, compact = false }: CodeBuddyPanelProps) {
  const hints = getCodeBuddyHints(project, spriteId, selectedBlockType);
  const visibleHints = compact ? hints.slice(0, 1) : hints;

  return (
    <section className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-3">
      <div className={`mb-2 flex items-center gap-3 ${compact ? '' : 'mb-3'}`}>
        <Mascot size={compact ? 44 : 56} mood="think" />
        <div>
          <h2 className="font-display text-lg text-amber-950 sm:text-xl">Buddy</h2>
          <p className="text-xs font-bold text-amber-800 sm:text-sm">A tip for what to try next</p>
        </div>
      </div>
      <div className="space-y-2">
        {visibleHints.map((hint) => (
          <div key={`${hint.title}-${hint.body}`} className="rounded-2xl bg-white px-3 py-2.5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <Lightbulb size={16} className="text-amber-500" />
              {hint.title}
            </div>
            <p className="mt-1 text-sm font-semibold leading-snug text-slate-600">{hint.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
