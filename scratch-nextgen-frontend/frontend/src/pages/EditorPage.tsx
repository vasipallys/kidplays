import { FormEvent, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  Blocks,
  Flag,
  HelpCircle,
  ImagePlus,
  Music,
  RotateCcw,
  Save,
  Square,
  Star,
  Tv,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlocklyWorkspace } from '../editor/blocks/BlocklyWorkspace';
import { StageCanvas } from '../editor/stage/StageCanvas';
import { SpritePanel } from '../editor/sprites/SpritePanel';
import { CharacterDock } from '../editor/sprites/CharacterDock';
import { CodeBuddyPanel } from '../editor/codeBuddy/CodeBuddyPanel';
import { ActivityLog } from '../editor/runtime/ActivityLog';
import { AssetManager } from '../editor/assets/AssetManager';
import {
  startGreenFlagRun,
  startKeyRun,
  startSpriteClickRun,
  stopAllScripts,
} from '../editor/runtime/interpreter';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { HowToModal } from '../components/common/HowToModal';
import { EditorTour } from '../components/common/EditorTour';
import { Mascot } from '../components/common/Mascot';
import { useProjectStore } from '../store/projectStore';
import { useRuntimeStore } from '../store/runtimeStore';
import { useUiStore, type EditorTab, type WorkspacePane } from '../store/uiStore';
import { hasSeenEditorTour, markEditorTourSeen } from '../utils/kidPrefs';
import type { Sprite } from '../types/sprite';

export function EditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    currentProject,
    storageError,
    loadProject,
    saveCurrentProject,
    renameProject,
    selectSprite,
    setSpriteBlocks,
    addSprite,
    deleteSprite,
    updateSprite,
    resetRuntimeState,
  } = useProjectStore();
  const { status, logs } = useRuntimeStore();
  const { selectedBlockType, setSelectedBlockType, editorTab, setEditorTab, workspacePane, setWorkspacePane } =
    useUiStore();
  const [howToOpen, setHowToOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [spriteToDelete, setSpriteToDelete] = useState<Sprite | null>(null);
  const [notice, setNotice] = useState<string>();

  useEffect(() => {
    if (projectId) {
      void loadProject(projectId)
        .then((project) => {
          if (!project) {
            navigate('/');
          }
        })
        .catch(() => {
          setNotice('Could not open this project.');
          navigate('/');
        });
    }
  }, [projectId, loadProject, navigate]);

  useEffect(() => {
    setEditorTab('code');
    setWorkspacePane('code');
    if (!hasSeenEditorTour()) {
      setTourOpen(true);
    }
  }, [projectId, setEditorTab, setWorkspacePane]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentProject || event.defaultPrevented || event.repeat || isTypingTarget(event.target)) {
        return;
      }

      startKeyRun(currentProject, event.key === ' ' ? 'Space' : event.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProject]);

  useEffect(() => {
    return () => {
      if (useRuntimeStore.getState().status === 'running') {
        stopAllScripts();
      }
    };
  }, []);

  const activeSprite = useMemo(() => {
    return currentProject?.sprites.find((sprite) => sprite.id === currentProject.activeSpriteId) ?? currentProject?.sprites[0];
  }, [currentProject]);

  if (!currentProject || currentProject.id !== projectId || !activeSprite) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-3xl border-4 border-white bg-white px-8 py-8 text-center shadow-soft" role="status">
          <Mascot size={72} className="mx-auto animate-kid-float" />
          <p className="mt-3 font-display text-2xl text-slate-800">Opening your project…</p>
        </div>
      </main>
    );
  }

  const showStageOnPhone = () => {
    if (window.matchMedia('(max-width: 1279px)').matches) {
      setEditorTab('stage');
    }
  };

  const runProject = () => {
    showStageOnPhone();
    startGreenFlagRun(currentProject);
  };
  const stopProject = () => stopAllScripts();
  const updateActiveSprite = (spriteId: string, patch: Partial<Sprite>) => updateSprite(spriteId, patch);

  const openWorkspace = (pane: WorkspacePane) => {
    setWorkspacePane(pane);
    setEditorTab('code');
  };

  const commitName = () => {
    const next = nameDraft.trim();
    setEditingName(false);
    if (next && next !== currentProject.name) {
      void renameProject(currentProject.id, next).catch(() => setNotice('Could not rename this project.'));
    }
  };

  const playControls = (
    <>
      <Button tone="play" icon={<Flag size={20} />} onClick={runProject} disabled={status === 'running'} className="min-h-12 px-4 text-lg">
        Play
      </Button>
      <Button tone="stop" icon={<Square size={18} />} onClick={stopProject} disabled={status !== 'running'} className="min-h-12 px-4 text-lg">
        Stop
      </Button>
      <Button
        tone="sun"
        icon={<RotateCcw size={18} />}
        onClick={() => {
          if (status === 'running') {
            stopProject();
          }
          resetRuntimeState();
        }}
        className="min-h-12"
      >
        Reset
      </Button>
      <Button
        tone="secondary"
        icon={<Save size={18} />}
        onClick={() => void saveCurrentProject().catch(() => setNotice('Could not save this project.'))}
        className="min-h-12"
      >
        Save
      </Button>
    </>
  );

  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <header className="z-20 shrink-0 border-b-4 border-white bg-white/95 px-3 py-2 shadow-sm backdrop-blur sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <IconButton label="Back to my projects" icon={<ArrowLeft size={22} />} onClick={() => navigate('/')} />
          <div className="min-w-0 flex-1">
            {editingName ? (
              <form
                onSubmit={(event: FormEvent) => {
                  event.preventDefault();
                  commitName();
                }}
              >
                <input
                  value={nameDraft}
                  autoFocus
                  maxLength={40}
                  onChange={(event) => setNameDraft(event.target.value)}
                  onBlur={commitName}
                  className="h-11 w-full max-w-md rounded-2xl border-2 border-sky-300 px-3 font-display text-xl text-slate-950 outline-none"
                  aria-label="Project name"
                />
              </form>
            ) : (
              <button
                type="button"
                className="block max-w-full truncate text-left font-display text-xl text-slate-950 sm:text-2xl"
                onClick={() => {
                  setNameDraft(currentProject.name);
                  setEditingName(true);
                }}
                title="Tap to rename"
              >
                {currentProject.name}
              </button>
            )}
            <p className={`hidden text-xs font-extrabold sm:block ${storageError ? 'text-rose-600' : 'text-emerald-700'}`}>
              {storageError ?? 'Saved on this device'}
            </p>
          </div>
          <div className="hidden items-center gap-2 xl:flex">{playControls}</div>
          <IconButton label="How to play" icon={<HelpCircle size={22} />} onClick={() => setHowToOpen(true)} />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 xl:hidden">{playControls}</div>
      </header>

      {notice ? (
        <div className="mx-3 mt-2 rounded-2xl bg-rose-50 px-4 py-3 font-bold text-rose-800" role="alert">
          {notice}
        </div>
      ) : null}

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-2 sm:p-3 xl:grid-cols-[minmax(520px,1fr)_380px]">
        <section
          className={`${
            editorTab === 'code' ? 'flex' : 'hidden'
          } min-h-0 flex-col overflow-hidden rounded-3xl border-4 border-white bg-white shadow-soft xl:flex`}
        >
          <nav className="grid shrink-0 grid-cols-3 gap-1 border-b-4 border-sky-50 bg-sky-50/80 p-2" aria-label="Code looks and sounds">
            <WorkspaceTab
              pane="code"
              current={workspacePane}
              label="Code"
              hint="Blocks"
              icon={<Blocks size={18} />}
              onClick={openWorkspace}
            />
            <WorkspaceTab
              pane="looks"
              current={workspacePane}
              label="Looks"
              hint="Pictures"
              icon={<ImagePlus size={18} />}
              onClick={openWorkspace}
            />
            <WorkspaceTab
              pane="sounds"
              current={workspacePane}
              label="Sounds"
              hint="Music"
              icon={<Music size={18} />}
              onClick={openWorkspace}
            />
          </nav>

          <div className={`${workspacePane === 'code' ? 'flex' : 'hidden'} min-h-0 flex-1 flex-col`}>
            <div className="px-4 py-2">
              <h2 className="font-display text-lg text-slate-900">Code for {activeSprite.name}</h2>
              <p className="text-xs font-bold text-slate-500">The colored menu on the left is your block list. Drag one out, then snap it on.</p>
            </div>
            <div className="min-h-0 flex-1 p-2 pt-0">
              <BlocklyWorkspace
                key={activeSprite.id}
                spriteId={activeSprite.id}
                blocksXml={activeSprite.blocksXml}
                onChange={(xml) => setSpriteBlocks(activeSprite.id, xml)}
                onSelectBlock={setSelectedBlockType}
              />
            </div>
          </div>

          <div className={`${workspacePane === 'looks' ? 'block' : 'hidden'} min-h-0 flex-1 overflow-y-auto p-4`}>
            <h2 className="font-display text-xl text-slate-900">Looks for {activeSprite.name}</h2>
            <p className="mb-4 text-sm font-bold text-slate-500">Pick a picture. That is how this character looks on the stage.</p>
            <AssetManager
              sprite={activeSprite}
              onUpdate={(patch) => updateActiveSprite(activeSprite.id, patch)}
              onError={setNotice}
              showLooks
              showSounds={false}
            />
          </div>

          <div className={`${workspacePane === 'sounds' ? 'block' : 'hidden'} min-h-0 flex-1 overflow-y-auto p-4`}>
            <h2 className="font-display text-xl text-slate-900">Sounds for {activeSprite.name}</h2>
            <p className="mb-4 text-sm font-bold text-slate-500">Add a sound, then use a pink Play sound block in Code.</p>
            <AssetManager
              sprite={activeSprite}
              onUpdate={(patch) => updateActiveSprite(activeSprite.id, patch)}
              onError={setNotice}
              showLooks={false}
              showSounds
            />
          </div>
        </section>

        <aside
          className={`${
            editorTab === 'code' ? 'hidden' : 'flex'
          } min-h-0 flex-col overflow-hidden rounded-3xl border-4 border-white bg-white/90 shadow-soft xl:flex`}
        >
          <div className={`${editorTab === 'stage' ? 'flex' : 'hidden'} min-h-0 flex-1 flex-col xl:flex`}>
            <div className="shrink-0 p-3 pb-2">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg text-slate-800">The stage</h2>
                  <p className="text-xs font-bold text-slate-500">Always here. Click a character!</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                    status === 'running' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}
                  aria-live="polite"
                >
                  {status === 'running' ? 'Playing!' : 'Ready'}
                </span>
              </div>
              <div
                className={`rounded-[1.4rem] p-1 ${
                  status === 'running' ? 'bg-emerald-300 shadow-[0_0_0_4px_rgba(52,211,153,0.35)]' : 'bg-white'
                }`}
              >
                <StageCanvas
                  project={currentProject}
                  onSpriteClick={(spriteId) => startSpriteClickRun(currentProject, spriteId)}
                />
              </div>
            </div>

            <div className="hidden shrink-0 border-t border-slate-100 px-3 py-2 xl:block">
              <CharacterDock
                project={currentProject}
                activeSpriteId={activeSprite.id}
                onSelectSprite={selectSprite}
                onAddSprite={addSprite}
                onAskDelete={() => setSpriteToDelete(activeSprite)}
              />
            </div>

            <div className="hidden min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-3 xl:block">
              <CodeBuddyPanel
                project={currentProject}
                spriteId={activeSprite.id}
                selectedBlockType={selectedBlockType}
                compact
              />
              <ActivityLog lines={logs} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 xl:hidden">
              <div className="mt-2">
                <CodeBuddyPanel
                  project={currentProject}
                  spriteId={activeSprite.id}
                  selectedBlockType={selectedBlockType}
                  compact
                />
              </div>
            </div>
          </div>

          <div className={`${editorTab === 'cast' ? 'block' : 'hidden'} min-h-0 flex-1 overflow-y-auto p-3 xl:hidden`}>
            <SpritePanel
              project={currentProject}
              activeSpriteId={activeSprite.id}
              onSelectSprite={selectSprite}
              onAddSprite={addSprite}
              onUpdateSprite={updateActiveSprite}
              onAskDelete={setSpriteToDelete}
            />
          </div>
        </aside>
      </div>

      <nav
        className="grid shrink-0 grid-cols-3 gap-2 border-t-4 border-white bg-white/95 p-2 xl:hidden"
        aria-label="Editor sections"
      >
        <TabButton tab="code" current={editorTab} label="Code" icon={<Blocks size={18} />} onClick={setEditorTab} />
        <TabButton tab="stage" current={editorTab} label="Stage" icon={<Tv size={18} />} onClick={setEditorTab} />
        <TabButton tab="cast" current={editorTab} label="Characters" icon={<Star size={18} />} onClick={setEditorTab} />
      </nav>

      <HowToModal open={howToOpen} onClose={() => setHowToOpen(false)} />
      <EditorTour
        open={tourOpen}
        onClose={() => {
          markEditorTourSeen();
          setTourOpen(false);
        }}
      />
      <ConfirmDialog
        open={Boolean(spriteToDelete)}
        title={`Remove ${spriteToDelete?.name ?? 'this character'}?`}
        body="This character and its blocks will be gone. You can always add a new friend later."
        confirmLabel="Remove"
        cancelLabel="Keep them"
        danger
        onCancel={() => setSpriteToDelete(null)}
        onConfirm={() => {
          if (spriteToDelete) {
            deleteSprite(spriteToDelete.id);
          }
          setSpriteToDelete(null);
        }}
      />
    </main>
  );
}

function WorkspaceTab({
  pane,
  current,
  label,
  hint,
  icon,
  onClick,
}: {
  pane: WorkspacePane;
  current: WorkspacePane;
  label: string;
  hint: string;
  icon: ReactNode;
  onClick: (pane: WorkspacePane) => void;
}) {
  const active = current === pane;
  return (
    <button
      type="button"
      onClick={() => onClick(pane)}
      aria-current={active ? 'page' : undefined}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 px-2 text-sm font-extrabold transition ${
        active
          ? 'border-white bg-white text-sky-700 shadow-sticker'
          : 'border-transparent bg-white/70 text-slate-600 hover:border-white hover:bg-white'
      }`}
    >
      {icon}
      <span className="text-left leading-tight">
        <span className="block">{label}</span>
        <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">{hint}</span>
      </span>
    </button>
  );
}

function TabButton({
  tab,
  current,
  label,
  icon,
  onClick,
}: {
  tab: EditorTab;
  current: EditorTab;
  label: string;
  icon: ReactNode;
  onClick: (tab: EditorTab) => void;
}) {
  const active = current === tab;
  return (
    <button
      type="button"
      onClick={() => onClick(tab)}
      aria-current={active ? 'page' : undefined}
      className={`flex min-h-14 flex-col items-center justify-center rounded-2xl text-xs font-extrabold ${
        active ? 'bg-sky-500 text-white shadow-sticker' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(target.closest('input, textarea, select, button, [contenteditable="true"], .blocklyWidgetDiv'));
}
