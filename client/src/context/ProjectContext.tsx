import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { Project, RoomData, Dimension2D, DoorElement, WindowElement, ObstacleElement } from '../types/project';
import type { FurnitureItem } from '../types/furniture';
import type { LayoutScore, ConflictWarning, WalkingPathSegment, GeneratedLayoutOption } from '../types/layout';
import type { ColorTheme, ColorPalette } from '../types/theme';

import { SAMPLE_PROJECTS, SAMPLE_ROOM_FURNITURE } from '../data/sampleProjects';
import { COLOR_THEMES } from '../data/colorThemes';
import { computeLayoutScoreAndConflicts } from '../utils/layoutScorer';
import { calculateWalkingPaths } from '../utils/walkingPathEngine';
import { optimizeRoomLayoutIntelligently } from '../utils/intelligentAutoOptimizer';
import confetti from 'canvas-confetti';


interface WhatIfAnalysisState {
  isAnalyzing: boolean;
  scoreBefore: number;
  scoreAfter: number;
  clearanceBeforeCm: number;
  clearanceAfterCm: number;
  usableAreaBeforeSqFt: number;
  usableAreaAfterSqFt: number;
}

interface ProjectContextType {
  projects: Project[];
  activeProject: Project;
  activeRoom: RoomData;
  activeTheme: ColorTheme;
  furniture: FurnitureItem[];
  selectedFurnitureId: string | null;
  selectedDoorId: string | null;
  
  layoutScore: LayoutScore;
  conflicts: ConflictWarning[];
  walkingPaths: WalkingPathSegment[];
  whatIfState: WhatIfAnalysisState;
  
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;

  selectProject: (projectId: string) => void;
  selectRoom: (roomId: string) => void;
  setSelectedFurnitureId: (id: string | null) => void;
  setSelectedDoorId: (id: string | null) => void;
  selectedWindowId: string | null;
  setSelectedWindowId: (id: string | null) => void;

  addFurniture: (item: Omit<FurnitureItem, 'id'>) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  removeFurniture: (id: string) => void;
  duplicateFurniture: (id: string) => void;
  clearFurniture: () => void;

  updateRoomDimensions: (dims: Dimension2D) => void;
  addDoor: (door: Omit<DoorElement, 'id'>) => void;
  updateDoor: (doorId: string, updates: Partial<DoorElement>) => void;
  removeDoor: (doorId: string) => void;
  addWindow: (win: Omit<WindowElement, 'id'>) => void;
  updateWindow: (winId: string, updates: Partial<WindowElement>) => void;
  removeWindow: (winId: string) => void;
  addObstacle: (obs: Omit<ObstacleElement, 'id'>) => void;
  removeObstacle: (obsId: string) => void;


  applyTheme: (themeId: string) => void;
  customThemes: ColorTheme[];
  applyCustomPalette: (palette: ColorPalette, name?: string) => void;
  applyLayout: (layout: GeneratedLayoutOption) => void;
  optimizeConflictAutomatically: (conflictId?: string) => void;


  createProject: (newProject: Partial<Project>, initialFurniture?: FurnitureItem[]) => string;
  saveVersion: (note?: string) => void;
  restoreVersion: (versionId: string) => void;
  setExistingFurnitureMode: (enabled: boolean) => void;
}


const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(SAMPLE_PROJECTS[0].id);
  const [activeRoomId, setActiveRoomId] = useState<string>(SAMPLE_PROJECTS[0].rooms[0].id);
  
  const [furnitureMap, setFurnitureMap] = useState<Record<string, FurnitureItem[]>>({
    'room-master-bed': SAMPLE_ROOM_FURNITURE['room-master-bed'] || [],
    'room-living': SAMPLE_ROOM_FURNITURE['room-living'] || [],
  });

  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);
  const [selectedDoorId, setSelectedDoorId] = useState<string | null>(null);
  const [selectedWindowId, setSelectedWindowId] = useState<string | null>(null);
  const [customThemes, setCustomThemes] = useState<ColorTheme[]>([]);

  const [history, setHistory] = useState<Array<Record<string, FurnitureItem[]>>>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  const activeRoom = useMemo(() => {
    return (
      activeProject.rooms.find((r) => r.id === activeRoomId) ||
      activeProject.rooms[0] || {
        id: 'default-room',
        name: 'Master Bedroom',
        type: 'master_bedroom' as const,
        dimensions: { length: 14, width: 12, height: 10 },
        doors: [{ id: 'd1', name: 'Entry Door', wall: 'south' as const, offset: 2, width: 3, swing: 'inside_left' as const }],
        windows: [{ id: 'w1', name: 'Window', wall: 'north' as const, offset: 4.5, width: 5, height: 5, sillHeight: 3 }],
        obstacles: [],
        furnitureIds: [],
      }
    );
  }, [activeProject, activeRoomId]);

  const activeTheme = useMemo(() => {
    return (
      customThemes.find((t) => t.id === activeProject.activeThemeId) ||
      COLOR_THEMES.find((t) => t.id === activeProject.activeThemeId) ||
      COLOR_THEMES[0]
    );
  }, [activeProject.activeThemeId, customThemes]);


  const currentFurniture = useMemo(() => {
    return furnitureMap[activeRoom.id] || [];
  }, [furnitureMap, activeRoom.id]);

  const { score: layoutScore, conflicts } = useMemo(() => {
    return computeLayoutScoreAndConflicts(
      activeRoom.dimensions,
      activeRoom.doors,
      activeRoom.windows,
      activeRoom.obstacles,
      currentFurniture
    );
  }, [activeRoom, currentFurniture]);

  const walkingAnalysis = useMemo(() => {
    return calculateWalkingPaths(
      activeRoom.dimensions,
      activeRoom.doors,
      currentFurniture
    );
  }, [activeRoom, currentFurniture]);

  const [previousScore, setPreviousScore] = useState<number>(layoutScore.overall);
  const [previousClearance, setPreviousClearance] = useState<number>(layoutScore.minWalkingClearanceCm);

  const whatIfState: WhatIfAnalysisState = useMemo(() => {
    return {
      isAnalyzing: true,
      scoreBefore: previousScore,
      scoreAfter: layoutScore.overall,
      clearanceBeforeCm: previousClearance,
      clearanceAfterCm: layoutScore.minWalkingClearanceCm,
      usableAreaBeforeSqFt: layoutScore.usableAreaSqFt,
      usableAreaAfterSqFt: layoutScore.usableAreaSqFt,
    };
  }, [previousScore, previousClearance, layoutScore]);

  const pushHistory = useCallback(
    (newMap: Record<string, FurnitureItem[]>) => {
      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        return [...next, newMap];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const undo = () => {
    if (historyIndex > 0) {
      const prevMap = history[historyIndex - 1];
      setFurnitureMap(prevMap);
      setHistoryIndex((i) => i - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextMap = history[historyIndex + 1];
      setFurnitureMap(nextMap);
      setHistoryIndex((i) => i + 1);
    }
  };

  const addFurniture = (item: Omit<FurnitureItem, 'id'>) => {
    setPreviousScore(layoutScore.overall);
    setPreviousClearance(layoutScore.minWalkingClearanceCm);
    
    const id = `f-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newItem: FurnitureItem = { ...item, id };
    
    setFurnitureMap((prev) => {
      const roomList = prev[activeRoom.id] || [];
      const updated = { ...prev, [activeRoom.id]: [...roomList, newItem] };
      pushHistory(updated);
      return updated;
    });
    setSelectedFurnitureId(id);
  };

  const updateFurniture = (id: string, updates: Partial<FurnitureItem>) => {
    setFurnitureMap((prev) => {
      const roomList = prev[activeRoom.id] || [];
      const updated = {
        ...prev,
        [activeRoom.id]: roomList.map((f) => (f.id === id ? { ...f, ...updates } : f)),
      };
      return updated;
    });
  };

  const removeFurniture = (id: string) => {
    setFurnitureMap((prev) => {
      const roomList = prev[activeRoom.id] || [];
      const updated = {
        ...prev,
        [activeRoom.id]: roomList.filter((f) => f.id !== id),
      };
      pushHistory(updated);
      return updated;
    });
    if (selectedFurnitureId === id) setSelectedFurnitureId(null);
  };

  const duplicateFurniture = (id: string) => {
    const item = currentFurniture.find((f) => f.id === id);
    if (!item) return;
    const duplicated: Omit<FurnitureItem, 'id'> = {
      ...item,
      x: Math.min(activeRoom.dimensions.length - item.width, item.x + 1.0),
      y: Math.min(activeRoom.dimensions.width - item.depth, item.y + 1.0),
      name: `${item.name} (Copy)`,
    };
    addFurniture(duplicated);
  };

  const clearFurniture = () => {
    setFurnitureMap((prev) => {
      const updated = { ...prev, [activeRoom.id]: [] };
      pushHistory(updated);
      return updated;
    });
    setSelectedFurnitureId(null);
  };

  const updateRoomDimensions = (dims: Dimension2D) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          rooms: proj.rooms.map((r) => (r.id === activeRoom.id ? { ...r, dimensions: dims } : r)),
        };
      })
    );
  };

  const addDoor = (door: Omit<DoorElement, 'id'>) => {
    const id = `door-${Date.now()}`;
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          rooms: proj.rooms.map((r) =>
            r.id === activeRoom.id ? { ...r, doors: [...r.doors, { ...door, id }] } : r
          ),
        };
      })
    );
  };

  const updateDoor = (doorId: string, updates: Partial<DoorElement>) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          rooms: proj.rooms.map((r) =>
            r.id === activeRoom.id
              ? {
                  ...r,
                  doors: r.doors.map((d) => (d.id === doorId ? { ...d, ...updates } : d)),
                }
              : r
          ),
        };
      })
    );
  };

  const removeDoor = (doorId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          rooms: proj.rooms.map((r) =>
            r.id === activeRoom.id ? { ...r, doors: r.doors.filter((d) => d.id !== doorId) } : r
          ),
        };
      })
    );
    if (selectedDoorId === doorId) setSelectedDoorId(null);
  };

  const addWindow = (win: Omit<WindowElement, 'id'>) => {
    const id = `win-${Date.now()}`;
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          rooms: proj.rooms.map((r) =>
            r.id === activeRoom.id ? { ...r, windows: [...r.windows, { ...win, id }] } : r
          ),
        };
      })
    );
  };

  const updateWindow = (winId: string, updates: Partial<WindowElement>) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          rooms: proj.rooms.map((r) =>
            r.id === activeRoom.id
              ? {
                  ...r,
                  windows: r.windows.map((w) => (w.id === winId ? { ...w, ...updates } : w)),
                }
              : r
          ),
        };
      })
    );
  };

  const removeWindow = (winId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          rooms: proj.rooms.map((r) =>
            r.id === activeRoom.id ? { ...r, windows: r.windows.filter((w) => w.id !== winId) } : r
          ),
        };
      })
    );
  };


  const addObstacle = (obs: Omit<ObstacleElement, 'id'>) => {
    const id = `obs-${Date.now()}`;
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          rooms: proj.rooms.map((r) =>
            r.id === activeRoom.id ? { ...r, obstacles: [...r.obstacles, { ...obs, id }] } : r
          ),
        };
      })
    );
  };

  const removeObstacle = (obsId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          rooms: proj.rooms.map((r) =>
            r.id === activeRoom.id ? { ...r, obstacles: r.obstacles.filter((o) => o.id !== obsId) } : r
          ),
        };
      })
    );
  };

  const applyTheme = (themeId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, activeThemeId: themeId } : p))
    );
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#B26A4A', '#6E472A', '#D4B996', '#FAF8F5'],
    });
  };

  const applyCustomPalette = (palette: ColorPalette, name = 'Custom Palette') => {
    const newThemeId = `custom-theme-${Date.now()}`;
    const newTheme: ColorTheme = {
      id: newThemeId,
      name,
      subtitle: 'Bespoke Architectural Palette',
      style: 'modern',
      palette,
      floorMaterial: 'light_oak',
      wallFinish: 'matte',
      aiRationale: 'Custom architectural color balance designed by user.',
      recommendedLighting: 'Warm 2700K',
      previewImage: '',
    };

    setCustomThemes((prev) => [newTheme, ...prev]);
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, activeThemeId: newThemeId } : p))
    );

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: [palette.walls, palette.accent, palette.furniture, palette.curtains, palette.flooring],
    });
  };


  const applyLayout = (layout: GeneratedLayoutOption) => {
    setPreviousScore(layoutScore.overall);
    setPreviousClearance(layoutScore.minWalkingClearanceCm);

    setFurnitureMap((prev) => {
      const updated = { ...prev, [activeRoom.id]: layout.furniture };
      pushHistory(updated);
      return updated;
    });

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#16A34A', '#22C55E', '#86EFAC', '#FAF8F5'],
    });
  };

  const optimizeConflictAutomatically = (_conflictId?: string) => {
    setPreviousScore(layoutScore.overall);
    setPreviousClearance(layoutScore.minWalkingClearanceCm);

    const optimized = optimizeRoomLayoutIntelligently(activeRoom, currentFurniture);
    setFurnitureMap((prev) => {
      const updated = { ...prev, [activeRoom.id]: optimized };
      pushHistory(updated);
      return updated;
    });

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#16A34A', '#B26A4A', '#FAF8F5'],
    });
  };


  const selectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    const proj = projects.find((p) => p.id === projectId);
    if (proj && proj.rooms.length > 0) {
      setActiveRoomId(proj.rooms[0].id);
    }
  };

  const selectRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setSelectedFurnitureId(null);
  };

  const setExistingFurnitureMode = (enabled: boolean) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, isExistingFurnitureMode: enabled } : p))
    );
  };

  const createProject = (newProject: Partial<Project>, initialFurniture?: FurnitureItem[]): string => {
    const id = `proj-${Date.now()}`;
    const initialRoomId = `room-${Date.now()}-1`;
    const defaultRoom: RoomData = {
      id: initialRoomId,
      name: newProject.type === 'home' ? 'Master Bedroom' : (newProject.name || 'Main Room'),
      type: 'master_bedroom',
      dimensions: { length: 14, width: 12, height: 10 },
      doors: [{ id: `d-${Date.now()}`, name: 'Entry Door', wall: 'south', offset: 2, width: 3, swing: 'inside_left' }],
      windows: [{ id: `w-${Date.now()}`, name: 'Window', wall: 'north', offset: 4.5, width: 5, height: 5, sillHeight: 3 }],
      obstacles: [],
      furnitureIds: [],
    };

    const project: Project = {
      id,
      name: newProject.name || 'New Architectural Space',
      description: newProject.description || 'Custom spatial layout configuration.',
      type: newProject.type || 'room',
      totalAreaSqFt: newProject.totalAreaSqFt || (newProject.type === 'home' ? 1200 : 168),
      configType: newProject.configType || (newProject.type === 'home' ? '2BHK' : undefined),
      activeRoomId: initialRoomId,
      activeThemeId: 'theme-warm-minimal',
      layoutScore: 88,
      lastEdited: 'Just now',
      createdAt: new Date().toISOString().split('T')[0],
      rooms: newProject.rooms && newProject.rooms.length > 0 ? newProject.rooms : [defaultRoom],
      versions: [{ id: `v-${Date.now()}`, name: 'Version 1 (Draft)', timestamp: 'Just now', layoutScore: 88 }],
    };

    setProjects((prev) => [project, ...prev]);
    setActiveProjectId(id);
    setActiveRoomId(project.rooms[0].id);

    if (initialFurniture && initialFurniture.length > 0) {
      setFurnitureMap((prev) => ({
        ...prev,
        [project.rooms[0].id]: initialFurniture,
      }));
    }

    return id;
  };

  const saveVersion = (note = 'Manual Save') => {
    const newVersion = {
      id: `v-${Date.now()}`,
      name: `Version ${activeProject.versions.length + 1} (${note})`,
      timestamp: 'Just now',
      layoutScore: layoutScore.overall,
    };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id ? { ...p, versions: [newVersion, ...p.versions], lastEdited: 'Just now' } : p
      )
    );
  };

  const restoreVersion = (_versionId: string) => {
    saveVersion('Restored version');
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        activeRoom,
        activeTheme,
        furniture: currentFurniture,
        selectedFurnitureId,
        selectedDoorId,
        layoutScore,
        conflicts,
        walkingPaths: walkingAnalysis.paths,
        whatIfState,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        undo,
        redo,
        selectProject,
        selectRoom,
        setSelectedFurnitureId,
        setSelectedDoorId,
        selectedWindowId,
        setSelectedWindowId,
        addFurniture,

        updateFurniture,
        removeFurniture,
        duplicateFurniture,
        clearFurniture,
        updateRoomDimensions,
        addDoor,
        updateDoor,
        removeDoor,
        addWindow,
        updateWindow,
        removeWindow,
        addObstacle,
        removeObstacle,

        applyTheme,
        customThemes,
        applyCustomPalette,
        applyLayout,
        optimizeConflictAutomatically,

        createProject,
        saveVersion,
        restoreVersion,
        setExistingFurnitureMode,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};
