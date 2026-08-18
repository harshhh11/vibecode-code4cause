import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Sun,
  Moon,
  Layers,
  Box,
  Zap,
} from 'lucide-react';


export const LandingPage: React.FC = () => {
  const { setCurrentView, setAuthModalOpen, globalTheme, toggleGlobalTheme } = useUI();
  const [activeTab, setActiveTab] = useState<'2d' | '3d'>('3d');

  const startApp = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] dark:bg-[#0D1117] text-[#171717] dark:text-neutral-100 selection:bg-[#EAE4DC] flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <nav className="h-20 border-b border-[#EAE6DD] dark:border-[#21262D] px-6 lg:px-12 flex items-center justify-between sticky top-0 bg-[#FBFBF9]/90 dark:bg-[#0D1117]/90 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-950 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950 shadow-sm">
            <span className="font-extrabold tracking-widest text-sm text-[#D4AF37] dark:text-[#8C5232]">AE</span>
          </div>
          <div>
            <span className="font-logo font-extrabold tracking-widest text-xl text-neutral-950 dark:text-white uppercase">
              AERA
            </span>
            <span className="text-[10px] block text-neutral-500 dark:text-neutral-400 font-medium tracking-tight -mt-1">
              AI Spatial Design Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleGlobalTheme}
            title={`Switch to ${globalTheme === 'light' ? 'Dark' : 'Light'} Mode`}
            className="p-2.5 bg-[#FAF9F6] dark:bg-[#161B22] hover:bg-[#EAE6DD] dark:hover:bg-[#21262D] text-neutral-800 dark:text-neutral-200 border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            {globalTheme === 'light' ? (
              <Moon className="w-4 h-4 text-neutral-600" />
            ) : (
              <Sun className="w-4 h-4 text-[#D4AF37]" />
            )}
          </button>

          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={startApp}
            className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col items-center text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF4ED] dark:bg-[#282115] border border-[#E5D4C4] dark:border-[#523E28] text-[#8C5232] dark:text-[#D4AF37] text-xs font-bold uppercase tracking-wider animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Deterministic Spatial Intelligence • Not Just an AI Generator</span>
        </div>

        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-black text-neutral-950 dark:text-white tracking-tight leading-[1.1]">
            Design your space. <br />
            <span className="text-[#B26A4A] dark:text-[#D4AF37]">Make it work.</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed max-w-2xl mx-auto">
            AERA pairs whole-home dimension recommendations with collision math, door swing clearance, and verified interior designer collaboration.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            onClick={startApp}
            className="w-full sm:w-auto px-8 py-4 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-2xl text-sm font-bold shadow-xl transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5"
          >
            <span>Start Free Space Blueprint</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] dark:text-[#8C5232]" />
          </button>

          <button
            onClick={() => {
              setCurrentView('marketplace');
            }}
            className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-[#161B22] hover:bg-[#FAF9F6] dark:hover:bg-[#21262D] border border-[#E8E6DF] dark:border-[#30363D] text-neutral-800 dark:text-neutral-200 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Compass className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <span>Discover Verified Designers</span>
          </button>
        </div>

        {/* Hero Interactive Teaser Mockup */}
        <div className="w-full max-w-5xl pt-8">
          <div className="bg-white dark:bg-[#161B22] rounded-3xl border border-[#E8E6DF] dark:border-[#30363D] shadow-2xl overflow-hidden p-2">
            <div className="bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#EAE6DD] dark:border-[#21262D] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-xs text-neutral-900 dark:text-white">Master Bedroom Blueprint (12 × 14 ft)</span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
                  Spatial Score: 91/100
                </span>
              </div>

              <div className="flex items-center gap-1 bg-[#EAE6DF] dark:bg-[#21262D] p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('2d')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeTab === '2d'
                      ? 'bg-white dark:bg-[#30363D] text-neutral-900 dark:text-white shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  2D CAD
                </button>
                <button
                  onClick={() => setActiveTab('3d')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeTab === '3d'
                      ? 'bg-white dark:bg-[#30363D] text-neutral-900 dark:text-white shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  3D Realistic
                </button>
              </div>
            </div>

            <div className="h-96 relative bg-[#FAF9F5] dark:bg-[#090C10] flex items-center justify-center p-6 bg-blueprint-grid">
              <div className="w-full max-w-lg h-72 border-4 border-neutral-900 dark:border-neutral-700 bg-white dark:bg-[#12161E] relative rounded shadow-inner p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                  <span>NORTH WALL • 14 FT</span>
                  <span className="text-[#B26A4A] dark:text-[#D4AF37] font-bold">CLEARANCE: 92 CM</span>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <div className="w-24 h-32 bg-[#6E472A] dark:bg-[#4E311A] text-white text-[9px] font-bold flex items-center justify-center rounded shadow-md">
                    Wardrobe 6'
                  </div>
                  <div className="w-36 h-40 bg-[#FAF4ED] dark:bg-[#282115] border-2 border-[#B26A4A] text-[#8C5232] dark:text-[#D4AF37] text-[10px] font-bold flex flex-col items-center justify-center rounded-xl shadow-md">
                    <span>King Bed</span>
                    <span className="text-[8px] font-mono opacity-80">6.5 × 7.0 ft</span>
                  </div>
                  <div className="w-20 h-28 bg-[#5E7260] dark:bg-[#324234] text-white text-[9px] font-bold flex items-center justify-center rounded shadow-md">
                    Desk & Chair
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                  <span>ENTRY DOOR • 3.0 FT SWING</span>
                  <span>WINDOW • 5.0 FT GLAZED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-[#EAE6DD] dark:border-[#21262D]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-[#161B22] rounded-3xl border border-[#E8E6DF] dark:border-[#30363D] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF4ED] dark:bg-[#282115] text-[#8C5232] dark:text-[#D4AF37] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Deterministic 2D Math</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Real-time magnetic wall snapping, door swing conflict detection, and circulation clearance calculations.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-[#161B22] rounded-3xl border border-[#E8E6DF] dark:border-[#30363D] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Realistic 3D & 360° View</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              True isometric projection and full-bleed 360° immersive walkthrough with natural daylight and night mode lighting.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-[#161B22] rounded-3xl border border-[#E8E6DF] dark:border-[#30363D] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Gemini AI Spatial Intelligence</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Live generative layout permutations, spatial scoring, and real-time Supabase cloud database synchronization.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-[#EAE6DD] dark:border-[#21262D] text-center text-xs text-neutral-500 dark:text-neutral-400">
        <p>© 2026 AERA Spatial Intelligence. Built for high-precision architectural design.</p>
      </footer>
    </div>
  );
};
