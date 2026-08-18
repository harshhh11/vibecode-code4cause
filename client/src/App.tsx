import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { UIProvider, useUI } from './context/UIContext';
import { ProjectProvider } from './context/ProjectContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { LandingPage } from './components/landing/LandingPage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { DesignerDashboard } from './components/dashboard/DesignerDashboard';
import { CreateDesignWizard } from './components/wizard/CreateDesignWizard';
import { StudioLayout } from './components/studio/StudioLayout';
import { DesignerMarketplace } from './components/marketplace/DesignerMarketplace';
import { PrivateChatView } from './components/messenger/PrivateChatView';
import { SavedLayoutsView } from './components/saved/SavedLayoutsView';
import { ProfileSettingsView } from './components/settings/ProfileSettingsView';

// Modals
import { AuthModal } from './components/auth/AuthModal';
import { GenerateLayoutsModal } from './components/layoutsModal/GenerateLayoutsModal';
import { LayoutComparisonGrid } from './components/layoutsModal/LayoutComparisonGrid';
import { DesignerProfileModal } from './components/marketplace/DesignerProfileModal';
import { ConsultationModal } from './components/marketplace/ConsultationModal';
import { ExportModal } from './components/export/ExportModal';
import { CustomFurnitureModal } from './components/studio/CustomFurnitureModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainAppContent: React.FC = () => {
  const { currentView, globalTheme } = useUI();

  // If landing view, show standalone Landing Page without the app shell sidebar
  if (currentView === 'landing') {
    return (
      <div className={globalTheme === 'dark' ? 'dark' : ''}>
        <LandingPage />
        <AuthModal />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen ${
        globalTheme === 'dark'
          ? 'dark bg-[#0D1117] text-neutral-100'
          : 'bg-[#FBFBF9] text-[#171717]'
      } selection:bg-[#EAE4DC] transition-colors duration-200`}
    >
      {/* Global Sidebar Navigation */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FBFBF9] dark:bg-[#0D1117]">
        {/* Top App Bar */}
        <TopNav />

        {/* Dynamic Route View */}
        <main className="flex-1 overflow-y-auto relative bg-[#FBFBF9] dark:bg-[#0D1117]">
          {currentView === 'dashboard' && <UserDashboard />}
          {currentView === 'designer_dashboard' && <DesignerDashboard />}
          {currentView === 'wizard' && <CreateDesignWizard />}
          {currentView === 'studio' && <StudioLayout />}
          {currentView === 'marketplace' && <DesignerMarketplace />}
          {currentView === 'chat' && <PrivateChatView />}
          {currentView === 'saved_layouts' && <SavedLayoutsView />}
          {currentView === 'settings' && <ProfileSettingsView />}
        </main>
      </div>



      {/* Global Modals & Notifications */}
      <AuthModal />
      <GenerateLayoutsModal />
      <LayoutComparisonGrid />
      <DesignerProfileModal />
      <ConsultationModal />
      <ExportModal />
      <CustomFurnitureModal />
      <ToastContainer />
    </div>


  );
};

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <ProjectProvider>
          <MainAppContent />
        </ProjectProvider>
      </UIProvider>
    </AuthProvider>
  );
}
