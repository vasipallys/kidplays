import { FormEvent, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  Blocks,
  Flag,
  HelpCircle,
  Keyboard,
  MousePointer2,
  PanelLeft,
  PanelRight,
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
import { CodeBuddyPanel } from '../editor/codeBuddy/CodeBuddyPanel';
import { ActivityLog } from '../editor/runtime/ActivityLog';
import {
  startGreenFlagRun,
  startKeyRun,
  startSpriteClickRun,
  stopAllScripts,
} from '../editor/runtime/interpreter';
import { Button } from '../components/ui/Button';
import { DockSection } from '../components/ui/DockSection';
import { IconButton } from '../components/ui/IconButton';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { HowToModal } from '../components/common/HowToModal';
import { EditorTour } from '../components/common/EditorTour';
import { Mascot } from '../components/common/Mascot';
import { useProjectStore } from '../store/projectStore';
import { useRuntimeStore } from '../store/runtimeStore';
import { useUiStore, type EditorTab } from '../store/uiStore';
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
  const { selectedBlockType, setSelectedBlockType, editorTab, setEditorTab, docks, setDock } = useUiStore();
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
    if (!hasSeenEditorTour()) {
      setTourOpen(true);
    }
  }, [projectId, setEditorTab]);

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
      setDock('stageDock', true);
    }
  };

  const runProject = () => {
    showStageOnPhone();
    startGreenFlagRun(currentProject);
  };
  const stopProject = () => stopAllScripts();
  const updateActiveSprite = (spriteId: string, patch: Partial<Sprite>) => updateSprite(spriteId, patch);

  const commitName = () => {
    const next = nameDraft.trim();
    setEditingName(false);
    if (next && next !== currentProject.name) {
      void renameProject(currentProject.id, next).catch(() => setNotice('Could not rename this project.'));
    }
  };

  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <header className="z-20 shrink-0 border-b-4 border-white bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:px-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <IconButton label="Back to my projects" icon={<ArrowLeft size={22} />} onClick={() => navigate('/')} />
          <div className="min-w-0 flex-1 basis-[160px]">
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
          <IconButton label="How to play" icon={<HelpCircle size={22} />} onClick={() => setHowToOpen(true)} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button tone="play" icon={<Flag size={20} />} onClick={runProject} disabled={status === 'running'} className="min-h-14 text-lg">
            Play
          </Button>
          <Button tone="stop" icon={<Square size={18} />} onClick={stopProject} disabled={status !== 'running'} className="min-h-14 text-lg">
            Stop
          </Button>
          {docks.toolsMenu ? (
            <>
              <Button
                tone="sun"
                icon={<RotateCcw size={18} />}
                onClick={() => {
                  if (status === 'running') {
                    stopProject();
                  }
                  resetRuntimeState();
                }}
                className="min-h-14"
              >
                Reset
              </Button>
              <Button
                tone="secondary"
                icon={<Save size={18} />}
                onClick={() => void saveCurrentProject().catch(() => setNotice('Could not save this project.'))}
                className="min-h-14"
              >
                Save
              </Button>
            </>
          ) : null}
          <DockToggle
            label={docks.toolsMenu ? 'Hide menu' : 'Menu'}
            pressed={docks.toolsMenu}
            onClick={() => setDock('toolsMenu', !docks.toolsMenu)}
          />
          <DockToggle
            label={docks.blocksMenu ? 'Hide blocks' : 'Blocks'}
            pressed={docks.blocksMenu}
            icon={<PanelLeft size={16} />}
            onClick={() => setDock('blocksMenu', !docks.blocksMenu)}
          />
          <DockToggle
            label={docks.stageDock ? 'Hide stage' : 'Stage'}
            pressed={docks.stageDock}
            icon={<PanelRight size={16} />}
            onClick={() => setDock('stageDock', !docks.stageDock)}
          />
        </div>
      </header>

      {notice ? (
        <div className="mx-3 mt-3 rounded-2xl bg-rose-50 px-4 py-3 font-bold text-rose-800" role="alert">
          {notice}
        </div>
      ) : null}

      <div
        className={`grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-2 sm:p-3 ${
          docks.stageDock ? 'xl:grid-cols-[minmax(560px,1fr)_400px]' : 'xl:grid-cols-1'
        }`}
      >
        <section
          className={`${
            editorTab === 'code' ? 'flex' : 'hidden xl:flex'
          } relative min-h-0 flex-col overflow-hidden rounded-3xl border-4 border-white bg-white shadow-soft`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="rounded-2xl bg-sky-100 p-2 text-sky-700">
                <Blocks size={18} />
              </span>
              <div>
                <h2 className="font-display text-lg text-slate-900">Code for {activeSprite.name}</h2>
                <p className="text-xs font-bold text-slate-500">
                  {docks.blocksMenu
                    ? 'Drag from the colored list, then snap blocks together.'
                    : 'Block menu is tucked away. Tap Blocks to open it.'}
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-3 text-xs font-extrabold text-slate-500 md:flex">
              <span className="inline-flex items-center gap-1">
                <MousePointer2 size={14} /> Click characters
              </span>
              <span className="inline-flex items-center gap-1">
                <Keyboard size={14} /> Try keys
              </span>
            </div>
          </div>
          {!docks.blocksMenu ? (
            <button
              type="button"
              onClick={() => setDock('blocksMenu', true)}
              className="absolute left-3 top-24 z-10 flex min-h-14 w-12 flex-col items-center justify-center gap-1 rounded-2xl bg-sky-600 px-1 py-3 text-xs font-black text-white shadow-md hover:bg-sky-700"
            >
              <PanelLeft size={16} />
              <span className="[writing-mode:vertical-rl]">Blocks</span>
            </button>
          ) : null}
          <div className="min-h-0 flex-1 p-2">
            <BlocklyWorkspace
              key={activeSprite.id}
              spriteId={activeSprite.id}
              blocksXml={activeSprite.blocksXml}
              showToolbox={docks.blocksMenu}
              onChange={(xml) => setSpriteBlocks(activeSprite.id, xml)}
              onSelectBlock={setSelectedBlockType}
            />
          </div>
        </section>

        {docks.stageDock ? (
          <aside
            className={`${
              editorTab === 'code' ? 'hidden' : 'block'
            } min-h-0 overflow-y-auto rounded-3xl border-4 border-white bg-white/80 p-3 shadow-soft xl:block`}
          >
            <div className={`${editorTab === 'stage' ? 'block' : 'hidden'} xl:block`}>
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg text-slate-800">The stage</h2>
                    <p className="text-xs font-bold text-slate-500">This is the movie screen. Click a character!</p>
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
              </section>
            </div>

            <div className={`${editorTab === 'stage' ? 'mt-4 block' : 'hidden'} xl:mt-4 xl:block`}>
              <DockSection title="Code Buddy" open={docks.buddy} onToggle={() => setDock('buddy', !docks.buddy)}>
                <CodeBuddyPanel project={currentProject} spriteId={activeSprite.id} selectedBlockType={selectedBlockType} />
              </DockSection>
            </div>

            <div className={`${editorTab === 'cast' ? 'mt-0 block space-y-4' : 'hidden'} xl:mt-4 xl:block xl:space-y-4`}>
              <DockSection title="Characters" open={docks.sprites} onToggle={() => setDock('sprites', !docks.sprites)}>
                <SpritePanel
                  project={currentProject}
                  activeSpriteId={activeSprite.id}
                  onSelectSprite={selectSprite}
                  onAddSprite={addSprite}
                  onUpdateSprite={updateActiveSprite}
                  onAskDelete={setSpriteToDelete}
                  onError={setNotice}
                />
              </DockSection>
              <DockSection title="What happened" open={docks.logs} onToggle={() => setDock('logs', !docks.logs)}>
                <ActivityLog lines={logs} />
              </DockSection>
            </div>
          </aside>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDock('stageDock', true);
              setEditorTab('stage');
            }}
            className="fixed bottom-20 right-3 z-30 flex min-h-14 items-center gap-2 rounded-2xl bg-indigo-600 px-4 text-sm font-black text-white shadow-lg hover:bg-indigo-700 xl:bottom-auto xl:top-1/2 xl:min-h-24 xl:flex-col xl:px-2"
          >
            <PanelRight size={18} />
            <span className="xl:[writing-mode:vertical-rl]">Stage</span>
          </button>
        )}
      </div>

      <nav className="grid shrink-0 grid-cols-3 gap-2 border-t-4 border-white bg-white/95 p-2 xl:hidden" aria-label="Editor sections">
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

function DockToggle({
  label,
  pressed,
  onClick,
  icon,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 px-3 text-sm font-black shadow-sm ${
        pressed ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300 bg-white text-slate-800 hover:border-sky-400'
      }`}
    >
      {icon}
      {label}
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
