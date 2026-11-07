import { Trash2 } from 'lucide-react';
import type { Project } from '../../types/project';
import type { Sprite } from '../../types/sprite';
import { CharacterDock } from './CharacterDock';
import { SpriteEditor } from './SpriteEditor';

type SpritePanelProps = {
  project: Project;
  activeSpriteId: string;
  onSelectSprite: (spriteId: string) => void;
  onAddSprite: () => void;
  onUpdateSprite: (spriteId: string, patch: Partial<Sprite>) => void;
  onAskDelete: (sprite: Sprite) => void;
};

export function SpritePanel({
  project,
  activeSpriteId,
  onSelectSprite,
  onAddSprite,
  onUpdateSprite,
  onAskDelete,
}: SpritePanelProps) {
  const activeSprite = project.sprites.find((sprite) => sprite.id === activeSpriteId) ?? project.sprites[0];

  return (
    <div className="space-y-4">
      <CharacterDock
        project={project}
        activeSpriteId={activeSpriteId}
        onSelectSprite={onSelectSprite}
        onAddSprite={onAddSprite}
      />

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
    </div>
  );
}
