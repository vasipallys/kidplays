import { useEffect, useMemo } from 'react';
import { ArrowLeft, Blocks, Flag, HardDrive, Keyboard, MousePointer2, RotateCcw, Save, Square } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlocklyWorkspace } from '../editor/blocks/BlocklyWorkspace';
import { StageCanvas } from '../editor/stage/StageCanvas';
import { SpritePanel } from '../editor/sprites/SpritePanel';
import { CodeBuddyPanel } from '../editor/codeBuddy/CodeBuddyPanel';
import {
  startGreenFlagRun,
  startKeyRun,
  startSpriteClickRun,
  stopAllScripts,
} from '../editor/runtime/interpreter';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { useProjectStore } from '../store/projectStore';
import { useRuntimeStore } from '../store/runtimeStore';
import { useUiStore } from '../store/uiStore';
import type { Sprite } from '../types/sprite';

export function EditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    currentProject,
    storageError,
    loadProject,
    saveCurrentProject,
    selectSprite,
    setSpriteBlocks,
    addSprite,
    deleteSprite,
    updateSprite,
    resetRuntimeState,
  } = useProjectStore();
  const { status, logs } = useRuntimeStore();
  const { selectedBlockType, setSelectedBlockType } = useUiStore();

  useEffect(() => {
    if (projectId) {
      void loadProject(projectId).then((project) => {
        if (!project) {
          navigate('/');
        }
      }).catch(() => {
        window.alert('Could not open this project from browser storage.');
        navigate('/');
      });
    }
  }, [projectId, loadProject, navigate]);

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
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white p-6 text-center shadow-soft" role="status">
          <p className="text-lg font-black text-slate-800">Loading project...</p>
        </div>
      </main>
    );
  }

  const runProject = () => startGreenFlagRun(currentProject);
  const stopProject = () => stopAllScripts();
  const updateActiveSprite = (spriteId: string, patch: Partial<Sprite>) => updateSprite(spriteId, patch);
  return (
    <main className="flex min-h-dvh flex-col bg-slate-100 xl:h-dvh xl:overflow-hidden">
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:gap-3 sm:px-4">
        <IconButton label="Back to dashboard" icon={<ArrowLeft size={20} />} onClick={() => navigate('/')} />
        <div className="min-w-0 flex-1 basis-[180px]">
          <h1 className="truncate text-lg font-black text-slate-950 sm:text-xl">{currentProject.name}</h1>
          <p className={`hidden items-center gap-1.5 text-xs font-bold sm:flex ${storageError ? 'text-rose-600' : 'text-slate-500'}`}>
            <HardDrive size={13} /> {storageError ?? 'Saved automatically on this device'}
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-4">
          <Button tone="success" icon={<Flag size={18} />} onClick={runProject} disabled={status === 'running'} className="px-3">
            Run
          </Button>
          <Button tone="danger" icon={<Square size={17} />} onClick={stopProject} disabled={status !== 'running'} className="px-3">
            Stop
          </Button>
          <Button
            tone="secondary"
            icon={<RotateCcw size={17} />}
            onClick={() => {
              if (status === 'running') {
                stopProject();
              }
              resetRuntimeState();
            }}
            className="px-3"
          >
            Reset
          </Button>
          <Button
            tone="secondary"
            icon={<Save size={17} />}
            onClick={() => void saveCurrentProject().catch(() => window.alert('Could not save this project.'))}
            className="px-3"
          >
            Save
          </Button>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-3 p-2 sm:p-3 xl:min-h-0 xl:grid-cols-[minmax(560px,1fr)_400px] xl:overflow-hidden">
        <section className="flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:min-h-[620px] xl:h-full xl:min-h-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-sky-100 p-2 text-sky-700"><Blocks size={18} /></span>
              <div>
                <h2 className="text-sm font-black text-slate-900">Code for {activeSprite.name}</h2>
                <p className="text-xs font-semibold text-slate-500">Choose a category, then drag blocks into place.</p>
              </div>
            </div>
            <div className="hidden items-center gap-3 text-xs font-bold text-slate-500 md:flex">
              <span className="inline-flex items-center gap-1"><MousePointer2 size={14} /> Click sprites</span>
              <span className="inline-flex items-center gap-1"><Keyboard size={14} /> Try event keys</span>
            </div>
          </div>
          <div className="min-h-0 flex-1 p-2">
            <BlocklyWorkspace
              key={activeSprite.id}
              spriteId={activeSprite.id}
              blocksXml={activeSprite.blocksXml}
              onChange={(xml) => setSpriteBlocks(activeSprite.id, xml)}
              onSelectBlock={setSelectedBlockType}
            />
          </div>
        </section>

        <aside className="min-h-0 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm xl:h-full">
          <div className="grid gap-4 md:grid-cols-2 xl:block xl:space-y-4">
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wide text-slate-600">Stage</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    status === 'running' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}
                  aria-live="polite"
                >
                  {status === 'running' ? 'Running' : 'Ready'}
                </span>
              </div>
              <StageCanvas
                project={currentProject}
                onSpriteClick={(spriteId) => startSpriteClickRun(currentProject, spriteId)}
              />
            </section>

            <SpritePanel
              project={currentProject}
              activeSpriteId={activeSprite.id}
              onSelectSprite={selectSprite}
              onAddSprite={addSprite}
              onDeleteSprite={deleteSprite}
              onUpdateSprite={updateActiveSprite}
            />

            <CodeBuddyPanel
              project={currentProject}
              spriteId={activeSprite.id}
              selectedBlockType={selectedBlockType}
            />

            <section className="rounded-2xl border border-slate-200 bg-white p-3">
              <h2 className="mb-2 text-sm font-black uppercase tracking-wide text-slate-600">Runtime logs</h2>
              <div className="max-h-44 space-y-1 overflow-y-auto rounded-xl bg-slate-950 p-3 font-mono text-xs text-emerald-200" role="log" aria-live="polite">
                {logs.length === 0 ? <p>No logs yet. Press Run to begin.</p> : logs.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(target.closest('input, textarea, select, button, [contenteditable="true"], .blocklyWidgetDiv'));
}
