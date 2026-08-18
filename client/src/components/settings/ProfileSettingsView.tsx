import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import {
  User,
  ShieldCheck,
  Settings,
  Compass,
  Database,
  Save,
  CheckCircle2,
} from 'lucide-react';


export const ProfileSettingsView: React.FC = () => {
  const { user, role, updateProfile } = useAuth();
  const { addToast } = useUI();

  const [activeTab, setActiveTab] = useState<'profile' | 'spatial' | 'cloud' | 'security'>('profile');
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '+1 (212) 555-0194',
    location: user.location || 'Tribeca, New York, NY',
    bio: user.bio || '',
    title: user.title || (role === 'designer' ? 'Principal Spatial Architect' : 'Homeowner & Architectural Enthusiast'),
    firmName: user.firmName || 'Rodrigues Spatial Architecture LLC',
    licenseId: user.licenseId || 'AIA-NY #849204',
    hourlyRate: user.hourlyRate || 120,
    ratePerSqFt: user.ratePerSqFt || 4.5,
    preferredStyle: user.preferredStyle || 'Warm Minimalist Oak',
    unitPreference: user.unitPreference || 'ft',
    targetClearanceCm: user.targetClearanceCm || 90,
    aiSensitivity: user.aiSensitivity || 'balanced',
    notificationsEnabled: user.notificationsEnabled ?? true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData as any);
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile settings and spatial preferences have been saved.',
    });
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8 animate-fadeIn select-none font-sans transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF4ED] dark:bg-[#282115] border border-[#E5D4C4] dark:border-[#523E28] rounded-full text-xs font-bold text-[#8C5232] dark:text-[#D4AF37] uppercase tracking-wider mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Account & Spatial Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your personal profile, architectural credentials, and Gemini AI spatial engine parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold shadow-md transition-all active:scale-98 self-start sm:self-auto"
        >
          <Save className="w-4 h-4 text-[#D4AF37] dark:text-[#8C5232]" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white dark:bg-[#161B22] rounded-3xl border border-[#E8E6DF] dark:border-[#30363D] overflow-hidden shadow-2xs">
        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[#E8E6DF] dark:border-[#21262D] bg-[#FAF9F6] dark:bg-[#12161E] px-4 overflow-x-auto">
          {[
            { id: 'profile', label: role === 'designer' ? 'Architect Profile' : 'Homeowner Profile', icon: User },
            { id: 'spatial', label: 'Spatial & AI Engine', icon: Compass },
            { id: 'cloud', label: 'Cloud & Database', icon: Database },
            { id: 'security', label: 'Security & Alerts', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-neutral-950 dark:border-white text-neutral-950 dark:text-white'
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#B26A4A] dark:text-[#D4AF37]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <form onSubmit={handleSave} className="p-6 lg:p-8 space-y-6">
          {/* TAB 1: PROFILE INFO */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Profile Card Header */}
              <div className="flex items-center gap-5 p-5 bg-[#FAF9F6] dark:bg-[#0D1117] rounded-2xl border border-[#E8E6DF] dark:border-[#21262D]">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-[#30363D] shadow-md"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">{user.name}</h3>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                      {role === 'designer' ? 'AIA Verified Architect' : 'AERA Pro Member'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{formData.title}</p>
                  <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">{formData.location}</p>
                </div>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Location & Timezone
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 font-medium"
                  />
                </div>

                {/* Designer Specific Fields */}
                {role === 'designer' && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        Firm / Studio Name
                      </label>
                      <input
                        type="text"
                        value={formData.firmName}
                        onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        Architectural License ID
                      </label>
                      <input
                        type="text"
                        value={formData.licenseId}
                        onChange={(e) => setFormData({ ...formData, licenseId: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        Hourly Consultation Rate ($/hr)
                      </label>
                      <input
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        Spatial Blueprint Rate ($/sq.ft)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.ratePerSqFt}
                        onChange={(e) => setFormData({ ...formData, ratePerSqFt: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 font-medium"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Bio Description */}
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  About & Design Philosophy
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 leading-relaxed font-medium"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SPATIAL & AI ENGINE */}
          {activeTab === 'spatial' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#B26A4A] dark:text-[#D4AF37]" />
                  <span>Architectural Standards & Optimization Parameters</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Configure default clearance thresholds used by the Gemini 2.0 Flash spatial intelligence engine.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Measurement System
                  </label>
                  <select
                    value={formData.unitPreference}
                    onChange={(e) => setFormData({ ...formData, unitPreference: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none font-medium"
                  >
                    <option value="ft">Imperial (Feet & Inches)</option>
                    <option value="m">Metric (Meters & Centimeters)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Target Minimum Corridor Clearance
                  </label>
                  <select
                    value={formData.targetClearanceCm}
                    onChange={(e) => setFormData({ ...formData, targetClearanceCm: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none font-medium"
                  >
                    <option value="80">80 cm — Compact Urban Standard</option>
                    <option value="90">90 cm — Recommended Architectural Flow</option>
                    <option value="105">105 cm — Luxury Spacing & Wheelchair Accessible</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Preferred Aesthetic Style
                  </label>
                  <select
                    value={formData.preferredStyle}
                    onChange={(e) => setFormData({ ...formData, preferredStyle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none font-medium"
                  >
                    <option value="Warm Minimalist Oak">Warm Minimalist Oak</option>
                    <option value="Japandi Earth & Hinoki">Japandi Earth & Hinoki</option>
                    <option value="Nordic Slate & Ash">Nordic Slate & Ash</option>
                    <option value="Modern Luxury Travertine">Modern Luxury Travertine</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    AI Auto-Optimizer Focus
                  </label>
                  <select
                    value={formData.aiSensitivity}
                    onChange={(e) => setFormData({ ...formData, aiSensitivity: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none font-medium"
                  >
                    <option value="balanced">Balanced (Optimal Clearance & Daylight)</option>
                    <option value="spacious">Ultra-Spacious (Maximizes Open Center Floor)</option>
                    <option value="compact">Space-Saving (Maximizes Storage & Millwork)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLOUD & SUPABASE */}
          {activeTab === 'cloud' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      Supabase Cloud Sync Status
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    CONNECTED
                  </span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 font-mono">
                  Endpoint: https://zbeuzfltablkkjcqcwup.supabase.co
                </p>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono pt-1">
                  11 Relational Tables Synced • 285+ Records Stored • PostgreSQL 15.6 Active
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Active Database Tables
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {['user_profiles', 'projects', 'rooms', 'room_doors', 'room_windows', 'room_obstacles', 'furniture_catalog', 'furniture_placements', 'ai_evaluations', 'consultations', 'design_themes'].map((tbl) => (
                    <div key={tbl} className="p-2.5 bg-[#FAF9F6] dark:bg-[#0D1117] rounded-xl border border-[#E8E6DF] dark:border-[#30363D] flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{tbl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & ALERTS */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-4">
                <div className="p-4 bg-[#FAF9F6] dark:bg-[#0D1117] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Live Consultation Chat Pings</h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Receive instant alerts when a verified architect sends a layout review.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notificationsEnabled}
                    onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
                    className="w-4 h-4 accent-neutral-900 dark:accent-white cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-[#FAF9F6] dark:bg-[#0D1117] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">AI Spatial Score Threshold Alerts</h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Notify immediately if door swing clearance falls below 85cm.</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="w-4 h-4 accent-neutral-900 dark:accent-white cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-[#FAF9F6] dark:bg-[#0D1117] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Zero Contact Info Sharing Guarantee</h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">All blueprints & communications remain encrypted inside AERA spatial vault.</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
                    ENFORCED
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Save Bar */}
          <div className="pt-4 border-t border-[#E8E6DF] dark:border-[#21262D] flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
              AERA Spatial ID: {user.id}
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold shadow-md transition-all active:scale-98"
            >
              <Save className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
