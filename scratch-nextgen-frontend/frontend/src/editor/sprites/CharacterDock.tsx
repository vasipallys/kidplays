import { Plus, Trash2 } from 'lucide-react';
import type { Project } from '../../types/project';

type CharacterDockProps = {
  project: Project;
  activeSpriteId: string;
  onSelectSprite: (spriteId: string) => void;
  onAddSprite: () => void;
  onAskDelete?: () => void;
};

export function CharacterDock({
  project,
  activeSpriteId,
  onSelectSprite,
  onAddSprite,
  onAskDelete,
}: CharacterDockProps) {
  return (
    <section aria-label="Characters">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-lg text-slate-800">Characters</h2>
          <p className="text-xs font-bold text-slate-500">Tap one. Then use Code, Looks, or Sounds.</p>
        </div>
        <div className="flex gap-1">
          {onAskDelete ? (
            <button
              type="button"
              onClick={onAskDelete}
              disabled={project.sprites.length <= 1}
              className="inline-flex min-h-11 w-11 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-rose-100 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Remove this character"
              title="Remove this character"
            >
              <Trash2 size={18} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onAddSprite}
            className="inline-flex min-h-11 items-center gap-1 rounded-2xl bg-emerald-500 px-3 py-2 text-sm font-extrabold text-white shadow-sticker transition hover:bg-emerald-600"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {project.sprites.map((sprite) => {
          const costume = sprite.costumes.find((item) => item.id === sprite.currentCostumeId) ?? sprite.costumes[0];
          const selected = activeSpriteId === sprite.id;
          return (
            <button
              key={sprite.id}
              type="button"
              onClick={() => onSelectSprite(sprite.id)}
              aria-pressed={selected}
              className={`w-[5.5rem] shrink-0 rounded-2xl border-4 p-2 text-center transition ${
                selected ? 'border-sky-400 bg-sky-50 shadow-sm' : 'border-white bg-white hover:border-slate-200'
              }`}
            >
              <img src={costume?.dataUrl} alt="" className="mx-auto h-12 w-12 object-contain" />
              <p className="mt-1 truncate text-xs font-extrabold text-slate-800">{sprite.name}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
