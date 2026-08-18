import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useProject } from '../../context/ProjectContext';
import type { RoomType, HomeConfigType, DoorElement, WindowElement, ObstacleElement } from '../../types/project';
import { getWholeHomeRecommendation, getRoomDimensionRecommendation } from '../../utils/dimensionAdvisor';
import { COLOR_THEMES } from '../../data/colorThemes';
import {
  Home,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  DoorOpen,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';

export const CreateDesignWizard: React.FC = () => {
  const { setCurrentView, setStudioMode, addToast } = useUI();
  const { createProject, applyTheme } = useProject();

  const [step, setStep] = useState<number>(1);
  const [designType, setDesignType] = useState<'room' | 'home'>('home');

  const [totalAreaSqFt, setTotalAreaSqFt] = useState<number>(1200);
  const [homeConfig, setHomeConfig] = useState<HomeConfigType>('2BHK');
  const [homeDistribution, setHomeDistribution] = useState(
    getWholeHomeRecommendation(1200, '2BHK')
  );

  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>('master_bedroom');
  const [roomName, setRoomName] = useState<string>('Master Bedroom');
  const [length, setLength] = useState<number>(14);
  const [width, setWidth] = useState<number>(12);
  const [height, setHeight] = useState<number>(10);

  const [roomAdvice, setRoomAdvice] = useState(() =>
    getRoomDimensionRecommendation('master_bedroom', 1200)
  );

  const [doors, setDoors] = useState<DoorElement[]>([
    { id: 'd1', name: 'Entry Door', wall: 'south', offset: 2, width: 3.0, swing: 'inside_left' },
  ]);
  const [windows, setWindows] = useState<WindowElement[]>([
    { id: 'w1', name: 'North Window', wall: 'north', offset: 4.5, width: 5.0, height: 5.0, sillHeight: 3.0 },
  ]);
  const [obstacles, setObstacles] = useState<ObstacleElement[]>([
    { id: 'col1', name: 'Corner Column', type: 'column', x: 0, y: 0, width: 1.2, depth: 1.2 },
  ]);

  const [selectedThemeId, setSelectedThemeId] = useState<string>('theme-warm-minimal');

  const handleConfigChange = (cfg: HomeConfigType) => {
    setHomeConfig(cfg);
    setHomeDistribution(getWholeHomeRecommendation(totalAreaSqFt, cfg));
  };

  const handleAreaChange = (area: number) => {
    setTotalAreaSqFt(area);
    setHomeDistribution(getWholeHomeRecommendation(area, homeConfig));
  };

  const handleRoomTypeChange = (type: RoomType) => {
    setSelectedRoomType(type);
    const advice = getRoomDimensionRecommendation(type, totalAreaSqFt);
    setRoomAdvice(advice);
    setRoomName(advice.roomName);
    setLength(advice.recommendedLength);
    setWidth(advice.recommendedWidth);
  };

  const applyRecommendedDimensions = () => {
    setLength(roomAdvice.recommendedLength);
    setWidth(roomAdvice.recommendedWidth);
    addToast({
      type: 'success',
      title: 'AI Dimensions Applied',
      message: `Set ${roomAdvice.roomName} to ${roomAdvice.recommendedLength} × ${roomAdvice.recommendedWidth} ft (${roomAdvice.recommendedAreaSqFt} sq.ft).`,
    });
  };

  const addDoorItem = () => {
    const newDoor: DoorElement = {
      id: `d-${Date.now()}`,
      name: `Door ${doors.length + 1}`,
      wall: 'south',
      offset: 2,
      width: 3.0,
      swing: 'inside_left',
    };
    setDoors([...doors, newDoor]);
  };

  const addWindowItem = () => {
    const newWin: WindowElement = {
      id: `w-${Date.now()}`,
      name: `Window ${windows.length + 1}`,
      wall: 'north',
      offset: 3,
      width: 4.0,
      height: 4.5,
      sillHeight: 3.0,
    };
    setWindows([...windows, newWin]);
  };

  const addObstacleItem = () => {
    const newObs: ObstacleElement = {
      id: `obs-${Date.now()}`,
      name: `Pillar ${obstacles.length + 1}`,
      type: 'column',
      x: 0,
      y: 0,
      width: 1.0,
      depth: 1.0,
    };
    setObstacles([...obstacles, newObs]);
  };

  const finishAndLaunchStudio = () => {
    createProject({
      name: designType === 'home' ? `My ${homeConfig} Apartment` : `${roomName} Studio`,
      description: `${designType === 'home' ? `${totalAreaSqFt} sq.ft • Complete home layout` : `${length * width} sq.ft room`} with validated spatial intelligence.`,
      type: designType,
      totalAreaSqFt: designType === 'home' ? totalAreaSqFt : length * width,
      configType: designType === 'home' ? homeConfig : undefined,
      activeThemeId: selectedThemeId,
      rooms: [
        {
          id: `room-${Date.now()}`,
          name: roomName,
          type: selectedRoomType,
          dimensions: { length, width, height },
          doors,
          windows,
          obstacles,
          furnitureIds: [],
        },
      ],
    });

    applyTheme(selectedThemeId);
    setStudioMode('2d');
    setCurrentView('studio');

    addToast({
      type: 'success',
      title: 'Project Initialized',
      message: 'Opening 2D Studio workspace. Spatial grid & collision engine ready.',
    });
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Progress Bar & Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : setCurrentView('dashboard'))}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step > 1 ? 'Back' : 'Exit to Dashboard'}</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-900">Step {step} of 3</span>
            <span className="text-xs text-neutral-400">•</span>
            <span className="text-xs text-neutral-500 font-medium">
              {step === 1 ? 'Design Type & Area' : step === 2 ? 'Room Setup & Obstacles' : 'Style & Themes'}
            </span>
          </div>
        </div>

        <div className="w-full bg-[#E8E6DF] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-neutral-900 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Choose Design Scope */}
      {step === 1 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold text-neutral-950">What are you designing?</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Select whether you want to design a single specialized room or plan an entire home distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              onClick={() => setDesignType('room')}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                designType === 'room'
                  ? 'border-neutral-950 bg-white ring-2 ring-neutral-950/10 shadow-lg'
                  : 'border-[#E8E6DF] bg-white hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF4ED] flex items-center justify-center text-[#B26A4A]">
                  <Layers className="w-6 h-6" />
                </div>
                {designType === 'room' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </div>
              <h3 className="text-base font-bold text-neutral-900">Option A — Design a Room</h3>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                For users who want to design and optimize a single space like a Master Bedroom, Living Room, or Home Office.
              </p>
            </div>

            <div
              onClick={() => setDesignType('home')}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                designType === 'home'
                  ? 'border-neutral-950 bg-white ring-2 ring-neutral-950/10 shadow-lg'
                  : 'border-[#E8E6DF] bg-white hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF4ED] flex items-center justify-center text-[#B26A4A]">
                  <Home className="w-6 h-6" />
                </div>
                {designType === 'home' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </div>
              <h3 className="text-base font-bold text-neutral-900">Option B — Design My Home</h3>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                For whole-apartment spatial planning (1 BHK, 2 BHK, 3 BHK, 4 BHK) with Level 1 AI space distribution.
              </p>
            </div>
          </div>

          {designType === 'home' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E8E6DF] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Step 1 — Total Home Area & Configuration</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Enter your carpet area in sq.ft and select apartment layout.</p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#F5F4EF] px-3 py-1.5 rounded-lg text-neutral-800 border border-[#E8E6DF]">
                  {totalAreaSqFt} sq.ft
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                  <span>Carpet Area</span>
                  <span className="font-mono text-neutral-900">{totalAreaSqFt} sq.ft</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="3500"
                  step="50"
                  value={totalAreaSqFt}
                  onChange={(e) => handleAreaChange(Number(e.target.value))}
                  className="w-full accent-neutral-900 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                  <span>500 sq.ft</span>
                  <span>1200 sq.ft (Standard 2BHK)</span>
                  <span>3500 sq.ft</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700 block">Apartment Typology</label>
                <div className="grid grid-cols-5 gap-2">
                  {(['1BHK', '2BHK', '3BHK', '4BHK', 'custom'] as HomeConfigType[]).map((cfg) => (
                    <button
                      key={cfg}
                      type="button"
                      onClick={() => handleConfigChange(cfg)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                        homeConfig === cfg
                          ? 'bg-neutral-950 text-white shadow-xs'
                          : 'bg-[#F5F4EF] text-neutral-700 hover:bg-[#ECE8DF]'
                      }`}
                    >
                      {cfg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E6DF] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B26A4A]" />
                    <h5 className="text-xs font-bold text-neutral-900">Level 1 AI Recommended Space Distribution</h5>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium">User remains in full control</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {homeDistribution.distributions.map((item) => (
                    <div
                      key={item.type}
                      className="p-3.5 bg-[#FAF9F6] rounded-xl border border-[#E8E6DF] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900">{item.name}</span>
                        <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {item.areaSqFt} sq.ft
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-neutral-600">
                        {item.recommendedDims.length} × {item.recommendedDims.width} ft ({item.percentage}%)
                      </p>
                      <p className="text-[10px] text-neutral-500 line-clamp-2 leading-relaxed">{item.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <span>Continue to Room Setup</span>
              <ArrowRight className="w-4 h-4 text-[#D4B996]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Room Setup */}
      {step === 2 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold text-neutral-950">Room Setup & Structural Boundaries</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Configure room dimensions, doors, windows, and obstacles with live interactive blueprint feedback.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { type: 'master_bedroom', label: 'Master Bedroom' },
              { type: 'living', label: 'Living Room' },
              { type: 'bedroom_2', label: 'Bedroom 2 / Guest' },
              { type: 'kitchen', label: 'Kitchen' },
              { type: 'dining', label: 'Dining Area' },
              { type: 'study', label: 'Study / Office' },
              { type: 'bathroom', label: 'Bathroom' },
              { type: 'balcony', label: 'Balcony' },
            ].map((r) => (
              <button
                key={r.type}
                type="button"
                onClick={() => handleRoomTypeChange(r.type as RoomType)}
                className={`p-3 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between ${
                  selectedRoomType === r.type
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-white border border-[#E8E6DF] text-neutral-700 hover:bg-[#F5F4EF]'
                }`}
              >
                <span>{r.label}</span>
                {selectedRoomType === r.type && <span className="w-1.5 h-1.5 rounded-full bg-[#D4B996]" />}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#E5D4C4] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B26A4A]" />
                    <span className="text-xs font-bold text-[#8C5232]">Level 2 AI Dimension Advisor</span>
                  </div>
                  <button
                    onClick={applyRecommendedDimensions}
                    className="px-3 py-1 bg-[#B26A4A] hover:bg-[#995536] text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    ✨ Apply {roomAdvice.recommendedLength} × {roomAdvice.recommendedWidth} ft
                  </button>
                </div>
                <p className="text-xs text-neutral-800 leading-relaxed">{roomAdvice.rationale}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {roomAdvice.keyFurnitureFit.map((f, i) => (
                    <span key={i} className="text-[10px] bg-white/80 border border-[#E5D4C4] px-2 py-0.5 rounded-md text-neutral-700 font-medium">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8E6DF] space-y-4">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Room Dimensions</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Length (X axis)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="6"
                        max="40"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-[#E8E6DF] text-xs font-mono font-bold text-neutral-900"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-mono">ft</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Width (Y axis)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="6"
                        max="40"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-[#E8E6DF] text-xs font-mono font-bold text-neutral-900"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-mono">ft</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Ceiling Height</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="8"
                        max="16"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-[#E8E6DF] text-xs font-mono font-bold text-neutral-900"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-mono">ft</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 font-medium">
                  <span>Total Calculated Floor Area:</span>
                  <span className="font-mono font-bold text-neutral-950 text-sm">{length * width} sq.ft</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8E6DF] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Doors & Windows</h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={addDoorItem}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-[#F5F4EF] hover:bg-[#EAE6DD] text-neutral-800 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Door</span>
                    </button>
                    <button
                      type="button"
                      onClick={addWindowItem}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-[#F5F4EF] hover:bg-[#EAE6DD] text-neutral-800 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Window</span>
                    </button>
                    <button
                      type="button"
                      onClick={addObstacleItem}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-[#F5F4EF] hover:bg-[#EAE6DD] text-neutral-800 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Column</span>
                    </button>
                  </div>
                </div>

                {doors.map((door, idx) => (
                  <div key={door.id} className="flex items-center gap-2 p-2.5 bg-[#FAF9F6] rounded-xl border border-[#E8E6DF] text-xs">
                    <DoorOpen className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-neutral-900">{door.name}</span>
                    <select
                      value={door.wall}
                      onChange={(e) => {
                        const updated = [...doors];
                        updated[idx].wall = e.target.value as any;
                        setDoors(updated);
                      }}
                      className="px-2 py-1 rounded bg-white border border-[#E8E6DF] text-xs"
                    >
                      <option value="north">North Wall</option>
                      <option value="south">South Wall</option>
                      <option value="east">East Wall</option>
                      <option value="west">West Wall</option>
                    </select>
                    <span className="text-neutral-500 font-mono">Width: {door.width}ft</span>
                    <button
                      onClick={() => setDoors(doors.filter((_, i) => i !== idx))}
                      className="ml-auto text-neutral-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E8E6DF] space-y-3 sticky top-20">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Live Structure Blueprint</h4>
                <span className="font-mono text-xs font-bold text-neutral-700">{length} × {width} ft</span>
              </div>

              <div className="h-64 bg-blueprint-grid rounded-xl border border-[#E0DCD3] relative p-4 flex items-center justify-center overflow-hidden">
                <div
                  className="border-4 border-neutral-900 bg-white/80 relative transition-all duration-300 rounded-sm shadow-sm"
                  style={{
                    width: `${Math.min(260, length * 16)}px`,
                    height: `${Math.min(200, width * 16)}px`,
                  }}
                >
                  {windows.filter((w) => w.wall === 'north').map((w) => (
                    <div key={w.id} className="absolute -top-1.5 left-1/3 w-16 h-2 bg-blue-500 border border-neutral-900" />
                  ))}

                  {doors.filter((d) => d.wall === 'south').map((d) => (
                    <div key={d.id} className="absolute -bottom-1.5 left-6 w-12 h-2 bg-amber-500 border border-neutral-900" />
                  ))}

                  {obstacles.map((o) => (
                    <div key={o.id} className="absolute top-0 left-0 w-4 h-4 bg-neutral-800" />
                  ))}

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                    <span className="text-xs font-bold text-neutral-800">{roomName}</span>
                    <span className="font-mono text-[10px] text-neutral-500">{length * width} sq.ft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-3 border border-[#E8E6DF] hover:bg-[#F5F4EF] rounded-xl text-xs font-semibold text-neutral-700 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <span>Continue to Style & Themes</span>
              <ArrowRight className="w-4 h-4 text-[#D4B996]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Style Themes */}
      {step === 3 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold text-neutral-950">Select Architectural Theme</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Choose an AI-recommended aesthetic palette. This will immediately style your 2D and 3D studio view.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COLOR_THEMES.map((theme) => {
              const isSelected = selectedThemeId === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all overflow-hidden space-y-3 ${
                    isSelected
                      ? 'border-neutral-950 ring-2 ring-neutral-950/10 shadow-lg'
                      : 'border-[#E8E6DF] hover:border-neutral-400'
                  }`}
                >
                  <div className="relative h-32 rounded-xl overflow-hidden bg-[#F5F4EF]">
                    <img src={theme.previewImage} alt={theme.name} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-neutral-950 text-white p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-[#D4B996]" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-neutral-900">{theme.name}</h4>
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                        {theme.style}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{theme.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.walls }} title={`Walls: ${theme.palette.wallsName}`} />
                    <span className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.accent }} title={`Accent: ${theme.palette.accentName}`} />
                    <span className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.furniture }} title={`Furniture: ${theme.palette.furnitureName}`} />
                    <span className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.curtains }} title={`Curtains: ${theme.palette.curtainsName}`} />
                    <span className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: theme.palette.flooring }} title={`Flooring: ${theme.palette.flooringName}`} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-3 border border-[#E8E6DF] hover:bg-[#F5F4EF] rounded-xl text-xs font-semibold text-neutral-700 transition-colors"
            >
              Back
            </button>
            <button
              onClick={finishAndLaunchStudio}
              className="flex items-center gap-2.5 px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-xl transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#D4B996]" />
              <span>Launch Design Studio</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
