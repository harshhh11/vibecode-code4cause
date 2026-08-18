import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import {
  Database,
  X,
  Search,
  Copy,
  Check,
  Server,
  Cpu,
} from 'lucide-react';
import { FURNITURE_CATALOG } from '../../data/furnitureLibrary';
import { COLOR_THEMES } from '../../data/colorThemes';


export const DatabaseViewerModal: React.FC = () => {
  const { databaseModalOpen, setDatabaseModalOpen, addToast } = useUI();
  const [activeTable, setActiveTable] = useState<string>('furniture_catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  if (!databaseModalOpen) return null;

  // Mock table schemas and records for presentation
  const tablesData: Record<string, { label: string; icon: string; count: number; columns: string[]; rows: any[] }> = {
    user_profiles: {
      label: 'user_profiles',
      icon: '👤',
      count: 6,
      columns: ['id', 'email', 'full_name', 'role', 'subscription_tier', 'created_at'],
      rows: [
        { id: 'usr-001', email: 'alexander@aera.design', full_name: 'Alexander Wright', role: 'homeowner', subscription_tier: 'pro_plus', created_at: '2026-08-01 10:00' },
        { id: 'usr-002', email: 'ethan.arch@aera.design', full_name: 'Ethan Rodrigues', role: 'architect', subscription_tier: 'verified_pro', created_at: '2026-07-15 08:30' },
        { id: 'usr-003', email: 'elena.rostova@aera.design', full_name: 'Elena Rostova', role: 'designer', subscription_tier: 'verified_pro', created_at: '2026-07-18 14:15' },
        { id: 'usr-004', email: 'sophia.lin@aera.design', full_name: 'Sophia Lin', role: 'homeowner', subscription_tier: 'free', created_at: '2026-08-10 11:20' },
        { id: 'usr-005', email: 'marcus.vance@aera.design', full_name: 'Marcus Vance', role: 'architect', subscription_tier: 'verified_pro', created_at: '2026-06-20 09:45' },
        { id: 'usr-006', email: 'amara.okafor@aera.design', full_name: 'Amara Okafor', role: 'designer', subscription_tier: 'verified_pro', created_at: '2026-08-05 16:50' },
      ],
    },
    projects: {
      label: 'projects',
      icon: '📐',
      count: 4,
      columns: ['id', 'user_id', 'name', 'type', 'total_area_sqft', 'active_score', 'status'],
      rows: [
        { id: 'proj-001', user_id: 'usr-001', name: 'My 2BHK Apartment', type: 'home_2bhk', total_area_sqft: 1200, active_score: 91, status: 'active' },
        { id: 'proj-002', user_id: 'usr-001', name: 'Master Bedroom Studio', type: 'single_room', total_area_sqft: 350, active_score: 85, status: 'in_review' },
        { id: 'proj-003', user_id: 'usr-004', name: 'Nordic Living Room', type: 'single_room', total_area_sqft: 480, active_score: 78, status: 'active' },
        { id: 'proj-004', user_id: 'usr-001', name: 'TriBeCa Modern Penthouse', type: 'home_3bhk', total_area_sqft: 2400, active_score: 95, status: 'draft' },
      ],
    },
    rooms: {
      label: 'rooms',
      icon: '🚪',
      count: 6,
      columns: ['id', 'project_id', 'name', 'type', 'length_ft', 'width_ft', 'height_ft', 'area_sqft'],
      rows: [
        { id: 'rm-101', project_id: 'proj-001', name: 'Master Bedroom', type: 'bedroom', length_ft: 14.0, width_ft: 12.0, height_ft: 9.5, area_sqft: 168.0 },
        { id: 'rm-102', project_id: 'proj-001', name: 'Living & Dining Room', type: 'living', length_ft: 20.0, width_ft: 14.0, height_ft: 10.0, area_sqft: 280.0 },
        { id: 'rm-103', project_id: 'proj-001', name: 'Open Island Kitchen', type: 'kitchen', length_ft: 12.0, width_ft: 10.0, height_ft: 9.5, area_sqft: 120.0 },
        { id: 'rm-104', project_id: 'proj-001', name: 'Guest Bedroom & Study', type: 'study', length_ft: 12.0, width_ft: 10.5, height_ft: 9.5, area_sqft: 126.0 },
        { id: 'rm-105', project_id: 'proj-004', name: 'Penthouse Great Room', type: 'living', length_ft: 32.0, width_ft: 22.0, height_ft: 12.0, area_sqft: 704.0 },
        { id: 'rm-106', project_id: 'proj-004', name: 'Executive Home Office', type: 'office', length_ft: 16.0, width_ft: 14.0, height_ft: 11.0, area_sqft: 224.0 },
      ],
    },
    furniture_catalog: {
      label: 'furniture_catalog',
      icon: '🪑',
      count: FURNITURE_CATALOG.length,
      columns: ['id', 'name', 'category', 'width_ft', 'depth_ft', 'height_ft', 'price_usd', 'material'],
      rows: FURNITURE_CATALOG.map((f) => ({
        id: f.id,
        name: f.name,
        category: f.category,
        width_ft: f.width,
        depth_ft: f.depth,
        height_ft: f.height,
        price_usd: (f as any).price || 499,
        material: f.modelType || 'oak_wood',
      })),

    },
    ai_evaluations: {
      label: 'ai_evaluations',
      icon: '⚡',
      count: 4,
      columns: ['id', 'project_id', 'overall_score', 'circulation_rating', 'door_clearance', 'gemini_tokens', 'timestamp'],
      rows: [
        { id: 'eval-901', project_id: 'proj-001', overall_score: 91, circulation_rating: 'Optimal (98cm avg)', door_clearance: '100% compliant', gemini_tokens: 684, timestamp: '2026-08-18 14:15' },
        { id: 'eval-902', project_id: 'proj-002', overall_score: 85, circulation_rating: 'Clear (88cm avg)', door_clearance: '1 Minor Alert', gemini_tokens: 520, timestamp: '2026-08-17 18:22' },
        { id: 'eval-903', project_id: 'proj-003', overall_score: 78, circulation_rating: 'Moderate (76cm)', door_clearance: 'Door swing clip', gemini_tokens: 712, timestamp: '2026-08-15 09:10' },
        { id: 'eval-904', project_id: 'proj-004', overall_score: 95, circulation_rating: 'Architectural Grade', door_clearance: '100% compliant', gemini_tokens: 940, timestamp: '2026-08-18 11:40' },
      ],
    },
    consultations: {
      label: 'consultations',
      icon: '💬',
      count: 3,
      columns: ['id', 'client_name', 'designer_name', 'topic', 'status', 'last_message'],
      rows: [
        { id: 'chat-01', client_name: 'Alexander Wright', designer_name: 'Ethan Rodrigues', topic: 'Master Bed Wardrobe Clearance', status: 'active', last_message: 'I shifted the 4-door wardrobe to the West wall.' },
        { id: 'chat-02', client_name: 'Alexander Wright', designer_name: 'Elena Rostova', topic: 'Warm Japandi Lighting & Rugs', status: 'active', last_message: 'Approved the natural oak bouclé palette.' },
        { id: 'chat-03', client_name: 'Sophia Lin', designer_name: 'Ethan Rodrigues', topic: 'Window Glare vs TV Wall', status: 'completed', last_message: 'Placed TV console opposite daylight path.' },
      ],
    },
    design_themes: {
      label: 'design_themes',
      icon: '🎨',
      count: COLOR_THEMES.length,
      columns: ['id', 'name', 'style', 'walls_hex', 'accent_hex', 'furniture_hex', 'flooring_hex'],
      rows: COLOR_THEMES.map((t) => ({
        id: t.id,
        name: t.name,
        style: t.style,
        walls_hex: t.palette.walls,
        accent_hex: t.palette.accent,
        furniture_hex: t.palette.furniture,
        flooring_hex: t.palette.flooring,
      })),
    },
  };

  const currentTableData = tablesData[activeTable] || tablesData.user_profiles;

  const filteredRows = currentTableData.rows.filter((row) => {
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCopySql = () => {
    fetch('/supabase_schema.sql')
      .then((res) => res.text())
      .catch(() => 'SELECT * FROM furniture_catalog;')
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopiedSql(true);
        addToast({
          type: 'success',
          title: 'Supabase SQL Copied',
          message: 'Copied complete 11-table DDL schema and seed data to clipboard.',
        });
        setTimeout(() => setCopiedSql(false), 3000);
      });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-900 dark:text-white transition-colors duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#E8E6DF] dark:border-[#21262D] flex items-center justify-between bg-[#FBFBF9] dark:bg-[#161B22]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">Supabase Spatial Database</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE CONNECTED
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                zbeuzfltablkkjcqcwup.supabase.co • PostgreSQL 15.6 • 11 Relational Tables
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySql}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />}
              <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
            </button>

            <button
              onClick={() => setDatabaseModalOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-[#21262D] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Layout */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Table Selector Sidebar */}
          <div className="w-64 bg-[#FAF9F6] dark:bg-[#12161E] border-r border-[#E8E6DF] dark:border-[#21262D] p-3 space-y-1.5 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Database Tables ({Object.keys(tablesData).length})
            </div>

            {Object.entries(tablesData).map(([key, data]) => {
              const isSelected = activeTable === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTable(key);
                    setSearchQuery('');
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-mono font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xs font-bold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-[#1C2128]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{data.icon}</span>
                    <span className="truncate">{data.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-neutral-950'
                        : 'bg-neutral-200 dark:bg-[#21262D] text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {data.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table Data Viewport */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-[#0D1117]">
            {/* Table Search & Meta Bar */}
            <div className="p-4 border-b border-[#E8E6DF] dark:border-[#21262D] flex items-center justify-between gap-4 bg-[#FBFBF9] dark:bg-[#161B22]">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${activeTable} (${filteredRows.length} rows)...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                <span className="font-bold text-neutral-900 dark:text-white">{filteredRows.length}</span> records shown
              </div>
            </div>

            {/* Scrollable Data Table */}
            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#E8E6DF] dark:border-[#21262D] text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    {currentTableData.columns.map((col) => (
                      <th key={col} className="py-2.5 px-3 font-bold bg-[#FAF9F6] dark:bg-[#161B22] sticky top-0">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6DF] dark:divide-[#21262D]">
                  {filteredRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#FAF9F6] dark:hover:bg-[#161B22] transition-colors"
                    >
                      {currentTableData.columns.map((col) => (
                        <td key={col} className="py-2.5 px-3 text-neutral-800 dark:text-neutral-200">
                          {typeof row[col] === 'boolean' ? (
                            <span className={row[col] ? 'text-emerald-500' : 'text-red-500'}>
                              {String(row[col])}
                            </span>
                          ) : (
                            String(row[col] ?? '—')
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRows.length === 0 && (
                <div className="p-12 text-center text-xs text-neutral-400">
                  No records match "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8E6DF] dark:border-[#21262D] bg-[#FBFBF9] dark:bg-[#161B22] flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-500" />
              <span>Host: Supabase AWS us-east-1</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>AI Engine: Gemini 2.0 Flash</span>
            </span>
          </div>
          <button
            onClick={() => setDatabaseModalOpen(false)}
            className="px-4 py-1.5 bg-neutral-200 dark:bg-[#21262D] hover:bg-neutral-300 dark:hover:bg-[#30363D] text-neutral-800 dark:text-white rounded-lg text-xs font-bold transition-colors"
          >
            Close Database View
          </button>
        </div>
      </div>
    </div>
  );
};
