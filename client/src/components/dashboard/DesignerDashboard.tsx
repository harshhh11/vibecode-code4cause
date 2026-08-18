import React from 'react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Eye,
  Box,
  MessageSquare,
} from 'lucide-react';

export const DesignerDashboard: React.FC = () => {
  const { setCurrentView, setStudioMode } = useUI();
  const { user } = useAuth();

  const consultationRequests = [
    {
      id: 'req-1',
      clientName: 'Alexander Wright',
      clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      projectName: 'My 2BHK Apartment (Master Bedroom 12×14 ft)',
      score: 91,
      topic: 'Wardrobe Clearance & Circulation Optimization',
      status: 'active',
      date: 'Today, 10:30 AM',
      unread: 2,
    },
    {
      id: 'req-2',
      clientName: 'Sophia Lin',
      clientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      projectName: 'Tribeca Loft Living Room (450 sq.ft)',
      score: 74,
      topic: 'Window Glare vs TV Media Wall Placement',
      status: 'pending',
      date: 'Yesterday',
      unread: 0,
    },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn select-none font-sans transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF4ED] dark:bg-[#282115] border border-[#E5D4C4] dark:border-[#523E28] rounded-full text-xs font-bold text-[#8C5232] dark:text-[#D4AF37] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Designer Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Review client spatial models, resolve door swing bottlenecks, and send optimized 3D layout revisions.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] space-y-1 shadow-2xs">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Active Consultations</span>
          <p className="text-2xl font-mono font-extrabold text-neutral-900 dark:text-white">4</p>
        </div>
        <div className="p-5 bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] space-y-1 shadow-2xs">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Spatial Layouts Reviewed</span>
          <p className="text-2xl font-mono font-extrabold text-neutral-900 dark:text-white">38</p>
        </div>
        <div className="p-5 bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] space-y-1 shadow-2xs">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Designer Rating</span>
          <p className="text-2xl font-mono font-extrabold text-emerald-700 dark:text-emerald-400">4.9 ★</p>
        </div>
      </div>

      {/* Consultations Feed */}
      <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#E8E6DF] dark:border-[#30363D] bg-[#FAF9F6] dark:bg-[#12161E] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Client Consultation Queue
          </h3>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">2 active threads</span>
        </div>

        <div className="divide-y divide-[#E8E6DF] dark:divide-[#30363D]">
          {consultationRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF9F6] dark:hover:bg-[#1C2128] transition-colors"
            >
              <div className="flex items-start gap-4">
                <img
                  src={req.clientAvatar}
                  alt={req.clientName}
                  className="w-12 h-12 rounded-full object-cover border border-[#E8E6DF] dark:border-[#30363D]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{req.clientName}</h4>
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-700">
                      Score: {req.score}/100
                    </span>
                    {req.unread > 0 && (
                      <span className="text-[10px] bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-bold px-2 py-0.5 rounded-full border border-red-300 dark:border-red-700">
                        {req.unread} new
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{req.projectName}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{req.topic}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setStudioMode('2d');
                    setCurrentView('studio');
                  }}
                  className="px-3 py-2 bg-white dark:bg-[#21262D] hover:bg-neutral-100 dark:hover:bg-[#30363D] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs font-semibold text-neutral-800 dark:text-white flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>2D CAD</span>
                </button>
                <button
                  onClick={() => {
                    setStudioMode('3d');
                    setCurrentView('studio');
                  }}
                  className="px-3 py-2 bg-white dark:bg-[#21262D] hover:bg-neutral-100 dark:hover:bg-[#30363D] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs font-semibold text-neutral-800 dark:text-white flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Box className="w-3.5 h-3.5 text-[#B26A4A] dark:text-[#D4AF37]" />
                  <span>3D Studio</span>
                </button>
                <button
                  onClick={() => setCurrentView('chat')}
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
                  <span>Open Thread</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
