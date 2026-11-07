import { Lightbulb } from 'lucide-react';
import type { Project } from '../../types/project';
import { Mascot } from '../../components/common/Mascot';
import { getCodeBuddyHints } from './rules';

type CodeBuddyPanelProps = {
  project: Project;
  spriteId: string;
  selectedBlockType?: string;
};

export function CodeBuddyPanel({ project, spriteId, selectedBlockType }: CodeBuddyPanelProps) {
  const hints = getCodeBuddyHints(project, spriteId, selectedBlockType);

  return (
    <section className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Mascot size={56} mood="think" />
        <div>
          <h2 className="font-display text-xl text-amber-950">Buddy</h2>
          <p className="text-sm font-bold text-amber-800">Friendly tips while you build</p>
        </div>
      </div>
      <div className="space-y-2">
        {hints.map((hint) => (
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
