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
  const [userSession, setUserSession] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("livingstone_user_session");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("livingstone_user_session");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.role) return parsed.role as UserRole;
        }
      } catch (e) {}
    }
    return "Teacher";
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("livingstone_user_session");
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("");
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

  // Verify authenticated user profile & role from backend on session restore
  useEffect(() => {
    if (isAuthenticated && userSession) {
      fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userSession.email,
          role: userSession.role,
          studentId: userSession.id || userSession.studentId,
          staffId: userSession.staffId
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.userRole) {
            setCurrentRole(data.userRole as UserRole);
            if (data.userRole === "Student" || data.userRole === "Parent") {
              setActiveTab("student-parent-portal");
            }
            if (data.user) {
              setUserSession((prev: any) => ({ ...prev, ...data.user, role: data.userRole }));
            }
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Check URL pathname for /admin route on mount and URL changes
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === "/admin" || path.startsWith("/admin") || hash === "#admin") {
        handleSelectTab("settings");
      }
    };

    handleUrlRouting();
    window.addEventListener("popstate", handleUrlRouting);
    return () => window.removeEventListener("popstate", handleUrlRouting);
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

  const handleSelectTab = (tab: string, overrideRole?: UserRole) => {
    const effectiveRole = overrideRole || currentRole;

    // 1. Student or Parent Route Protection
    if (effectiveRole === "Student" || effectiveRole === "Parent") {
      setAccessDeniedMessage("");
      setActiveTab("student-parent-portal");
      return;
    }

    // 2. Teacher Route Protection
    const isTeacher = effectiveRole === "Teacher" || effectiveRole === "Class Teacher" || effectiveRole === "Subject Teacher";
    const forbiddenForTeacher = [
      "superadmin",
      "finance",
      "subscription",
      "settings:permissions",
      "settings:users",
      "settings:security",
      "settings:database"
    ];

    if (isTeacher && forbiddenForTeacher.some((f) => tab === f || tab.startsWith(f))) {
      setAccessDeniedMessage("Access denied. You do not have permission to access this page.");
      setTimeout(() => setAccessDeniedMessage(""), 4000);
      setActiveTab("teacher-portal");
      return;
    }

    setAccessDeniedMessage("");
    setActiveTab(tab as any);
  };

  const handleLoginSuccess = (detectedRole: UserRole, targetTab: string, userData?: any) => {
    setIsAuthenticated(true);
    setCurrentRole(detectedRole);
    setUserSession(userData || null);

    const sessionData = {
      ...(userData || {}),
      role: detectedRole,
      loginTime: Date.now()
    };
    try {
      localStorage.setItem("livingstone_user_session", JSON.stringify(sessionData));
    } catch (e) {}

    if (detectedRole === "Student" || detectedRole === "Parent") {
      setActiveTab("student-parent-portal");
      handleSelectTab("student-parent-portal", detectedRole);
    } else if (detectedRole === "Teacher" || detectedRole === "Class Teacher" || detectedRole === "Subject Teacher") {
      setActiveTab("teacher-portal");
      handleSelectTab("teacher-portal", detectedRole);
    } else if (detectedRole === "Super Admin" || targetTab === "superadmin") {
      handleSelectTab("superadmin", detectedRole);
    } else if (window.location.pathname === "/admin" || window.location.hash === "#admin") {
      handleSelectTab("settings", detectedRole);
    } else {
      handleSelectTab(targetTab || "dashboard", detectedRole);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserSession(null);
    try {
      localStorage.removeItem("livingstone_user_session");
    } catch (e) {}
    setActiveTab("auth");
  };

  const renderCurrentView = () => {
    // Student or Parent role or student-parent-portal tab should view the Parent & Student Academic Portal
    if (currentRole === "Student" || currentRole === "Parent" || activeTab === "student-parent-portal") {
      return <StudentParentPortalView currentRole={currentRole === "Student" || currentRole === "Parent" ? currentRole : "Student"} userSession={userSession} />;
    }

    switch (true) {
      case activeTab === "dashboard":
        return (
          <DashboardView
            currentRole={currentRole}
            userSession={userSession}
            onSelectTab={(tab) => setActiveTab(tab)}
            onOpenAIAssistant={() => setIsAiModalOpen(true)}
          />
        );
      case activeTab === "teacher-portal":
        return <TeacherPortalView currentRole={currentRole} userSession={userSession} />;
      case activeTab === "student-parent-portal" || activeTab === "parents":
        return <StudentParentPortalView currentRole={currentRole} userSession={userSession} />;
      case activeTab === "website-builder":
        return <WebsiteBuilderView currentRole={currentRole} />;
      case activeTab === "subscription":
        return <SubscriptionView currentRole={currentRole} />;
      case activeTab === "ai-lesson-notes" || activeTab.startsWith("academic-"):
        if (activeTab === "academic-ai-exam-generator" || activeTab === "ai-exam-generator") {
          return <AIExamGeneratorView userSession={userSession} />;
        }
        if (activeTab === "academic-question-bank" || activeTab === "question-bank") {
          return <QuestionBankView />;
        }
        if (activeTab === "academic-report-cards" || activeTab === "report-cards" || activeTab === "academic-attendance") {
          return <ReportCardView userSession={userSession} />;
        }
        return <AILessonNotesView userSession={userSession} />;
      case activeTab === "ai-exam-generator":
        return <AIExamGeneratorView userSession={userSession} />;
      case activeTab === "question-bank":
        return <QuestionBankView />;
      case activeTab === "report-cards":
        return <ReportCardView userSession={userSession} />;
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

  // 3. STUDENT & PARENT STANDALONE LAYOUT: Single Student Sidebar layout without duplicate outer sidebar/header
  if (currentRole === "Student" || currentRole === "Parent") {
    return (
      <StudentParentPortalView
        currentRole={currentRole}
        userSession={userSession}
        onLogout={handleLogout}
      />
    );
  }

  // 4. SCHOOL DASHBOARD LAYOUT: Standard layout for School Owners, Teachers, Admins
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors">
      {/* School Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        currentRole={currentRole}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Access Denied Warning Toast/Banner */}
        {accessDeniedMessage && (
          <div className="bg-rose-600 text-white text-xs font-bold px-4 py-2 text-center shadow-lg animate-fade-in flex items-center justify-center gap-2">
            <span>⚠️ {accessDeniedMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <Header
          currentRole={currentRole}
          onRoleChange={(role) => {
            setCurrentRole(role);
            if (role === "Super Admin") {
              handleSelectTab("superadmin");
            } else if (role === "Student" || role === "Parent") {
              handleSelectTab("student-parent-portal");
            } else if (role === "Teacher") {
              handleSelectTab("teacher-portal");
            } else {
              handleSelectTab("dashboard");
            }
          }}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          onOpenAIAssistant={() => setIsAiModalOpen(true)}
          onSelectTab={handleSelectTab}
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
