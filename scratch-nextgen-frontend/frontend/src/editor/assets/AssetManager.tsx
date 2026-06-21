import { ImagePlus, Music, Trash2, Upload } from 'lucide-react';
import type { Sprite } from '../../types/sprite';
import { imageFileToCostume, soundFileToAsset } from './assetUtils';
import { validateImageFile, validateSoundFile } from './fileValidation';

type AssetManagerProps = {
  sprite: Sprite;
  onUpdate: (patch: Partial<Sprite>) => void;
};

export function AssetManager({ sprite, onUpdate }: AssetManagerProps) {
  const addCostume = async (file?: File) => {
    if (!file) {
      return;
    }

    const error = validateImageFile(file);
    if (error) {
      window.alert(error);
      return;
    }

    try {
      const costume = await imageFileToCostume(file);
      onUpdate({
        costumes: [...sprite.costumes, costume],
        currentCostumeId: costume.id,
      });
    } catch {
      window.alert('Could not read that image. Please try another file.');
    }
  };

  const addSound = async (file?: File) => {
    if (!file) {
      return;
    }

    const error = validateSoundFile(file);
    if (error) {
      window.alert(error);
      return;
    }

    try {
      const sound = await soundFileToAsset(file);
      onUpdate({
        sounds: [...sprite.sounds, sound],
      });
    } catch {
      window.alert('Could not read that sound. Please try another file.');
    }
  };

  const deleteCostume = (costumeId: string) => {
    if (sprite.costumes.length <= 1) {
      window.alert('Sprites need at least one costume.');
      return;
    }

    const costumes = sprite.costumes.filter((costume) => costume.id !== costumeId);
    onUpdate({
      costumes,
      currentCostumeId: costumes[0]?.id ?? sprite.currentCostumeId,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700 focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-sky-400/40">
          <ImagePlus size={16} />
          Costume
          <input
            className="sr-only"
            type="file"
            accept=".png,.jpg,.jpeg,.svg,.webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              void addCostume(file);
            }}
          />
        </label>
        <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-pink-600 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-pink-700 focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-pink-400/40">
          <Music size={16} />
          Sound
          <input
            className="sr-only"
            type="file"
            accept=".mp3,.wav,.ogg"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              void addSound(file);
            }}
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
          <Upload size={16} />
          Costumes
        </div>
        <div className="space-y-2">
          {sprite.costumes.map((costume) => (
            <div
              key={costume.id}
              className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-2 py-2 text-sm"
            >
              <button
                type="button"
                onClick={() => onUpdate({ currentCostumeId: costume.id })}
                className={`flex min-w-0 flex-1 items-center gap-2 text-left ${
                  sprite.currentCostumeId === costume.id ? 'font-bold text-sky-700' : 'text-slate-700'
                }`}
              >
                <img src={costume.dataUrl} alt="" className="h-8 w-8 rounded object-contain" />
                <span className="truncate">{costume.name}</span>
              </button>
              <button
                type="button"
                onClick={() => deleteCostume(costume.id)}
                className="rounded p-1 text-slate-500 hover:bg-rose-100 hover:text-rose-700"
                title="Delete costume"
                aria-label={`Delete ${costume.name} costume`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
          <Music size={16} />
          Sounds
        </div>
        {sprite.sounds.length === 0 ? (
          <p className="text-sm text-slate-500">No sounds yet.</p>
        ) : (
          <div className="space-y-2">
            {sprite.sounds.map((sound) => (
              <div key={sound.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-2 py-2 text-sm">
                <span className="truncate">{sound.name}</span>
                <button
                  type="button"
                  className="text-slate-500 hover:text-rose-700"
                  onClick={() => onUpdate({ sounds: sprite.sounds.filter((item) => item.id !== sound.id) })}
                  aria-label={`Delete ${sound.name} sound`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
