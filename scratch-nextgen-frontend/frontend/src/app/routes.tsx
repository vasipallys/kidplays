import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { Mascot } from '../components/common/Mascot';

const EditorPage = lazy(() =>
  import('../pages/EditorPage').then((module) => ({ default: module.EditorPage })),
);

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route
        path="/editor/:projectId"
        element={
          <Suspense fallback={<EditorLoading />}>
            <EditorPage />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function EditorLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6" role="status">
      <div className="rounded-3xl border-4 border-white bg-white px-8 py-8 text-center shadow-soft">
        <Mascot size={72} className="mx-auto animate-kid-float" />
        <p className="mt-3 font-display text-2xl text-slate-800">Opening your project…</p>
      </div>
    </main>
  );
}
