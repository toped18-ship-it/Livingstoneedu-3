import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { AIAssistantModal } from "./components/AIAssistantModal";
import { DashboardView } from "./components/views/DashboardView";
import { AILessonNotesView } from "./components/views/AILessonNotesView";
import { AIExamGeneratorView } from "./components/views/AIExamGeneratorView";
import { QuestionBankView } from "./components/views/QuestionBankView";
import { ReportCardView } from "./components/views/ReportCardView";
import { StudentsView } from "./components/views/StudentsView";
import { TeachersView } from "./components/views/TeachersView";
import { FinanceView } from "./components/views/FinanceView";
import { LibraryView } from "./components/views/LibraryView";
import { CommunicationView } from "./components/views/CommunicationView";
import { SettingsView } from "./components/views/SettingsView";
import { WebsiteBuilderView } from "./components/views/WebsiteBuilderView";
import { SubscriptionView } from "./components/views/SubscriptionView";
import { SuperAdminView } from "./components/views/SuperAdminView";
import { TeacherPortalView } from "./components/views/TeacherPortalView";
import { StudentParentPortalView } from "./components/views/StudentParentPortalView";
import { AuthView } from "./components/views/AuthView";
import { UserRole } from "./types";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentRole, setCurrentRole] = useState<UserRole>("Teacher");
  const [userSession, setUserSession] = useState<any>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return (
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return true;
  });
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync dark class on root document element and localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Check URL pathname for /admin route on mount
  useEffect(() => {
    if (window.location.pathname === "/admin" || window.location.pathname.startsWith("/admin") || window.location.hash === "#admin") {
      setActiveTab("settings");
    }
  }, []);

  // Sync browser address bar with /admin when settings tab is active
  useEffect(() => {
    if (activeTab.startsWith("settings")) {
      if (window.location.pathname !== "/admin") {
        try {
          window.history.pushState(null, "", "/admin");
        } catch (e) {}
      }
    }
  }, [activeTab]);

  const handleLoginSuccess = (detectedRole: UserRole, targetTab: string, userData?: any) => {
    setIsAuthenticated(true);
    setCurrentRole(detectedRole);
    setUserSession(userData || null);
    if (detectedRole === "Super Admin" || targetTab === "superadmin") {
      setActiveTab("superadmin");
    } else if (window.location.pathname === "/admin" || window.location.hash === "#admin") {
      setActiveTab("settings");
    } else {
      setActiveTab(targetTab || "dashboard");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserSession(null);
    setActiveTab("auth");
  };

  const renderCurrentView = () => {
    // Student or Parent role should view the Parent & Student Academic Portal alone
    if (currentRole === "Student" || currentRole === "Parent") {
      return <StudentParentPortalView currentRole={currentRole} />;
    }

    switch (true) {
      case activeTab === "dashboard":
        return (
          <DashboardView
            currentRole={currentRole}
            onSelectTab={(tab) => setActiveTab(tab)}
            onOpenAIAssistant={() => setIsAiModalOpen(true)}
          />
        );
      case activeTab === "teacher-portal":
        return <TeacherPortalView currentRole={currentRole} />;
      case activeTab === "student-parent-portal" || activeTab === "parents":
        return <StudentParentPortalView currentRole={currentRole} />;
      case activeTab === "website-builder":
        return <WebsiteBuilderView currentRole={currentRole} />;
      case activeTab === "subscription":
        return <SubscriptionView currentRole={currentRole} />;
      case activeTab === "ai-lesson-notes" || activeTab.startsWith("academic-"):
        if (activeTab === "academic-ai-exam-generator" || activeTab === "ai-exam-generator") {
          return <AIExamGeneratorView />;
        }
        if (activeTab === "academic-question-bank" || activeTab === "question-bank") {
          return <QuestionBankView />;
        }
        if (activeTab === "academic-report-cards" || activeTab === "report-cards" || activeTab === "academic-attendance") {
          return <ReportCardView />;
        }
        return <AILessonNotesView />;
      case activeTab === "ai-exam-generator":
        return <AIExamGeneratorView />;
      case activeTab === "question-bank":
        return <QuestionBankView />;
      case activeTab === "report-cards":
        return <ReportCardView />;
      case activeTab === "students":
        return <StudentsView />;
      case activeTab === "teachers":
        return <TeachersView />;
      case activeTab.startsWith("finance") || activeTab === "finance":
        return <FinanceView />;
      case activeTab === "library":
        return <LibraryView />;
      case activeTab.startsWith("communication") || activeTab === "communication" || activeTab === "transport" || activeTab === "hostel" || activeTab === "support":
        return <CommunicationView />;
      case activeTab.startsWith("settings") || activeTab === "settings":
        return (
          <SettingsView
            currentRole={currentRole}
            activeSubTab={activeTab}
            onSelectSubTab={(sub) => setActiveTab(`settings:${sub}`)}
          />
        );
      default:
        return (
          <DashboardView
            currentRole={currentRole}
            onSelectTab={(tab) => setActiveTab(tab)}
            onOpenAIAssistant={() => setIsAiModalOpen(true)}
          />
        );
    }
  };

  // 1. PUBLIC LAYOUT: Render AuthView when user is not authenticated
  if (!isAuthenticated) {
    return (
      <AuthView
        currentRole={currentRole}
        onLoginSuccess={handleLoginSuccess}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />
    );
  }

  // 2. PLATFORM SUPER ADMIN LAYOUT: Completely separate layout without School Sidebar or Header
  if (currentRole === "Super Admin" || activeTab === "superadmin") {
    return (
      <SuperAdminView
        onLogout={handleLogout}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onSwitchRole={(role) => {
          setCurrentRole(role);
          if (role !== "Super Admin") {
            setActiveTab("dashboard");
          }
        }}
      />
    );
  }

  // 3. SCHOOL DASHBOARD LAYOUT: Standard layout for School Owners, Teachers, Students, Parents, Admins
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors">
      {/* School Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        currentRole={currentRole}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <Header
          currentRole={currentRole}
          onRoleChange={(role) => {
            setCurrentRole(role);
            if (role === "Super Admin") {
              setActiveTab("superadmin");
            }
          }}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          onOpenAIAssistant={() => setIsAiModalOpen(true)}
          onSelectTab={(tab) => setActiveTab(tab)}
          notificationsCount={3}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />

        {/* View Render Area */}
        <main className="flex-1 p-3 md:p-5 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Floating AI Assistant Copilot Modal */}
      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentRole={currentRole}
      />
    </div>
  );
}
