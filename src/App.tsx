import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TopAuthModal } from './components/TopAuthModal';
import { HomePage } from './components/HomePage';
import { MatchingWizard } from './components/MatchingWizard';
import { MatchResultsView } from './components/MatchResultsView';
import { SchemeDetailView } from './components/SchemeDetailView';
import { BrowseSchemesView } from './components/BrowseSchemesView';
import { IndiaStateExplorer } from './components/IndiaStateExplorer';
import { SchemeCompareView } from './components/SchemeCompareView';
import { ApplicationsDashboard } from './components/ApplicationsDashboard';
import { AskUdyamSetuAI } from './components/AskUdyamSetuAI';
import { TrustCenterView } from './components/TrustCenterView';
import { AdminGovernanceView } from './components/AdminGovernanceView';

import { MotionLab } from './components/motion/MotionLab';
import { MotionProvider } from './motion/MotionProvider';
import { ScrollProgress } from './components/motion/ScrollProgress';
import { PageTransition } from './components/motion/PageTransition';
import { SharedElementProvider } from './components/motion/SharedElement';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import { ProfileView } from './components/ProfileView';

const MainLayout: React.FC = () => {
  const { activeView, auth } = useApp();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Show citizen sign-in modal on first load if not authenticated and not explicitly dismissed
  useEffect(() => {
    const hasSeenLogin = sessionStorage.getItem('udyamsetu_seen_login');
    if (!hasSeenLogin && !auth.isAuthenticated) {
      setAuthModalMode('login');
      setIsLoginModalOpen(true);
      sessionStorage.setItem('udyamsetu_seen_login', 'true');
    }
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage />;
      case 'match':
        return <MatchingWizard />;
      case 'results':
        return <MatchResultsView />;
      case 'schemes':
        return <BrowseSchemesView />;
      case 'scheme-detail':
        return <SchemeDetailView />;
      case 'states':
        return <IndiaStateExplorer />;
      case 'compare':
        return <SchemeCompareView />;
      case 'dashboard':
        return <ApplicationsDashboard />;
      case 'profile':
        return <ProfileView />;
      case 'ask':
        return <AskUdyamSetuAI />;
      case 'how-it-works':
        return <TrustCenterView />;
      case 'admin':
        return <AdminGovernanceView />;
      case 'motion-lab':
        return <MotionLab />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#0F172A] relative">
      {/* Global Reading Scroll Progress */}
      <ScrollProgress />

      {/* Top Citizen Sign In & Register Modal Experience */}
      <TopAuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Global Header with Tricolour Accent Strip */}
      <Header
        onOpenLogin={(mode) => {
          setAuthModalMode(mode || 'login');
          setIsLoginModalOpen(true);
        }}
      />

      {/* Dynamic View Container with Spatial Continuity */}
      <main className="flex-1">
        <PageTransition viewKey={activeView}>
          {renderActiveView()}
        </PageTransition>
      </main>

      {/* Global Footer with Statutory Legal Boundary */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MotionProvider>
        <SharedElementProvider>
          <MainLayout />
        </SharedElementProvider>
      </MotionProvider>
    </AppProvider>
  );
}

export default App;
