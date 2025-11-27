import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Leaf, Calendar, Activity, Loader, X, Trash2 } from 'lucide-react';
import type { Analysis } from '../types';

export function HistoryPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analyses:', error);
      } else {
        setAnalyses(data || []);
      }

      setLoading(false);
    };

    fetchAnalyses();
  }, [user]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Medium':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'High':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Critical':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    const ok = window.confirm('Delete this analysis permanently?');
    if (!ok) return;

    const { error } = await supabase
      .from('analyses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting analysis:', error);
      return;
    }

    setAnalyses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAnalysis?.id === id) {
      setSelectedAnalysis(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600 text-sm">Loading analysis history...</p>
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg shadow-emerald-200/40 border border-emerald-200/70 ring-1 ring-emerald-200/30 p-10 text-center">
        <Activity className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-emerald-900 mb-2">
          No analyses yet
        </h3>
        <p className="text-slate-600 text-sm max-w-md mx-auto">
          Start by uploading a plant image in the New Analysis section to see your
          first AI-powered diagnosis here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* WIDE DETAILS CARD INSIDE PAGE */}
      {selectedAnalysis && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-emerald-200/70 ring-1 ring-emerald-200/40 shadow-xl shadow-emerald-200/60 p-6 sm:p-8 space-y-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-[0.16em]">
                Analysis Details
              </p>
              <h3 className="text-lg sm:text-xl font-semibold text-emerald-900">
                Analysis #{selectedAnalysis.id.slice(0, 8)}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(selectedAnalysis.created_at).toLocaleString()}
              </p>
            </div>

            <button
              className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition-colors"
              onClick={() => setSelectedAnalysis(null)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Image + key stats side by side on large screens */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1.3fr)]">
            {/* Image */}
            {selectedAnalysis.image_url && (
              <div className="w-full rounded-2xl overflow-hidden bg-slate-100 max-h-72">
                <img
                  src={selectedAnalysis.image_url}
                  alt="Selected plant analysis"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Stats */}
            <div className="space-y-4">
              {/* Severity */}
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-slate-500 uppercase">
                  Severity
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                    selectedAnalysis.severity
                  )}`}
                >
                  {selectedAnalysis.severity}
                </span>
              </div>

              {/* Growth Stage */}
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-slate-500 uppercase">
                  Growth Stage
                </p>
                <p className="text-sm text-slate-800">
                  Stage {selectedAnalysis.disease_stage}
                </p>
              </div>

              {/* Confidence */}
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-slate-500 uppercase">
                  Confidence Score
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${selectedAnalysis.confidence_score}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-emerald-800">
                    {selectedAnalysis.confidence_score.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedAnalysis.notes && (
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-slate-500 uppercase">
                    Notes
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedAnalysis.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Treatment Plan (full-width) */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 sm:p-5 space-y-3">
            <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-[0.16em]">
              Sample Treatment Plan
            </p>
            <ul className="text-sm text-slate-700 list-disc list-inside space-y-1.5">
              <li>
                <span className="font-medium">Inspect nearby plants:</span> check for
                similar symptoms in surrounding crops.
              </li>
              <li>
                <span className="font-medium">Remove severely affected leaves:</span>{' '}
                carefully prune and dispose away from the field.
              </li>
              <li>
                <span className="font-medium">Improve airflow:</span> reduce overcrowding
                and maintain proper spacing.
              </li>
              <li>
                <span className="font-medium">Adjust watering:</span> water at the base
                in the morning; avoid wet foliage at night.
              </li>
              <li>
                <span className="font-medium">Monitor for 3–5 days:</span> re-scan the
                plant with PlantGuard AI to track progress.
              </li>
            </ul>
            <p className="text-[11px] text-emerald-700/80">
              Note: This is a generic demo plan. For real-world use, follow local
              agronomy guidelines and certified recommendations.
            </p>
          </div>
        </div>
      )}

      {/* HISTORY LIST BELOW */}
      <div className="space-y-5">
        {analyses.map((analysis) => (
          <div
            key={analysis.id}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-emerald-200/70 shadow-md shadow-emerald-200/40 hover:border-emerald-300 hover:shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              {analysis.image_url && (
                <div className="w-full sm:w-24 h-40 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                  <img
                    src={analysis.image_url}
                    alt="Plant analysis"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-lg font-semibold text-emerald-900 truncate">
                    Analysis #{analysis.id.slice(0, 8)}
                  </h4>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getSeverityColor(
                        analysis.severity
                      )}`}
                    >
                      {analysis.severity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(analysis.id);
                      }}
                      className="p-1.5 rounded-full border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-200 transition-colors"
                      title="Delete analysis"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Stage {analysis.disease_stage}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600">
                  Confidence:{' '}
                  <span className="font-medium text-emerald-700">
                    {analysis.confidence_score.toFixed(1)}%
                  </span>
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedAnalysis(analysis);
                      // optional: scroll up to the details card when user selects
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-[0_0_14px_rgba(16,185,129,0.35)]"
                  >
                    View Details & Treatment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
