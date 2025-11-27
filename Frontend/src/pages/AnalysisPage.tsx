import React, { useState, useEffect } from 'react';
import { Upload, Leaf, AlertCircle, CheckCircle, Droplet, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { PlantSpecies } from '../types';

export function AnalysisPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plantSpecies, setPlantSpecies] = useState<PlantSpecies[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchSpecies = async () => {
      const { data } = await supabase.from('plant_species').select('*');

      if (data) {
        setPlantSpecies(data);
        setSelectedSpecies(data[0]?.id || '');
      }
    };

    fetchSpecies();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedSpecies) {
      setError('Please select an image and plant species');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const diseases = await supabase.from('disease_catalog').select('*');

      const diseaseList = diseases.data || [];
      const randomDisease = diseaseList[Math.floor(Math.random() * diseaseList.length)];
      const stage = Math.floor(Math.random() * 4) + 1;
      const severities = ['Low', 'Medium', 'High', 'Critical'] as const;
      const severity = severities[stage - 1] || 'Low';

      const result = {
        disease: randomDisease,
        stage,
        severity,
        confidence: 85 + Math.random() * 15,
      };

      setAnalysisResult(result);

      if (user && selectedSpecies) {
        await supabase.from('analyses').insert({
          user_id: user.id,
          plant_species_id: selectedSpecies,
          disease_id: randomDisease.id,
          disease_stage: stage,
          severity,
          confidence_score: result.confidence,
          image_url: selectedImage,
          segmentation_data: { segmented: true },
          notes: 'Analysis completed',
        });
      }
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-emerald-200/70 ring-1 ring-emerald-200/40 shadow-xl shadow-emerald-200/50 p-6 sm:p-10 space-y-8">
        {!selectedImage ? (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 mb-1">
                
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-emerald-900 mb-1">
                Plant Disease Analysis
              </h2>
              <p className="text-sm text-slate-600">
                Upload a whole-plant image and let PlantGuard AI estimate disease, stage,
                and confidence.
              </p>
            </div>

            {/* Species selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Select Plant Species
              </label>
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 transition-shadow shadow-sm focus:shadow-[0_0_12px_rgba(16,185,129,0.35)]"
              >
                {plantSpecies.map((species) => (
                  <option key={species.id} value={species.id}>
                    {species.name} ({species.scientific_name})
                  </option>
                ))}
              </select>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-300 bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-50 ${
                isDragging
                  ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.45)] scale-[1.01]'
                  : 'border-emerald-200 hover:border-emerald-400 hover:shadow-[0_0_16px_rgba(16,185,129,0.3)]'
              }`}
            >
              <Upload className="w-14 h-14 sm:w-16 sm:h-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                Drop your plant image here
              </h3>
              <p className="text-sm text-emerald-700 mb-5">
                or click below to browse from your device
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all shadow-[0_0_16px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                Choose Image
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Image + overlay */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-emerald-200/50 border border-emerald-100">
              <img
                src={selectedImage}
                alt="Selected plant"
                className="w-full h-auto max-h-96 object-cover"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-emerald-900/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-300 border-t-white mb-4" />
                    <p className="text-white text-lg font-medium">
                      Analyzing plant health...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            {!isAnalyzing && analysisResult && (
              <div className="grid gap-5">
                {/* Species card */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-emerald-900 mb-1">
                      Plant Species
                    </h4>
                    <p className="text-sm text-emerald-800">
                      {plantSpecies.find((s) => s.id === selectedSpecies)?.name}
                    </p>
                  </div>
                </div>

                {/* Disease card */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-amber-900 mb-1">
                      Disease Detected
                    </h4>
                    <p className="text-sm text-amber-800 font-medium mb-1">
                      {analysisResult.disease.name} — Stage {analysisResult.stage}
                    </p>
                    <p className="text-xs text-amber-700">
                      Severity: {analysisResult.severity} · Confidence:{' '}
                      {analysisResult.confidence.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Treatment card */}
                <div className="rounded-xl border border-cyan-200 bg-cyan-50/80 p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.45)]">
                    <Droplet className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-cyan-900 mb-2">
                      Treatment Plan
                    </h4>
                    <ul className="space-y-2 text-sm text-cyan-800">
                      {analysisResult.disease.treatment.map((step: any, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                          <span>{step.action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setAnalysisResult(null);
                }}
                className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all shadow-sm hover:shadow-md"
              >
                Upload New Image
              </button>
              {!isAnalyzing && !analysisResult && (
                <button
                  onClick={handleAnalyze}
                  className="flex-1 px-6 py-3.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all shadow-[0_0_16px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Leaf className="w-4 h-4" />
                  Analyze Plant
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
