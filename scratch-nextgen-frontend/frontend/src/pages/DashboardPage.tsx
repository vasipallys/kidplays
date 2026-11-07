import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Atom,
  BookOpen,
  Brain,
  Calculator,
  CircleDot,
  Copy,
  Download,
  Eye,
  FilePlus2,
  FlaskConical,
  FolderOpen,
  Globe2,
  HelpCircle,
  Keyboard,
  Leaf,
  Music2,
  Pencil,
  Play,
  Rocket,
  Search,
  SearchX,
  Trash2,
  Upload,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { NameDialog } from '../components/ui/NameDialog';
import { EmptyState } from '../components/common/EmptyState';
import { HowToModal } from '../components/common/HowToModal';
import { Mascot } from '../components/common/Mascot';
import { useProjectStore } from '../store/projectStore';
import { downloadProjectJson, readProjectFile } from '../storage/importExport';
import { formatFriendlyDate } from '../utils/time';
import { funProjectNames, hasSeenWelcome, markWelcomeSeen } from '../utils/kidPrefs';
import { gradeBands, lessonsFor, subjects, type BandId, type SubjectId } from '../learn/catalog';
import { sampleProjectTemplates, type SampleProjectId } from '../templates/sampleProjects';
import type { Project } from '../types/project';

type PendingDelete = { id: string; name: string };

export function DashboardPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState<SubjectId | 'all'>('all');
  const [band, setBand] = useState<BandId>('3-5');
  const [banner, setBanner] = useState<string>();
  const [howToOpen, setHowToOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PendingDelete | null>(null);
  const {
    projects,
    hasHydrated,
    storageError,
    hydrateProjects,
    createProject,
    createSampleProject,
    createLesson,
    duplicateProject,
    deleteProject,
    renameProject,
    importProject,
  } = useProjectStore();

  useEffect(() => {
    if (!hasHydrated) {
      void hydrateProjects();
    }
  }, [hasHydrated, hydrateProjects]);

  useEffect(() => {
    if (!hasSeenWelcome()) {
      setHowToOpen(true);
    }
  }, []);

  const visibleProjects = useMemo(() => {
    const lower = query.toLowerCase().trim();
    return projects.filter((project) => project.name.toLowerCase().includes(lower));
  }, [projects, query]);
  const hasSearchQuery = query.trim().length > 0;

  const openCreated = (project: Project) => {
    navigate(`/editor/${project.id}`);
  };

  const createAndOpen = async (name?: string) => {
    try {
      const project = await createProject(name);
      openCreated(project);
    } catch {
      setBanner('Could not create a project. Check that this browser can save files.');
    }
  };

  const practiceLessons = useMemo(() => lessonsFor(subject, band), [subject, band]);

  const createLessonAndOpen = async (lessonId: string) => {
    try {
      const project = await createLesson(lessonId);
      openCreated(project);
    } catch {
      setBanner('Could not open this practice lab. Check that this browser can save files.');
    }
  };

  const createSampleAndOpen = async (templateId: SampleProjectId) => {
    try {
      const project = await createSampleProject(templateId);
      openCreated(project);
    } catch {
      setBanner('Could not open this sample. Check that this browser can save files.');
    }
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    try {
      const project = await readProjectFile(file);
      await importProject(project);
      navigate(`/editor/${project.id}`);
    } catch (error) {
      setBanner(error instanceof Error ? error.message : 'Could not open that project file.');
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="overflow-hidden rounded-[2rem] border-4 border-white bg-white/80 p-5 shadow-soft sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Mascot size={96} mood="cheer" className="hidden shrink-0 animate-kid-float sm:block" />
              <div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-extrabold text-amber-800">
                  For kids 6–18 · stays on this device
                </p>
                <h1 className="font-display text-4xl tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                  Let's make something cool
                </h1>
                <p className="mt-3 max-w-2xl text-lg font-bold leading-relaxed text-slate-600">
                  Snap blocks and press Play. Make a story, or practise maths, science, English, and logic for your class.
                </p>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto">
              <Button tone="play" icon={<FilePlus2 size={20} />} onClick={() => setCreateOpen(true)} className="w-full">
                New project
              </Button>
              <Button
                tone="secondary"
                icon={<Upload size={20} />}
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                Open a file
              </Button>
              <Button
                tone="sun"
                icon={<HelpCircle size={20} />}
                onClick={() => setHowToOpen(true)}
                className="w-full sm:col-span-2"
              >
                How does this work?
              </Button>
              <input ref={fileInputRef} type="file" accept=".json" className="sr-only" onChange={handleImport} />
            </div>
          </div>

          <ol className="mt-6 grid gap-3 sm:grid-cols-3">
            <HowStep n={1} title="Pick a sample" body="Start with a ready-made project. You can change everything." />
            <HowStep n={2} title="Snap blocks" body="Yellow starts. Blue moves. Purple talks. Orange repeats." />
            <HowStep n={3} title="Press Play" body="Watch the stage. Change a number, then try again." />
          </ol>
        </header>

        {storageError || banner ? (
          <div className="mt-6 rounded-3xl border-2 border-rose-200 bg-rose-50 px-4 py-3 font-bold text-rose-800" role="alert">
            {banner ?? storageError}
          </div>
        ) : null}

        <section className="mt-8" aria-labelledby="practice-heading">
          <div className="mb-4">
            <p className="text-sm font-extrabold uppercase tracking-wider text-violet-700">Practice lab</p>
            <h2 id="practice-heading" className="font-display text-3xl text-slate-950">Learn by pressing Play</h2>
            <p className="mt-1 max-w-3xl text-sm font-bold text-slate-600">
              Pick your class, then a subject. The coach talks through one true problem and shows it on the stage. Change a number and run it again. This is practice, not a school exam.
            </p>
          </div>
          <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Class">
            {gradeBands.map((item) => (
              <FilterChip key={item.id} pressed={band === item.id} onClick={() => setBand(item.id)} label={item.label} />
            ))}
          </div>
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Subject">
            <FilterChip pressed={subject === 'all'} onClick={() => setSubject('all')} label="All subjects" />
            {subjects.map((item) => (
              <FilterChip key={item.id} pressed={subject === item.id} onClick={() => setSubject(item.id)} label={item.label} />
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {practiceLessons.map((lesson, index) => (
              <LessonCard key={lesson.id} lesson={lesson} index={index} onClick={() => void createLessonAndOpen(lesson.id)} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wider text-sky-700">Try a sample</p>
              <h2 className="font-display text-3xl text-slate-950">Ready-to-play projects</h2>
            </div>
            <p className="text-sm font-bold text-slate-500">Tap one. Then press the green Play button.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sampleProjectTemplates.map((template, index) => (
              <SampleCard
                key={template.id}
                template={template}
                index={index}
                onClick={() => void createSampleAndOpen(template.id)}
              />
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="projects-heading">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wider text-sky-700">Your creations</p>
              <h2 id="projects-heading" className="font-display text-3xl tracking-tight text-slate-950">
                My projects
              </h2>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <span className="sr-only">Search projects by name</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find a project"
                className="h-12 w-full rounded-2xl border-2 border-white bg-white pl-12 pr-4 text-base font-bold text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400"
              />
            </label>
          </div>

          {!hasHydrated ? (
            <LoadingProjects />
          ) : visibleProjects.length === 0 ? (
            <EmptyState
              icon={hasSearchQuery ? <SearchX size={34} /> : <FolderOpen size={34} />}
              title={hasSearchQuery ? 'No matching projects' : 'Your first project is waiting'}
              body={
                hasSearchQuery
                  ? `Nothing matches “${query.trim()}”. Try another name, or clear the search.`
                  : 'Start with a blank page, pick a sample above, or open a project file you saved earlier.'
              }
              action={
                <Button
                  tone={hasSearchQuery ? 'secondary' : 'play'}
                  icon={hasSearchQuery ? <SearchX size={18} /> : <FilePlus2 size={18} />}
                  onClick={() => (hasSearchQuery ? setQuery('') : setCreateOpen(true))}
                >
                  {hasSearchQuery ? 'Clear search' : 'Create first project'}
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onOpen={() => navigate(`/editor/${project.id}`)}
                  onDuplicate={async () => {
                    try {
                      const copy = await duplicateProject(project.id);
                      if (copy) {
                        navigate(`/editor/${copy.id}`);
                      }
                    } catch {
                      setBanner('Could not make a copy of this project.');
                    }
                  }}
                  onDelete={() => setDeleteTarget({ id: project.id, name: project.name })}
                  onRename={() => setRenameTarget(project)}
                  onExport={() => downloadProjectJson(project)}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-12 rounded-3xl bg-white/70 px-5 py-4 text-center text-sm font-bold text-slate-500">
          No account. No internet needed after this page loads. Grown-ups: projects are saved in this browser only.
        </footer>
      </div>

      <HowToModal
        open={howToOpen}
        onClose={() => {
          markWelcomeSeen();
          setHowToOpen(false);
        }}
      />
      <NameDialog
        open={createOpen}
        title="Name your project"
        label="What should we call it?"
        initialValue="Untitled Adventure"
        confirmLabel="Start creating"
        suggestions={funProjectNames}
        onCancel={() => setCreateOpen(false)}
        onSubmit={(name) => {
          setCreateOpen(false);
          void createAndOpen(name);
        }}
      />
      <NameDialog
        open={Boolean(renameTarget)}
        title="Rename project"
        label="New name"
        initialValue={renameTarget?.name ?? ''}
        confirmLabel="Save name"
        onCancel={() => setRenameTarget(null)}
        onSubmit={(name) => {
          const id = renameTarget?.id;
          setRenameTarget(null);
          if (id) {
            void renameProject(id, name).catch(() => setBanner('Could not rename this project.'));
          }
        }}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${deleteTarget?.name ?? 'this project'}?`}
        body="This cannot be undone. If you might want it later, download a copy first."
        confirmLabel="Delete"
        cancelLabel="Keep it"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          const id = deleteTarget?.id;
          setDeleteTarget(null);
          if (id) {
            void deleteProject(id).catch(() => setBanner('Could not delete this project.'));
          }
        }}
      />
    </main>
  );
}

function FilterChip({ pressed, onClick, label }: { pressed: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-11 rounded-full px-4 text-sm font-extrabold ${
        pressed ? 'bg-violet-600 text-white' : 'bg-white text-slate-700 shadow-sm hover:bg-violet-50'
      }`}
    >
      {label}
    </button>
  );
}

const subjectIcons: Record<SubjectId, LucideIcon> = {
  maths: Calculator,
  physics: Atom,
  chemistry: FlaskConical,
  biology: Leaf,
  english: BookOpen,
  earth: Globe2,
  logic: Brain,
};

function LessonCard({
  lesson,
  index,
  onClick,
}: {
  lesson: ReturnType<typeof lessonsFor>[number];
  index: number;
  onClick: () => void;
}) {
  const Icon = subjectIcons[lesson.subject];
  const subjectName = subjects.find((item) => item.id === lesson.subject)?.label ?? lesson.subject;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="rounded-[1.6rem] border-4 border-white bg-white p-4 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-xl"
    >
      <span className="flex items-center gap-3">
        <span className="rounded-2xl p-3 text-white" style={{ backgroundColor: lesson.color }}>
          <Icon size={22} />
        </span>
        <span>
          <span className="block text-xs font-extrabold uppercase tracking-wide text-slate-500">{subjectName}</span>
          <span className="block font-display text-xl text-slate-900">{lesson.title}</span>
        </span>
      </span>
      <span className="mt-3 block text-sm font-semibold leading-snug text-slate-600">{lesson.ask}</span>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-extrabold text-violet-700">
        <Play size={14} /> Practise
      </span>
    </motion.button>
  );
}

function HowStep({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="rounded-2xl bg-sky-50 px-4 py-3">
      <p className="text-sm font-extrabold text-sky-700">Step {n}</p>
      <p className="font-display text-lg text-slate-900">{title}</p>
      <p className="text-sm font-semibold text-slate-600">{body}</p>
    </li>
  );
}

type ProjectCardProps = {
  project: Project;
  index: number;
  onOpen: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onRename: () => void;
  onExport: () => void;
};

function ProjectCard({
  project,
  index,
  onOpen,
  onDuplicate,
  onDelete,
  onRename,
  onExport,
}: ProjectCardProps) {
  const sprite = project.sprites[0];
  const costume = sprite?.costumes.find((item) => item.id === sprite.currentCostumeId) ?? sprite?.costumes[0];
  const characterLabel = project.sprites.length === 1 ? '1 character' : `${project.sprites.length} characters`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04 }}
      className="group overflow-hidden rounded-[1.75rem] border-4 border-white bg-white shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <button type="button" onClick={onOpen} className="block w-full text-left" aria-label={`Open ${project.name}`}>
        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-sky-200 via-white to-pink-100 sm:h-48">
          {costume ? (
            <img
              src={costume.dataUrl}
              alt=""
              className="h-28 w-28 object-contain drop-shadow-lg transition duration-200 group-hover:scale-105 sm:h-32 sm:w-32"
            />
          ) : null}
        </div>
      </button>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-display text-2xl text-slate-900">{project.name}</h2>
            <p className="mt-0.5 text-sm font-bold text-slate-500">Edited {formatFriendlyDate(project.updatedAt)}</p>
          </div>
          <Button tone="play" icon={<Play size={16} />} onClick={onOpen} className="px-3">
            Open
          </Button>
        </div>
        <div className="mt-4 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-extrabold text-slate-600">
          {characterLabel}
        </div>
        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
          <IconButton label="Rename" icon={<Pencil size={18} />} onClick={onRename} />
          <IconButton label="Make a copy" icon={<Copy size={18} />} onClick={onDuplicate} />
          <IconButton label="Download a copy" icon={<Download size={18} />} onClick={onExport} />
          <IconButton label="Delete" icon={<Trash2 size={18} />} onClick={onDelete} className="text-rose-600" />
        </div>
      </div>
    </motion.article>
  );
}

type SampleCardProps = {
  template: (typeof sampleProjectTemplates)[number];
  index: number;
  onClick: () => void;
};

const sampleVisuals: Record<SampleProjectId, { icon: LucideIcon; className: string; stage: string }> = {
  'dance-party': { icon: Music2, className: 'bg-pink-100 text-pink-700', stage: 'from-pink-200 to-amber-100' },
  'space-chase': { icon: Rocket, className: 'bg-indigo-100 text-indigo-700', stage: 'from-indigo-200 to-sky-100' },
  'tiny-story': { icon: BookOpen, className: 'bg-amber-100 text-amber-700', stage: 'from-amber-200 to-orange-100' },
  'bounce-lab': { icon: CircleDot, className: 'bg-cyan-100 text-cyan-700', stage: 'from-cyan-200 to-emerald-100' },
  'hide-and-seek': { icon: Eye, className: 'bg-emerald-100 text-emerald-700', stage: 'from-emerald-200 to-lime-100' },
  'keyboard-quest': { icon: Keyboard, className: 'bg-sky-100 text-sky-700', stage: 'from-sky-200 to-violet-100' },
};

const levelStyles: Record<string, string> = {
  Easy: 'bg-emerald-100 text-emerald-800',
  Fun: 'bg-amber-100 text-amber-800',
  Challenge: 'bg-violet-100 text-violet-800',
};

function SampleCard({ template, index, onClick }: SampleCardProps) {
  const visual = sampleVisuals[template.id];
  const Icon = visual.icon;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group overflow-hidden rounded-[1.6rem] border-4 border-white bg-white text-left shadow-soft transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${visual.stage}`}>
        <span className={`rounded-2xl p-3 shadow-sm transition group-hover:scale-110 ${visual.className}`}>
          <Icon size={28} />
        </span>
      </div>
      <span className="block p-4">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-display text-xl text-slate-900">{template.name}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${levelStyles[template.level]}`}>
            {template.level} · {template.ages}
          </span>
        </span>
        <span className="mt-1 block text-sm font-semibold leading-snug text-slate-600">{template.description}</span>
        <span className="mt-2 inline-flex items-center gap-1 text-sm font-extrabold text-sky-700">
          <Play size={14} /> Play this
        </span>
      </span>
    </motion.button>
  );
}

function LoadingProjects() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading projects">
      {[0, 1, 2].map((item) => (
        <div key={item} className="animate-pulse overflow-hidden rounded-[1.75rem] bg-white shadow-sm">
          <div className="h-44 bg-slate-200" />
          <div className="space-y-3 p-5">
            <div className="h-6 w-2/3 rounded bg-slate-200" />
            <div className="h-4 w-1/3 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
