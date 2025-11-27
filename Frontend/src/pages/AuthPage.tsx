import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import { LoginForm, SignUpForm } from '../components/AuthForms';

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 border border-emerald-200/70 rounded-3xl shadow-lg shadow-emerald-200/40 ring-1 ring-emerald-200/30 backdrop-blur-xl p-8 sm:p-10">
          {/* Brand */}
          <div className="flex items-center gap-5 mb-10 ml-10">
              <img
                src="/src/assets/plant-grass-svgrepo-com.svg"
                alt="PlantGuard Logo"
                className="w-12 h-12 object-contain rounded-2xl bg-white/80 p-1 shadow-lg shadow-emerald-300/60 ring-2 ring-emerald-300/40"
              />
            <h1 className="text-3xl font-semibold text-emerald-900 mb-1 drop-shadow-[0_0_6px_rgba(16,185,129,0.25)]">
              PlantGuard <span className="text-emerald-600">AI</span>
            </h1>
          </div>

          {/* Auth Forms */}
          <div className="mb-6">
            {isLogin ? (
              <LoginForm onSuccess={onAuthSuccess} />
            ) : (
              <SignUpForm onSuccess={onAuthSuccess} />
            )}
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-100" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/95 text-slate-500">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </span>
            </div>
          </div>

          {/* Toggle link */}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline underline-offset-4 transition-colors"
          >
            {isLogin ? 'Create new account' : 'Sign in instead'}
          </button>
        </div>

        {/* Powered by */}
        <p className="text-center text-sm mt-6 text-emerald-700/80">
          Powered by{' '}
          <span className="font-semibold text-emerald-800 drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]">
            VORN
          </span>
        </p>
      </div>
    </div>
  );
}
