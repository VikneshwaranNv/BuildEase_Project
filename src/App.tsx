import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MobileNav } from './components/layout/MobileNav';

import { OverviewPage } from './pages/OverviewPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { WorkforcePage } from './pages/WorkforcePage';
import { AttendancePage } from './pages/AttendancePage';
import { TasksPage } from './pages/TasksPage';
import { PayrollPage } from './pages/PayrollPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuthPage } from './pages/AuthPage';

const AppContent: React.FC = () => {
  const { activeNav, isAuthenticated } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If not authenticated, display the unified Jobsite Login & Sign-up Portal
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Render current view
  const renderCurrentPage = () => {
    switch (activeNav) {
      case 'overview':
        return <OverviewPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'workforce':
        return <WorkforcePage />;
      case 'attendance':
        return <AttendancePage />;
      case 'tasks':
        return <TasksPage />;
      case 'payroll':
        return <PayrollPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#D8CCB9] flex text-[#252521] antialiased selection:bg-[#A77B50]/30 selection:text-[#252521] bg-blueprint-grid">
      {/* Desktop Fixed Structural Monolith Sidebar */}
      <Sidebar />

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#D8CCB9]">
        <TopBar onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav}
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
