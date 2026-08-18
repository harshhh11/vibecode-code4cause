import React, { createContext, useContext, useState } from 'react';
import type { DesignerProfile } from '../types/designer';

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'wizard'
  | 'studio'
  | 'marketplace'
  | 'chat'
  | 'designer_dashboard'
  | 'saved_layouts'
  | 'settings';

export type StudioViewMode = '2d' | '3d';
export type Camera3DPreset = 'isometric' | 'top' | 'walkthrough';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message?: string;
  durationMs?: number;
}

interface UIContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  
  studioMode: StudioViewMode;
  setStudioMode: (mode: StudioViewMode) => void;
  
  camera3DPreset: Camera3DPreset;
  setCamera3DPreset: (preset: Camera3DPreset) => void;

  isWholeHome3D: boolean;
  setIsWholeHome3D: (val: boolean) => void;

  is360ImmersiveView: boolean;
  setIs360ImmersiveView: (val: boolean) => void;

  isAutoTour: boolean;
  setIsAutoTour: (val: boolean) => void;

  showWalkingPaths: boolean;
  setShowWalkingPaths: (val: boolean) => void;


  // Modals
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  generateLayoutsModalOpen: boolean;
  setGenerateLayoutsModalOpen: (open: boolean) => void;

  compareLayoutsModalOpen: boolean;
  setCompareLayoutsModalOpen: (open: boolean) => void;

  dimensionAdvisorModalOpen: boolean;
  setDimensionAdvisorModalOpen: (open: boolean) => void;

  designerProfileModalOpen: boolean;
  setDesignerProfileModalOpen: (open: boolean) => void;

  consultationModalOpen: boolean;
  setConsultationModalOpen: (open: boolean) => void;

  exportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;

  customFurnitureModalOpen: boolean;
  setCustomFurnitureModalOpen: (open: boolean) => void;

  databaseModalOpen: boolean;
  setDatabaseModalOpen: (open: boolean) => void;

  selectedDesigner: DesignerProfile | null;

  setSelectedDesigner: (designer: DesignerProfile | null) => void;

  // Layout sidebars
  leftSidebarCollapsed: boolean;
  setLeftSidebarCollapsed: (collapsed: boolean) => void;
  rightSidebarCollapsed: boolean;
  setRightSidebarCollapsed: (collapsed: boolean) => void;

  // Global Website Dark / Light Theme
  globalTheme: 'light' | 'dark';
  setGlobalTheme: (theme: 'light' | 'dark') => void;
  toggleGlobalTheme: () => void;

  // Right panel active tab in studio
  activeStudioTab: 'properties' | 'score' | 'themes' | 'paths' | 'ai_assistant';
  setActiveStudioTab: (tab: 'properties' | 'score' | 'themes' | 'paths' | 'ai_assistant') => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}


const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [studioMode, setStudioModeState] = useState<StudioViewMode>('2d');

  const [camera3DPreset, setCamera3DPreset] = useState<Camera3DPreset>('isometric');
  const [isWholeHome3D, setIsWholeHome3D] = useState<boolean>(false);
  const [is360ImmersiveView, setIs360ImmersiveView] = useState<boolean>(false);
  const [isAutoTour, setIsAutoTour] = useState<boolean>(false);
  const [showWalkingPaths, setShowWalkingPaths] = useState<boolean>(true);

  const setStudioMode = (mode: StudioViewMode) => {
    setStudioModeState(mode);
    if (mode === '2d') {
      setIs360ImmersiveView(false);
      setIsAutoTour(false);
    }
  };


  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState<boolean>(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState<boolean>(false);

  // Global Theme
  const [globalTheme, setGlobalThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('aera_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const setGlobalTheme = (theme: 'light' | 'dark') => {
    setGlobalThemeState(theme);
    localStorage.setItem('aera_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleGlobalTheme = () => {
    setGlobalTheme(globalTheme === 'light' ? 'dark' : 'light');
  };

  // Sync on initial load
  React.useEffect(() => {
    if (globalTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [globalTheme]);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [generateLayoutsModalOpen, setGenerateLayoutsModalOpen] = useState(false);
  const [compareLayoutsModalOpen, setCompareLayoutsModalOpen] = useState(false);
  const [dimensionAdvisorModalOpen, setDimensionAdvisorModalOpen] = useState(false);
  const [designerProfileModalOpen, setDesignerProfileModalOpen] = useState(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [customFurnitureModalOpen, setCustomFurnitureModalOpen] = useState(false);
  const [databaseModalOpen, setDatabaseModalOpen] = useState(false);

  const [selectedDesigner, setSelectedDesigner] = useState<DesignerProfile | null>(null);
  const [activeStudioTab, setActiveStudioTab] = useState<'properties' | 'score' | 'themes' | 'paths' | 'ai_assistant'>('properties');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, toast.durationMs || 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <UIContext.Provider
      value={{
        currentView,
        setCurrentView,
        studioMode,
        setStudioMode,
        camera3DPreset,
        setCamera3DPreset,
        isWholeHome3D,
        setIsWholeHome3D,
        is360ImmersiveView,
        setIs360ImmersiveView,
        isAutoTour,
        setIsAutoTour,
        showWalkingPaths,
        setShowWalkingPaths,

        leftSidebarCollapsed,
        setLeftSidebarCollapsed,
        rightSidebarCollapsed,
        setRightSidebarCollapsed,

        globalTheme,
        setGlobalTheme,
        toggleGlobalTheme,

        authModalOpen,
        setAuthModalOpen,
        generateLayoutsModalOpen,
        setGenerateLayoutsModalOpen,
        compareLayoutsModalOpen,
        setCompareLayoutsModalOpen,
        dimensionAdvisorModalOpen,
        setDimensionAdvisorModalOpen,
        designerProfileModalOpen,
        setDesignerProfileModalOpen,
        consultationModalOpen,
        setConsultationModalOpen,
        exportModalOpen,
        setExportModalOpen,
        customFurnitureModalOpen,
        setCustomFurnitureModalOpen,
        databaseModalOpen,
        setDatabaseModalOpen,
        selectedDesigner,
        setSelectedDesigner,
        activeStudioTab,
        setActiveStudioTab,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};


export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};
