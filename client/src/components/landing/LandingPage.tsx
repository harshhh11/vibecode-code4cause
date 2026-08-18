import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import {
  ArrowRight,
  Compass,
  Sun,
  Moon,
  Layers,
  Box,
  Zap,
  ShieldCheck,
  Palette,
  Maximize2,
} from 'lucide-react';



export const LandingPage: React.FC = () => {
  const { setCurrentView, setAuthModalOpen, globalTheme, toggleGlobalTheme } = useUI();
  const [activeTab, setActiveTab] = useState<'2d' | '3d' | 'palette'>('3d');

  const startApp = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] dark:bg-[#0A0D12] text-[#171717] dark:text-neutral-100 selection:bg-[#EAE4DC] flex flex-col font-sans transition-colors duration-300">
      {/* Top Floating Glassmorphic Navbar */}
      <nav className="h-20 border-b border-[#EAE6DD] dark:border-[#1E2430] px-6 lg:px-12 flex items-center justify-between sticky top-0 bg-[#FBFBF9]/85 dark:bg-[#0A0D12]/85 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-neutral-950 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950 shadow-md ring-2 ring-[#D4AF37]/40">
            <span className="font-extrabold tracking-widest text-sm text-[#D4AF37] dark:text-[#8C5232]">AE</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-logo font-black tracking-widest text-xl text-neutral-950 dark:text-white uppercase">
                AERA
              </span>
              <span className="text-[9px] font-mono font-black bg-[#FAF4ED] dark:bg-[#282115] text-[#8C5232] dark:text-[#D4AF37] px-2 py-0.5 rounded-full border border-[#E5D4C4] dark:border-[#523E28] uppercase tracking-wider">
                Studio Edition
              </span>

            </div>
            <span className="text-[10px] block text-neutral-500 dark:text-neutral-400 font-medium tracking-tight -mt-0.5">
              Autonomous Spatial Intelligence Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
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
            className="px-4 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            Sign In
          </button>

          <button
            onClick={startApp}
            className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col items-center text-center space-y-8">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-neutral-950 dark:text-white tracking-tight leading-[1.08]">
            Design your space, <br />
            <span className="bg-linear-to-r from-[#B26A4A] via-[#D4AF37] to-[#8C5232] dark:from-[#D4AF37] dark:via-[#F3E5AB] dark:to-[#C5A059] bg-clip-text text-transparent">
              your way.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed max-w-2xl mx-auto">
            AERA pairs whole-home dimension recommendations with collision math, door swing clearance, and verified interior designer collaboration.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            onClick={startApp}
            className="w-full sm:w-auto px-8 py-4 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-2xl text-sm font-extrabold shadow-xl transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5 active:scale-98"
          >
            <span>Open Interactive Studio</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] dark:text-[#8C5232]" />
          </button>

          <button
            onClick={() => setCurrentView('marketplace')}
            className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-[#161B22] hover:bg-[#FAF9F6] dark:hover:bg-[#21262D] border border-[#E8E6DF] dark:border-[#30363D] text-neutral-800 dark:text-neutral-200 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Compass className="w-4 h-4 text-[#B26A4A] dark:text-[#D4AF37]" />
            <span>Consult Verified Architects</span>
          </button>
        </div>


        {/* Hero Interactive Teaser Mockup */}
        <div className="w-full max-w-5xl pt-4">
          <div className="bg-white dark:bg-[#161B22] rounded-3xl border border-[#E8E6DF] dark:border-[#30363D] shadow-2xl overflow-hidden p-2.5">
            <div className="bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#EAE6DD] dark:border-[#21262D] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-xs text-neutral-900 dark:text-white">
                  Master Bedroom Architectural Blueprint (12 × 14 ft)
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  Spatial Score: 94/100 (Grade A+)
                </span>
              </div>

              {/* Teaser Tab Switcher */}
              <div className="flex items-center gap-1 bg-[#EAE6DF] dark:bg-[#21262D] p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('3d')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === '3d'
                      ? 'bg-white dark:bg-[#30363D] text-neutral-900 dark:text-white shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Box className="w-3 h-3 text-[#B26A4A] dark:text-[#D4AF37]" />
                  <span>3D Realistic</span>
                </button>

                <button
                  onClick={() => setActiveTab('2d')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === '2d'
                      ? 'bg-white dark:bg-[#30363D] text-neutral-900 dark:text-white shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>2D CAD</span>
                </button>

                <button
                  onClick={() => setActiveTab('palette')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === 'palette'
                      ? 'bg-white dark:bg-[#30363D] text-neutral-900 dark:text-white shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Palette className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Custom Palette</span>
                </button>
              </div>
            </div>

            {/* Teaser Display Viewport */}
            <div className="h-96 relative bg-[#FAF9F5] dark:bg-[#090C10] flex items-center justify-center p-6 bg-blueprint-grid overflow-hidden rounded-xl">
              {activeTab === '2d' && (
                <div className="w-full max-w-lg h-72 border-4 border-neutral-900 dark:border-neutral-700 bg-white dark:bg-[#12161E] relative rounded shadow-inner p-4 flex flex-col justify-between animate-fadeIn">
                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                    <span>NORTH WALL • 14 FT (SOLID)</span>
                    <span className="text-[#B26A4A] dark:text-[#D4AF37] font-bold">CIRCULATION CLEARANCE: 105 CM</span>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <div className="w-24 h-36 bg-[#6E472A] dark:bg-[#4E311A] text-white text-[9px] font-bold flex flex-col items-center justify-center rounded shadow-md border border-black/20">
                      <span>Wardrobe 6'</span>
                      <span className="text-[7px] font-mono opacity-80">Flush West</span>
                    </div>
                    <div className="w-40 h-44 bg-[#FAF4ED] dark:bg-[#282115] border-2 border-[#B26A4A] text-[#8C5232] dark:text-[#D4AF37] text-[10px] font-bold flex flex-col items-center justify-center rounded-xl shadow-md">
                      <span>King Platform Bed</span>
                      <span className="text-[8px] font-mono opacity-80">6.5 × 7.0 ft</span>
                      <span className="text-[7px] text-emerald-600 mt-1">Dual Nightstands</span>
                    </div>
                    <div className="w-20 h-28 bg-[#5E7260] dark:bg-[#324234] text-white text-[9px] font-bold flex items-center justify-center rounded shadow-md">
                      Study Desk
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">ENTRY DOOR • 3.0 FT SWING (0 CONFLICTS)</span>
                    <span className="text-sky-600 dark:text-sky-400 font-bold">🪟 WINDOW • 5.0 FT SILL</span>
                  </div>
                </div>
              )}

              {activeTab === '3d' && (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4 animate-fadeIn">
                  <div className="p-6 bg-white/90 dark:bg-[#12161E]/90 backdrop-blur-md rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] shadow-xl max-w-md space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Box className="w-5 h-5 text-[#B26A4A] dark:text-[#D4AF37]" />
                        <span className="text-xs font-extrabold text-neutral-900 dark:text-white">Procedural WebGL 3D Engine</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                        60 FPS Active
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 text-left">
                      Realistic oak grain platform beds, layered duvets, spherical fluted nightstand lamps, and 2700K warm architectural cove backlighting.
                    </p>

                    <button
                      onClick={startApp}
                      className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Launch Full-Screen 3D Studio</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'palette' && (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4 animate-fadeIn">
                  <div className="p-6 bg-white/90 dark:bg-[#12161E]/90 backdrop-blur-md rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] shadow-xl max-w-md space-y-3 text-left">
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-extrabold text-neutral-900 dark:text-white">5-Surface Material Customizer</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">
                      Pick paint shades, wood stains, brushed brass trim, drapes, and flooring with instant real-time synchronization.
                    </p>
                    <div className="flex h-8 rounded-xl overflow-hidden border border-black/15 shadow-xs">
                      <div className="flex-1 bg-[#FAF7F2]" title="Alabaster Walls" />
                      <div className="flex-1 bg-[#D4B38C]" title="Oak Floors" />
                      <div className="flex-1 bg-[#7D5836]" title="White Oak Wood" />
                      <div className="flex-1 bg-[#EFEAE1]" title="Oatmeal Boucle" />
                      <div className="flex-1 bg-[#D4AF37]" title="Brushed Brass Accent" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6-Card Architectural Feature Showcase */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-[#EAE6DD] dark:border-[#21262D]">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#B26A4A] dark:text-[#D4AF37]">
            Core Spatial Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
            Built for Architecture, Not Just Pretty Pictures
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-white dark:bg-[#12161E] rounded-3xl border border-[#E8E6DF] dark:border-[#21262D] shadow-xs space-y-3 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FAF4ED] dark:bg-[#282115] text-[#8C5232] dark:text-[#D4AF37] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Deterministic CAD Math</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Magnetic wall snapping, door swing arc clearance, and corridor walking path conflict detection calculated in real time.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white dark:bg-[#12161E] rounded-3xl border border-[#E8E6DF] dark:border-[#21262D] shadow-xs space-y-3 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Procedural 3D & 360° Studio</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              High-fidelity Three.js WebGL rendering with fluted drawer nightstands, chamfered platform beds, and immersive walk-throughs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white dark:bg-[#12161E] rounded-3xl border border-[#E8E6DF] dark:border-[#21262D] shadow-xs space-y-3 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Custom Palette Builder</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Tailor individual paint swatches, timber millwork, hardware trim, and flooring tones with 1-click live sync across 2D & 3D.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-white dark:bg-[#12161E] rounded-3xl border border-[#E8E6DF] dark:border-[#21262D] shadow-xs space-y-3 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Intelligent Auto-Optimizer</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Generates conflict-free room permutations that automatically resolve bottlenecks and boost your spatial score to 94–98/100.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 bg-white dark:bg-[#12161E] rounded-3xl border border-[#E8E6DF] dark:border-[#21262D] shadow-xs space-y-3 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">AIA Architect Consultations</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              2-pane Direct Message inbox to chat with verified interior architects, review revision blueprints, and apply layouts in 1 click.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 bg-white dark:bg-[#12161E] rounded-3xl border border-[#E8E6DF] dark:border-[#21262D] shadow-xs space-y-3 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Supabase Cloud Sync</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Continuous state synchronization across rooms, design versions, and client profiles with PostgreSQL cloud persistence.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-[#EAE6DD] dark:border-[#21262D] text-center text-xs text-neutral-500 dark:text-neutral-400 bg-white dark:bg-[#0A0D12]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-extrabold text-neutral-900 dark:text-white">AERA Spatial Intelligence System</span>
          <p>© 2026 AERA Design Inc. Built for deterministic architectural accuracy.</p>
        </div>
      </footer>

    </div>
  );
};
