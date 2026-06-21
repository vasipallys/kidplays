import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CircleDot,
  Copy,
  Download,
  Eye,
  FilePlus2,
  FolderOpen,
  Import,
  Keyboard,
  Music2,
  Pencil,
  Play,
  Rocket,
  Search,
  SearchX,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { EmptyState } from '../components/common/EmptyState';
import { useProjectStore } from '../store/projectStore';
import { downloadProjectJson, readProjectFile } from '../storage/importExport';
import { formatFriendlyDate } from '../utils/time';
import { sampleProjectTemplates, type SampleProjectId } from '../templates/sampleProjects';
import type { Project } from '../types/project';

export function DashboardPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const {
    projects,
    hasHydrated,
    storageError,
    hydrateProjects,
    createProject,
    createSampleProject,
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

  const visibleProjects = useMemo(() => {
    const lower = query.toLowerCase().trim();
    return projects.filter((project) => project.name.toLowerCase().includes(lower));
  }, [projects, query]);
  const hasSearchQuery = query.trim().length > 0;

  const createAndOpen = async (name?: string) => {
    try {
      const project = await createProject(name);
      navigate(`/editor/${project.id}`);
    } catch {
      window.alert('Could not create a project. Check that browser storage is available.');
    }
  };

  const createSampleAndOpen = async (templateId: SampleProjectId) => {
    try {
      const project = await createSampleProject(templateId);
      navigate(`/editor/${project.id}`);
    } catch {
      window.alert('Could not create this sample. Check that browser storage is available.');
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
      window.alert(error instanceof Error ? error.message : 'Could not import this project.');
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#DDF4FF_0,#F8FAFC_42%,#FCE7F3_100%)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white bg-white/90 px-4 py-2 text-sm font-black text-sky-700 shadow-sm backdrop-blur">
              <Sparkles size={17} />
              Local-first kid coding
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl">Scratch NextGen</h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-relaxed text-slate-600 sm:text-lg">
              Build animations, games, and stories with colorful blocks. Your work stays safely on this device.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:flex md:flex-wrap">
            <Button tone="success" icon={<FilePlus2 size={18} />} onClick={() => void createAndOpen()} className="w-full md:w-auto">
              New project
            </Button>
            <Button tone="secondary" icon={<Import size={18} />} onClick={() => fileInputRef.current?.click()} className="w-full md:w-auto">
              Import JSON
            </Button>
            <input ref={fileInputRef} type="file" accept=".json" className="sr-only" onChange={handleImport} />
          </div>
        </header>

        {storageError ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 font-semibold text-rose-800" role="alert">
            {storageError}
          </div>
        ) : null}

        <section className="mt-10 rounded-3xl border border-white/80 bg-white/60 p-3 shadow-sm backdrop-blur sm:p-4">
          <label className="relative block">
            <span className="sr-only">Search projects by name</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your projects"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-base font-semibold text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400"
            />
          </label>

          <div className="mt-4 border-t border-white pt-4">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-slate-900">Start with a real sample</h2>
                <p className="text-sm font-semibold text-slate-500">Each one teaches a different block-coding idea.</p>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-sky-700">6 ready-to-run projects</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {sampleProjectTemplates.map((template) => (
                <SampleButton
                  key={template.id}
                  template={template}
                  onClick={() => void createSampleAndOpen(template.id)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="projects-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">Your creations</p>
              <h2 id="projects-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                My projects
              </h2>
            </div>
            {hasHydrated && projects.length > 0 ? (
              <p className="shrink-0 text-sm font-bold text-slate-500">
                {visibleProjects.length} {visibleProjects.length === 1 ? 'project' : 'projects'}
              </p>
            ) : null}
          </div>

          {!hasHydrated ? (
            <LoadingProjects />
          ) : visibleProjects.length === 0 ? (
            <EmptyState
              icon={hasSearchQuery ? <SearchX size={30} /> : <FolderOpen size={30} />}
              title={hasSearchQuery ? 'No matching projects' : 'Make your first project'}
              body={
                hasSearchQuery
                  ? `Nothing matches "${query.trim()}". Try another name or clear the search.`
                  : 'Start with a blank canvas, or import a project you made earlier.'
              }
              action={
                <Button
                  tone={hasSearchQuery ? 'secondary' : 'success'}
                  icon={hasSearchQuery ? <SearchX size={18} /> : <FilePlus2 size={18} />}
                  onClick={() => (hasSearchQuery ? setQuery('') : void createAndOpen())}
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
                      window.alert('Could not duplicate this project.');
                    }
                  }}
                  onDelete={() => {
                    if (window.confirm(`Delete "${project.name}"?`)) {
                      void deleteProject(project.id).catch(() => window.alert('Could not delete this project.'));
                    }
                  }}
                  onRename={() => {
                    const name = window.prompt('Project name', project.name);
                    if (name) {
                      void renameProject(project.id, name).catch(() => window.alert('Could not rename this project.'));
                    }
                  }}
                  onExport={() => downloadProjectJson(project)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04 }}
      className="group overflow-hidden rounded-3xl border border-white/90 bg-white shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-xl"
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
            <h2 className="truncate text-xl font-black text-slate-900">{project.name}</h2>
            <p className="mt-0.5 text-sm font-semibold text-slate-500">Edited {formatFriendlyDate(project.updatedAt)}</p>
          </div>
          <Button tone="success" icon={<Play size={16} />} onClick={onOpen} className="px-3">
            Open
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-semibold text-slate-600">
          <div className="rounded-xl bg-slate-100 px-3 py-2">
            {project.sprites.length} {project.sprites.length === 1 ? 'sprite' : 'sprites'}
          </div>
          <div className="rounded-xl bg-slate-100 px-3 py-2">Version {project.version}</div>
        </div>
        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
          <IconButton label="Rename" icon={<Pencil size={17} />} onClick={onRename} />
          <IconButton label="Duplicate" icon={<Copy size={17} />} onClick={onDuplicate} />
          <IconButton label="Export JSON" icon={<Download size={17} />} onClick={onExport} />
          <IconButton label="Delete" icon={<Trash2 size={17} />} onClick={onDelete} className="text-rose-600" />
        </div>
      </div>
    </motion.article>
  );
}

type SampleButtonProps = {
  template: (typeof sampleProjectTemplates)[number];
  onClick: () => void;
};

const sampleVisuals: Record<SampleProjectId, { icon: LucideIcon; className: string }> = {
  'dance-party': { icon: Music2, className: 'bg-pink-100 text-pink-700' },
  'space-chase': { icon: Rocket, className: 'bg-indigo-100 text-indigo-700' },
  'tiny-story': { icon: BookOpen, className: 'bg-amber-100 text-amber-700' },
  'bounce-lab': { icon: CircleDot, className: 'bg-cyan-100 text-cyan-700' },
  'hide-and-seek': { icon: Eye, className: 'bg-emerald-100 text-emerald-700' },
  'keyboard-quest': { icon: Keyboard, className: 'bg-sky-100 text-sky-700' },
};

function SampleButton({ template, onClick }: SampleButtonProps) {
  const visual = sampleVisuals[template.id];
  const Icon = visual.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-24 items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
    >
      <span className={`rounded-xl p-2 transition group-hover:scale-105 ${visual.className}`}>
        <Icon size={19} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-black text-slate-900">{template.name}</span>
        <span className="mt-1 block text-xs font-semibold leading-snug text-slate-500">{template.description}</span>
      </span>
    </button>
  );
}

function LoadingProjects() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading projects">
      {[0, 1, 2].map((item) => (
        <div key={item} className="animate-pulse overflow-hidden rounded-3xl bg-white shadow-sm">
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
