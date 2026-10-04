'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, CheckCircle2, AlertCircle, Database, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from './Toast';

interface SupabaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupabaseAuthModal({ isOpen, onClose }: SupabaseAuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: toastError, info } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      info('Currently running in Local Guest mode with LocalStorage persistence.');
      onClose();
      return;
    }

    if (!email || !password) {
      toastError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        success('Account created! Please check your email for confirmation.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        success('Successfully signed in! Your generations will sync to Supabase.');
      }
      onClose();
    } catch (err: any) {
      toastError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f131a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isSupabaseConfigured ? (isSignUp ? 'Create Cloud Account' : 'Sign In') : 'Account & Sync'}
              </h3>
              <p className="text-xs text-slate-400">
                {isSupabaseConfigured ? 'Sync voice generations across devices' : 'Supabase Cloud Sync Status'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!isSupabaseConfigured ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-lime-500/20 bg-lime-500/5 text-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-lime-400 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Local Guest Mode Active</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Voxora AI is completely functional right now. All text-to-speech generations, custom pitch/rate settings, and history are stored securely in your browser's local storage.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-black/30 space-y-2 text-xs text-slate-400">
                <h4 className="font-semibold text-slate-300">To enable multi-user Supabase cloud accounts:</h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
                  <li>Create a project on <span className="text-lime-400">supabase.com</span></li>
                  <li>Copy your Project URL and Anon Public Key</li>
                  <li>Add them to <code className="text-slate-200 bg-white/5 px-1 py-0.5 rounded">frontend/.env.local</code></li>
                </ol>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl lime-glow-btn text-xs font-semibold text-black"
              >
                Continue in Guest Mode
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-lime-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-lime-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl lime-glow-btn text-xs font-semibold text-black flex items-center justify-center gap-2"
              >
                {isLoading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-lime-400 hover:underline"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
