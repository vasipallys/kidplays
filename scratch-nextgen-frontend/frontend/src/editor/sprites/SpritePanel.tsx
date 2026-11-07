import { Plus, Trash2 } from 'lucide-react';
import type { Project } from '../../types/project';
import type { Sprite } from '../../types/sprite';
import { AssetManager } from '../assets/AssetManager';
import { SpriteEditor } from './SpriteEditor';

type SpritePanelProps = {
  project: Project;
  activeSpriteId: string;
  onSelectSprite: (spriteId: string) => void;
  onAddSprite: () => void;
  onUpdateSprite: (spriteId: string, patch: Partial<Sprite>) => void;
  onAskDelete: (sprite: Sprite) => void;
  onError?: (message: string) => void;
};

export function SpritePanel({
  project,
  activeSpriteId,
  onSelectSprite,
  onAddSprite,
  onUpdateSprite,
  onAskDelete,
  onError,
}: SpritePanelProps) {
  const activeSprite = project.sprites.find((sprite) => sprite.id === activeSpriteId) ?? project.sprites[0];

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg text-slate-800">Characters</h2>
            <p className="text-xs font-bold text-slate-500">Tap one to choose it, then open Code</p>
          </div>
          <button
            type="button"
            onClick={onAddSprite}
            className="inline-flex min-h-12 items-center gap-1 rounded-2xl bg-emerald-500 px-3 py-2 text-sm font-extrabold text-white shadow-sticker transition hover:bg-emerald-600"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {project.sprites.map((sprite) => {
            const costume = sprite.costumes.find((item) => item.id === sprite.currentCostumeId) ?? sprite.costumes[0];
            return (
              <button
                key={sprite.id}
                type="button"
                onClick={() => onSelectSprite(sprite.id)}
                aria-pressed={activeSpriteId === sprite.id}
                className={`min-h-16 rounded-2xl border-4 p-2 text-left transition ${
                  activeSpriteId === sprite.id
                    ? 'border-sky-400 bg-sky-50 shadow-sm'
                    : 'border-transparent bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <img src={costume?.dataUrl} alt="" className="h-12 w-12 rounded-xl object-contain" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-slate-800">{sprite.name}</p>
                    <p className="text-xs font-bold text-slate-500">
                      {sprite.visible ? `x ${Math.round(sprite.x)}, y ${Math.round(sprite.y)}` : 'Hidden'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {activeSprite ? (
        <div className="space-y-3 rounded-3xl border-2 border-slate-100 bg-white p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-slate-800">{activeSprite.name}</h3>
            <button
              type="button"
              disabled={project.sprites.length <= 1}
              onClick={() => onAskDelete(activeSprite)}
              className="rounded-2xl p-2 text-slate-500 transition hover:bg-rose-100 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
              title="Remove character"
              aria-label={`Remove ${activeSprite.name}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
          <SpriteEditor sprite={activeSprite} onUpdate={(patch) => onUpdateSprite(activeSprite.id, patch)} />
        </div>
      ) : null}

      {activeSprite ? (
        <AssetManager
          sprite={activeSprite}
          onUpdate={(patch) => onUpdateSprite(activeSprite.id, patch)}
          onError={onError}
        />
      ) : null}
    </div>
  );
}
