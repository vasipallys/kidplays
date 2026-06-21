import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';

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
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6" role="status">
      <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-soft">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
        <p className="mt-3 font-black text-slate-800">Opening your project...</p>
      </div>
    </main>
  );
}
