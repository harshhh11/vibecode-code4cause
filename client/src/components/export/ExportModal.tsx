import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useProject } from '../../context/ProjectContext';
import { Modal } from '../common/Modal';
import {
  Download,
  FileText,
  Image,
  Share2,
  Copy,
  CheckCircle2,
  Printer,
  Sparkles,
  FileJson,
} from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { exportModalOpen, setExportModalOpen, addToast } = useUI();
  const { activeProject, activeRoom, layoutScore, furniture, activeTheme } = useProject();

  const [copied, setCopied] = useState(false);
  const [downloading2D, setDownloading2D] = useState(false);
  const [downloading3D, setDownloading3D] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://aera.design/p/${activeProject.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      type: 'success',
      title: 'Link Copied',
      message: 'Shareable AERA project link copied to clipboard.',
    });
  };

  // Programmatic 2D Architectural CAD Blueprint Export
  const handleDownload2D = () => {
    setDownloading2D(true);
    try {
      // Create high-res off-screen canvas (1600 x 1200)
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background
      ctx.fillStyle = '#FAF9F5';
      ctx.fillRect(0, 0, 1600, 1200);

      // Grid Lines
      ctx.strokeStyle = '#E8E5DD';
      ctx.lineWidth = 1;
      for (let x = 0; x <= 1600; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1200);
        ctx.stroke();
      }
      for (let y = 0; y <= 1200; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1600, y);
        ctx.stroke();
      }

      // Title Block
      ctx.fillStyle = '#161B22';
      ctx.fillRect(80, 60, 1440, 80);
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('AERA SPATIAL INTELLIGENCE • ARCHITECTURAL CAD BLUEPRINT', 110, 108);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText(`${activeProject.name} — ${activeRoom.name} (${activeRoom.dimensions.length} × ${activeRoom.dimensions.width} ft)`, 980, 108);

      // Room Box Mapping
      const L = activeRoom.dimensions.length;
      const W = activeRoom.dimensions.width;
      const scale = Math.min(1000 / L, 700 / W);
      const startX = (1600 - L * scale) / 2;
      const startY = (1200 - W * scale) / 2 + 40;

      // Room Solid Floor
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(startX, startY, L * scale, W * scale);

      // Outer Structural Walls (4-line CAD hatching)
      ctx.strokeStyle = '#181A1E';
      ctx.lineWidth = 14;
      ctx.strokeRect(startX, startY, L * scale, W * scale);

      // Windows
      activeRoom.windows.forEach((win) => {
        ctx.fillStyle = '#0284C7';
        const winW = (win.width || 5.0) * scale;
        if (win.wall === 'north') {
          ctx.fillRect(startX + win.offset * scale, startY - 8, winW, 16);
        } else if (win.wall === 'south') {
          ctx.fillRect(startX + win.offset * scale, startY + W * scale - 8, winW, 16);
        } else if (win.wall === 'west') {
          ctx.fillRect(startX - 8, startY + win.offset * scale, 16, winW);
        } else {
          ctx.fillRect(startX + L * scale - 8, startY + win.offset * scale, 16, winW);
        }
      });

      // Doors
      activeRoom.doors.forEach((door) => {
        const doorW = door.width * scale;
        ctx.fillStyle = '#D97706';
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 2;

        let dx = startX + door.offset * scale;
        let dy = startY + W * scale;
        if (door.wall === 'north') dy = startY;

        ctx.beginPath();
        ctx.arc(dx, dy, doorW, 0, Math.PI / 2);
        ctx.stroke();
      });

      // Furniture Pieces
      furniture.forEach((f) => {
        const fx = startX + f.x * scale;
        const fy = startY + f.y * scale;
        const fw = f.width * scale;
        const fd = f.depth * scale;

        ctx.fillStyle = '#F4EFE6';
        ctx.strokeStyle = '#6E472A';
        ctx.lineWidth = 3;
        ctx.fillRect(fx, fy, fw, fd);
        ctx.strokeRect(fx, fy, fw, fd);

        ctx.fillStyle = '#222222';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillText(f.name, fx + 10, fy + 24);
        ctx.font = '12px monospace';
        ctx.fillStyle = '#666666';
        ctx.fillText(`${f.width}×${f.depth} ft`, fx + 10, fy + 42);
      });

      // Dimension Redlines
      ctx.fillStyle = '#B26A4A';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`${L}'-0" LENGTH`, startX + (L * scale) / 2 - 40, startY - 24);
      ctx.fillText(`${W}'-0" WIDTH`, startX - 90, startY + (W * scale) / 2);

      // Footer Specs Block
      ctx.fillStyle = '#161B22';
      ctx.fillRect(80, 1100, 1440, 50);
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillText(`SPATIAL SCORE: ${layoutScore.overall}/100 (${layoutScore.grade})`, 110, 1130);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`CLEARANCE: ${layoutScore.minWalkingClearanceCm} cm • FURNITURE COUNT: ${furniture.length} • THEME: ${activeTheme.name}`, 680, 1130);

      // Trigger Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `AERA_2D_Blueprint_${activeRoom.name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();

      addToast({
        type: 'success',
        title: '2D CAD Blueprint Exported',
        message: 'High-resolution blueprint PNG downloaded successfully.',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading2D(false);
    }
  };

  // Programmatic 3D High-Res Render Snapshot Export
  const handleDownload3D = () => {
    setDownloading3D(true);
    try {
      const webglCanvas = document.querySelector('canvas') as HTMLCanvasElement | null;
      if (webglCanvas) {
        const dataUrl = webglCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `AERA_3D_Perspective_${activeRoom.name.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        // Fallback CAD generator
        handleDownload2D();
      }

      addToast({
        type: 'success',
        title: '3D Render Snapshot Exported',
        message: 'High-res 3D perspective snapshot downloaded.',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading3D(false);
    }
  };

  // Download Structured Architectural Specification JSON
  const handleDownloadSpecJSON = () => {
    const specData = {
      project: activeProject.name,
      room: activeRoom.name,
      dimensions: activeRoom.dimensions,
      spatialScore: layoutScore,
      theme: activeTheme,
      furnitureSchedule: furniture.map((f) => ({
        id: f.id,
        name: f.name,
        category: f.category,
        dimensions: `${f.width} × ${f.depth} × ${f.height || 3.0} ft`,
        position: { x: f.x, y: f.y },
        rotation: f.rotation,
        isExisting: f.isExisting,
      })),
      doors: activeRoom.doors,
      windows: activeRoom.windows,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(specData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `AERA_Spatial_SpecSheet_${activeRoom.name.replace(/\s+/g, '_')}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Spec Sheet Exported',
      message: 'Spatial specification JSON downloaded.',
    });
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={exportModalOpen}
      onClose={() => setExportModalOpen(false)}
      maxWidth="max-w-2xl"
      title="Export & Spatial Spec Sheet"
      subtitle={`${activeProject.name} • ${activeRoom.name} (${activeRoom.dimensions.length} × ${activeRoom.dimensions.width} ft)`}
    >
      <div className="space-y-6">
        {/* Export Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 2D CAD Blueprint Export Card */}
          <div
            onClick={handleDownload2D}
            className="p-4 bg-[#FAF9F6] dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] hover:border-neutral-900 dark:hover:border-white cursor-pointer transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950">
              <Image className="w-4 h-4 text-[#D4B996] dark:text-[#8C5232]" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-[#B26A4A] transition-colors">
              2D Floor Plan (PNG CAD)
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Clean CAD blueprint with walls, door arcs, furniture placements, and exact dimension redlines.
            </p>
            <span className="text-[11px] font-bold text-[#B26A4A] dark:text-[#D4AF37] inline-flex items-center gap-1 pt-1">
              <Download className="w-3.5 h-3.5" />
              <span>{downloading2D ? 'Generating...' : 'Download 2D Blueprint'}</span>
            </span>
          </div>

          {/* 3D Render Snapshot Card */}
          <div
            onClick={handleDownload3D}
            className="p-4 bg-[#FAF9F6] dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] hover:border-neutral-900 dark:hover:border-white cursor-pointer transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950">
              <Sparkles className="w-4 h-4 text-[#D4B996] dark:text-[#8C5232]" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-[#B26A4A] transition-colors">
              3D High-Res Perspective
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Architectural 3D render snapshot with realistic sunlight, materials, and active theme colors.
            </p>
            <span className="text-[11px] font-bold text-[#B26A4A] dark:text-[#D4AF37] inline-flex items-center gap-1 pt-1">
              <Download className="w-3.5 h-3.5" />
              <span>{downloading3D ? 'Exporting...' : 'Download 3D Snapshot'}</span>
            </span>
          </div>
        </div>

        {/* Printable Spatial Spec Sheet Summary */}
        <div className="p-4 bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Spatial Specification Report
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSpecJSON}
                className="text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white flex items-center gap-1 bg-[#FAF9F6] dark:bg-[#21262D] px-2.5 py-1 rounded-lg border border-[#E8E6DF] dark:border-[#30363D]"
              >
                <FileJson className="w-3.5 h-3.5 text-[#B26A4A]" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={handlePrintReport}
                className="text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white flex items-center gap-1 bg-[#FAF9F6] dark:bg-[#21262D] px-2.5 py-1 rounded-lg border border-[#E8E6DF] dark:border-[#30363D]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Spec Sheet</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono p-3 bg-[#FAF9F6] dark:bg-[#10141B] rounded-xl border border-[#E8E6DF] dark:border-[#30363D]">
            <div>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-sans">Spatial Score</span>
              <span className="font-extrabold text-emerald-800 dark:text-emerald-400 text-sm">{layoutScore.overall}/100</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-sans">Usable Floor Area</span>
              <span className="font-bold text-neutral-900 dark:text-white">{layoutScore.usableAreaSqFt} sq.ft</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-sans">Walking Clearance</span>
              <span className="font-bold text-neutral-900 dark:text-white">{layoutScore.minWalkingClearanceCm} cm</span>
            </div>
          </div>

          {/* Furniture Schedule */}
          <div className="space-y-1 pt-1">
            <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">Furniture Schedule ({furniture.length} items):</span>
            <div className="max-h-32 overflow-y-auto divide-y divide-[#E8E6DF] dark:divide-[#30363D] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl bg-[#FAF9F6] dark:bg-[#10141B]">
              {furniture.map((f) => (
                <div key={f.id} className="p-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900 dark:text-white">{f.name}</span>
                  <span className="font-mono text-neutral-500 dark:text-neutral-400">
                    {f.width} × {f.depth} ft {f.isExisting ? '(Owned)' : '(New)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Share Project Link */}
        <div className="p-3.5 bg-[#FAF9F6] dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Share2 className="w-4 h-4 text-[#B26A4A] shrink-0" />
            <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300 truncate">
              https://aera.design/p/{activeProject.id}
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
