import { ImagePlus, Music, Trash2 } from 'lucide-react';
import type { Sprite } from '../../types/sprite';
import { imageFileToCostume, soundFileToAsset } from './assetUtils';
import { validateImageFile, validateSoundFile } from './fileValidation';

type AssetManagerProps = {
  sprite: Sprite;
  onUpdate: (patch: Partial<Sprite>) => void;
  onError?: (message: string) => void;
  showLooks?: boolean;
  showSounds?: boolean;
};

export function AssetManager({
  sprite,
  onUpdate,
  onError,
  showLooks = true,
  showSounds = true,
}: AssetManagerProps) {
  const showError = (message: string) => {
    onError?.(message);
    if (!onError) {
      window.alert(message);
    }
  };

  const addCostume = async (file?: File) => {
    if (!file) {
      return;
    }

    const error = validateImageFile(file);
    if (error) {
      showError(error);
      return;
    }

    try {
      const costume = await imageFileToCostume(file);
      onUpdate({
        costumes: [...sprite.costumes, costume],
        currentCostumeId: costume.id,
      });
    } catch {
      showError('Could not read that picture. Try a PNG, JPG, SVG, or WebP.');
    }
  };

  const addSound = async (file?: File) => {
    if (!file) {
      return;
    }

    const error = validateSoundFile(file);
    if (error) {
      showError(error);
      return;
    }

    try {
      const sound = await soundFileToAsset(file);
      onUpdate({
        sounds: [...sprite.sounds, sound],
      });
    } catch {
      showError('Could not read that sound. Try an MP3, WAV, or OGG.');
    }
  };

  const deleteCostume = (costumeId: string) => {
    if (sprite.costumes.length <= 1) {
      showError('Every character needs at least one look.');
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
      {showLooks && showSounds ? (
        <div className="grid grid-cols-2 gap-2">
          <AddLookButton onFile={(file) => void addCostume(file)} />
          <AddSoundButton onFile={(file) => void addSound(file)} />
        </div>
      ) : showLooks ? (
        <AddLookButton onFile={(file) => void addCostume(file)} />
      ) : (
        <AddSoundButton onFile={(file) => void addSound(file)} />
      )}

      {showLooks ? (
      <div className="rounded-3xl border-2 border-slate-100 bg-white p-3">
        <div className="mb-2 text-sm font-extrabold text-slate-700">Looks</div>
        <div className="grid grid-cols-3 gap-2">
          {sprite.costumes.map((costume) => (
            <div
              key={costume.id}
              className={`relative rounded-2xl border-2 p-2 ${
                sprite.currentCostumeId === costume.id ? 'border-sky-400 bg-sky-50' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <button
                type="button"
                onClick={() => onUpdate({ currentCostumeId: costume.id })}
                className="block w-full text-center"
                aria-pressed={sprite.currentCostumeId === costume.id}
              >
                <img src={costume.dataUrl} alt="" className="mx-auto h-14 w-14 object-contain" />
                <span className="mt-1 block truncate text-xs font-extrabold text-slate-700">{costume.name}</span>
              </button>
              <button
                type="button"
                onClick={() => deleteCostume(costume.id)}
                className="absolute right-1 top-1 rounded-lg bg-white/90 p-1 text-slate-500 hover:bg-rose-100 hover:text-rose-700"
                title="Delete look"
                aria-label={`Delete ${costume.name} look`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      ) : null}

      {showSounds ? (
      <div className="rounded-3xl border-2 border-slate-100 bg-white p-3">
        <div className="mb-2 text-sm font-extrabold text-slate-700">Sounds</div>
        {sprite.sounds.length === 0 ? (
          <p className="text-sm font-semibold text-slate-500">No sounds yet. Add one to play music or effects.</p>
        ) : (
          <div className="space-y-2">
            {sprite.sounds.map((sound) => (
              <div key={sound.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                <span className="truncate font-extrabold text-slate-700">{sound.name}</span>
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-500 hover:bg-rose-100 hover:text-rose-700"
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
      ) : null}
    </div>
  );
}

function AddLookButton({ onFile }: { onFile: (file?: File) => void }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-sky-500 px-3 py-2 text-sm font-extrabold text-white shadow-sticker transition hover:bg-sky-600 focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-sky-400/40">
      <ImagePlus size={18} />
      Add a look
      <input
        className="sr-only"
        type="file"
        accept=".png,.jpg,.jpeg,.svg,.webp"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          onFile(file);
        }}
      />
    </label>
  );
}

function AddSoundButton({ onFile }: { onFile: (file?: File) => void }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-pink-500 px-3 py-2 text-sm font-extrabold text-white shadow-sticker transition hover:bg-pink-600 focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-pink-400/40">
      <Music size={18} />
      Add a sound
      <input
        className="sr-only"
        type="file"
        accept=".mp3,.wav,.ogg"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          onFile(file);
        }}
      />
    </label>
  );
}
