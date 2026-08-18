import React, { useState } from 'react';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { Modal } from '../common/Modal';
import { UserCheck, ShieldCheck, ArrowRight, Home } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, addToast, setCurrentView } = useUI();
  const { login } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('alexander.wright@aera.design');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
    setAuthModalOpen(false);
    
    addToast({
      type: 'success',
      title: `Welcome to AERA, ${selectedRole === 'designer' ? 'Ethan Rodrigues' : 'Alexander Wright'}`,
      message: 'Spatial workspace & active project loaded.',
    });

    if (selectedRole === 'designer') {
      setCurrentView('designer_dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  return (
    <Modal
      isOpen={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      maxWidth="max-w-md"
      title={mode === 'login' ? 'Sign In to AERA' : 'Create Your AERA Account'}
      subtitle="Spatial intelligence, layout optimization & architectural collaboration"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700 block">Select Profile Persona</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('user');
                setEmail('alexander.wright@aera.design');
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedRole === 'user'
                  ? 'border-neutral-950 bg-white ring-2 ring-neutral-950/10 shadow-xs'
                  : 'border-[#E8E6DF] bg-[#FAF9F6] text-neutral-600 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                <Home className="w-3.5 h-3.5 text-[#B26A4A]" />
                <span>Homeowner</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-0.5">Design & optimize spaces</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('designer');
                setEmail('ethan@rodrigues-spatial.com');
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedRole === 'designer'
                  ? 'border-neutral-950 bg-white ring-2 ring-neutral-950/10 shadow-xs'
                  : 'border-[#E8E6DF] bg-[#FAF9F6] text-neutral-600 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Interior Designer</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-0.5">Review client blueprints</p>
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E6DF] text-xs bg-white focus:outline-none focus:border-neutral-900"
            placeholder="alexander@example.com"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E6DF] text-xs bg-white focus:outline-none focus:border-neutral-900"
            placeholder="••••••••••••"
          />
        </div>

        <div className="p-3 bg-[#FAF4ED] rounded-xl border border-[#E5D4C4] flex items-center gap-2.5 text-xs text-[#8C5232]">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <p className="text-[11px] leading-relaxed">
            Enterprise AES-256 encrypted architectural CAD store.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>{mode === 'login' ? 'Sign In & Open Studio' : 'Create Free Account'}</span>
          <ArrowRight className="w-4 h-4 text-[#D4B996]" />
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-xs text-neutral-500 hover:text-neutral-900 font-medium"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
