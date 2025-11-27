import React, { useState } from 'react';
import { LogOut, Plus, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnalysisPage } from './AnalysisPage';
import { HistoryPage } from './HistoryPage';

type PageType = 'analysis' | 'history';

export function DashboardPage() {
  const [currentPage, setCurrentPage] = useState<PageType>('analysis');
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const userInitial = user?.email?.[0]?.toUpperCase() || 'P';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-50 text-slate-900">

      {/* NAVBAR — More breathing space + soft neon */}
      <nav className="sticky top-0 z-40 border-b border-emerald-100 bg-white/90 backdrop-blur-md shadow-lg shadow-emerald-100/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-5">
          <div className="flex items-center justify-between gap-10">

            {/* BRAND */}
            <div className="flex items-center gap-5">
              <img
                src="/src/assets/plant-grass-svgrepo-com.svg"
                alt="PlantGuard Logo"
                className="w-12 h-12 object-contain rounded-2xl bg-white/80 p-1 shadow-lg shadow-emerald-300/60 ring-2 ring-emerald-300/40"
              />

              <div className="leading-tight">
                <h1 className="text-2xl font-semibold tracking-tight text-emerald-900 drop-shadow-[0_0_6px_rgba(16,185,129,0.25)]">
                  PlantGuard <span className="text-emerald-600">AI</span>
                </h1>
              </div>
            </div>

            {/* USER */}
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-slate-800">
                  {user?.email}
                </span>
              </div>

              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                <span className="text-base font-semibold text-emerald-800">
                  {userInitial}
                </span>
              </div>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 hover:border-red-300 transition-colors shadow-sm hover:shadow-[0_0_12px_rgba(248,113,113,0.35)]"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* PAGE LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px,minmax(0,1fr)] gap-10">

          {/* LEFT SIDEBAR */}
          <aside className="lg:sticky lg:top-[6rem] h-max space-y-6">

            {/* DASHBOARD SECTION */}
            <div className="rounded-3xl border border-emerald-200/70 bg-white/95 shadow-lg shadow-emerald-200/50 ring-1 ring-emerald-200/40 backdrop-blur-xl p-6 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-600 drop-shadow-[0_0_4px_rgba(16,185,129,0.25)]">
                  Dashboard
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Manage your plant analyses and review diagnosis history.
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                {/* New Analysis Button */}
                <button
                  onClick={() => setCurrentPage('analysis')}
                  className={`w-full inline-flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium border transition-all ${
                    currentPage === 'analysis'
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_20px_rgba(16,185,129,0.55)]'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200/70 hover:bg-emerald-100 hover:shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Plus
                      className={`w-4 h-4 ${
                        currentPage === 'analysis'
                          ? 'text-white'
                          : 'text-emerald-600'
                      }`}
                    />
                    New Analysis
                  </span>
                </button>

                {/* History Button */}
                <button
                  onClick={() => setCurrentPage('history')}
                  className={`w-full inline-flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium border transition-all ${
                    currentPage === 'history'
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_20px_rgba(16,185,129,0.55)]'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200/70 hover:bg-emerald-100 hover:shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <History
                      className={`w-4 h-4 ${
                        currentPage === 'history'
                          ? 'text-white'
                          : 'text-emerald-600'
                      }`}
                    />
                    History
                  </span>
                </button>
              </div>
            </div>

            {/* QUICK GUIDE CARD */}
            <div className="rounded-3xl border border-emerald-200/70 bg-white/95 shadow-lg shadow-emerald-200/50 ring-1 ring-emerald-200/40 backdrop-blur-xl p-6 space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-600/90 font-semibold drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                Quick Guide
              </p>

              <ol className="text-sm text-emerald-900 space-y-2 leading-relaxed">
                <li>
                  <span className="font-semibold">1.</span> Start a fresh scan in{' '}
                  <span className="font-medium">New Analysis</span>.
                </li>
                <li>
                  <span className="font-semibold">2.</span> Upload a clear whole-plant image.
                </li>
                <li>
                  <span className="font-semibold">3.</span> Select the correct plant species
                  to improve prediction accuracy.
                </li>
                <li>
                  <span className="font-semibold">4.</span> Review detected diseases and
                  recommended treatments generated by the model.
                </li>
                <li>
                  <span className="font-semibold">5.</span> Visit{' '}
                  <span className="font-medium">History</span> to compare scans and track
                  plant health over time.
                </li>
              </ol>
            </div>

          </aside>

          {/* MAIN CONTENT */}
          <main>
            <div className="rounded-3xl border border-emerald-200/70 bg-white/95 shadow-lg shadow-emerald-200/40 ring-1 ring-emerald-200/30 backdrop-blur-xl p-8">
              <div className="mb-6 space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-600 drop-shadow-[0_0_4px_rgba(16,185,129,0.25)]">
                  {currentPage === 'analysis'
                    ? 'New Plant Analysis'
                    : 'Analysis History'}
                </p>

                <h2 className="text-2xl font-semibold text-emerald-900">
                  {currentPage === 'analysis'
                    ? 'Upload, analyze, and interpret plant health'
                    : 'Review previous diagnoses and tracked stages'}
                </h2>

                <p className="text-sm text-slate-500">
                  {currentPage === 'analysis'
                    ? 'Start a new analysis by uploading a plant image.'
                    : 'Browse your previous analyses for insights.'}
                </p>
              </div>

              {currentPage === 'analysis' && <AnalysisPage />}
              {currentPage === 'history' && <HistoryPage />}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
