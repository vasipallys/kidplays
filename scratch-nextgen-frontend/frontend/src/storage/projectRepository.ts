import { db } from './indexedDb';
import type { Project } from '../types/project';

let mutationQueue: Promise<void> = Promise.resolve();

export async function listProjects(): Promise<Project[]> {
  await mutationQueue.catch(() => undefined);
  return db.projects.orderBy('updatedAt').reverse().toArray();
}

export async function getProject(id: string): Promise<Project | undefined> {
  await mutationQueue.catch(() => undefined);
  return db.projects.get(id);
}

export async function saveProject(project: Project): Promise<void> {
  return enqueueMutation(async () => {
    await db.projects.put(project);
  });
}

export async function deleteProject(id: string): Promise<void> {
  return enqueueMutation(async () => {
    await db.projects.delete(id);
  });
}

export async function clearProjects(): Promise<void> {
  return enqueueMutation(async () => {
    await db.projects.clear();
  });
}

function enqueueMutation(operation: () => Promise<void>): Promise<void> {
  const next = mutationQueue.catch(() => undefined).then(operation);
  mutationQueue = next;
  return next;
}
