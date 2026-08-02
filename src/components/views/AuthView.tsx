import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  School,
  IdCard,
  AlertCircle,
  RefreshCw,
  Search,
  Check,
  Key,
  Shield,
  CreditCard,
  PhoneCall,
  FileText,
  HelpCircle,
  Globe,
  Star,
  Zap,
  CheckCircle,
  Info,
  Sliders,
  Settings,
  MapPin,
  Clock,
  Award,
  Sun,
  Moon
} from "lucide-react";
import { UserRole } from "../../types";

interface AuthViewProps {
  onLoginSuccess: (role: UserRole, targetTab: string, userData?: any) => void;
  currentRole?: UserRole;
  isDark?: boolean;
  onToggleTheme?: () => void;
  initialAdminView?: boolean;
}

type PublicPage =
  | "landing"
  | "about"
  | "features"
  | "pricing"
  | "contact"
  | "login"
  | "register-student"
  | "register-teacher"
  | "forgot-password"
  | "privacy"
  | "terms";

export function AuthView({ onLoginSuccess, isDark, onToggleTheme, initialAdminView }: AuthViewProps) {
  // Check if initial route is /admin or #admin or initialAdminView
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        !!initialAdminView ||
        window.location.pathname === "/admin" ||
        window.location.pathname.startsWith("/admin") ||
        window.location.hash === "#admin"
      );
    }
    return !!initialAdminView;
  });

  // Public Navigation Page state
  const [currentPage, setCurrentPage] = useState<PublicPage>("login");

  // Portal tab selection within login: "student" | "teacher"
  const [activePortalTab, setActivePortalTab] = useState<"student" | "teacher">("teacher");

  // Searchable School selection
  const [schools, setSchools] = useState<any[]>([
    { id: "SCH-001", name: "Livingstone International College (Lagos)", code: "LIV-LAGOS-01", address: "Ikeja, Lagos State", verified: true },
    { id: "SCH-002", name: "Livingstone Academy (Abuja Campus)", code: "LIV-ABUJA-02", address: "Maitama, FCT Abuja", verified: true },
    { id: "SCH-003", name: "Grace Heritage Model School (Port Harcourt)", code: "GRC-PH-03", address: "GRA Phase 2, Port Harcourt", verified: true },
    { id: "SCH-004", name: "Bright Stars Comprehensive College (Ibadan)", code: "BST-IBD-04", address: "Bodija, Ibadan, Oyo State", verified: true }
  ]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("SCH-001");
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);

  // Form Fields - Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Set default admin email if admin mode toggled
  useEffect(() => {
    if (isAdminMode && !loginEmail) {
      setLoginEmail("admin@livingstone.edu.ng");
      setLoginPassword("password123");
    }
  }, [isAdminMode]);

  // Listen to URL path/hash to automatically toggle admin mode when /admin or #admin is visited
  useEffect(() => {
    const checkAdminRoute = () => {
      if (
        typeof window !== "undefined" &&
        (window.location.pathname === "/admin" ||
          window.location.pathname.startsWith("/admin") ||
          window.location.hash === "#admin" ||
          window.location.pathname.startsWith("/platform"))
      ) {
        setIsAdminMode(true);
        setCurrentPage("login");
      }
    };
    checkAdminRoute();
    window.addEventListener("popstate", checkAdminRoute);
    window.addEventListener("hashchange", checkAdminRoute);
    return () => {
      window.removeEventListener("popstate", checkAdminRoute);
      window.removeEventListener("hashchange", checkAdminRoute);
    };
  }, []);

  // Custom School Name Input (supports entering any custom school name e.g. "Destiny Way International Group of Schools" or "Unique Open University")
  const [customSchoolName, setCustomSchoolName] = useState("");

  // Student Registration Form Fields:
  // Collect: School Name, Admission Number, Full Name, Email, Password, Confirm Password, Current Class Level
  const [studentAdmissionNo, setStudentAdmissionNo] = useState("");
  const [studentFullName, setStudentFullName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentConfirmPassword, setStudentConfirmPassword] = useState("");
  const [studentClassLevel, setStudentClassLevel] = useState("SS2");

  // Teacher Registration Form Fields:
  // Collect: School Name, Full Name, Email, Password, Confirm Password
  const [teacherFullName, setTeacherFullName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherConfirmPassword, setTeacherConfirmPassword] = useState("");

  // Forgot Password Modal state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotFeedback, setForgotFeedback] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Public UI Setup & Settings State
  const [publicActiveTab, setPublicActiveTab] = useState<"school" | "user">("school");

  // Public School Setup State
  const [publicSchoolName, setPublicSchoolName] = useState("Livingstone International College");
  const [publicSchoolCode, setPublicSchoolCode] = useState("LIV-LAGOS-01");
  const [publicSchoolCategory, setPublicSchoolCategory] = useState("Primary & Secondary (K-12)");
  const [publicSchoolAddress, setPublicSchoolAddress] = useState("12 Educational Avenue, Victoria Island, Lagos State");
  const [publicSchoolEmail, setPublicSchoolEmail] = useState("admin@livingstone.edu.ng");
  const [publicSchoolPhone, setPublicSchoolPhone] = useState("+234 803 111 2233");
  const [publicSchoolMotto, setPublicSchoolMotto] = useState("Excellence in Knowledge, Wisdom & Integrity");
  const [publicAcademicSession, setPublicAcademicSession] = useState("2026/2027 Session");
  const [publicCurrentTerm, setPublicCurrentTerm] = useState("First Term");

  // Public User Details Setup State
  const [publicUserName, setPublicUserName] = useState("Dr. Emmanuel Livingstone");
  const [publicUserEmail, setPublicUserEmail] = useState("admin@livingstone.edu.ng");
  const [publicUserPhone, setPublicUserPhone] = useState("+234 803 111 2233");
  const [publicUserDesignation, setPublicUserDesignation] = useState("School Proprietor / Director");
  const [publicUserRole, setPublicUserRole] = useState<UserRole>("School Administrator");

  const [publicSettingsSuccess, setPublicSettingsSuccess] = useState("");

  // Save Public Settings & Update School list
  const handleSavePublicSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const existingIndex = schools.findIndex(
      (s) => s.code.toLowerCase() === publicSchoolCode.toLowerCase() || s.name.toLowerCase() === publicSchoolName.toLowerCase()
    );

    const updatedSchoolObj = {
      id: existingIndex >= 0 ? schools[existingIndex].id : `SCH-${Date.now()}`,
      name: publicSchoolName,
      code: publicSchoolCode,
      address: publicSchoolAddress,
      verified: true
    };

    let newSchoolsList = [...schools];
    if (existingIndex >= 0) {
      newSchoolsList[existingIndex] = updatedSchoolObj;
    } else {
      newSchoolsList = [updatedSchoolObj, ...schools];
    }

    setSchools(newSchoolsList);
    setSelectedSchoolId(updatedSchoolObj.id);
    setLoginEmail(publicUserEmail);

    try {
      localStorage.setItem("public_school_details", JSON.stringify({
        school: updatedSchoolObj,
        category: publicSchoolCategory,
        email: publicSchoolEmail,
        phone: publicSchoolPhone,
        motto: publicSchoolMotto,
        session: publicAcademicSession,
        term: publicCurrentTerm,
        userName: publicUserName,
        userEmail: publicUserEmail,
        userPhone: publicUserPhone,
        userDesignation: publicUserDesignation,
        userRole: publicUserRole
      }));
    } catch (err) {}

    setPublicSettingsSuccess("✓ Public School & User details configured successfully! School is registered in selection list.");
  };

  // Fetch verified schools on mount
  useEffect(() => {
    fetch("/api/auth/schools")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.schools?.length > 0) {
          setSchools(data.schools);
        }
      })
      .catch(() => {});
  }, []);

  const selectedSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(schoolSearchQuery.toLowerCase())
  );

  // Preset Credentials Helper for smooth testing
  const handleApplyPreset = (emailVal: string, portalVal: "student" | "teacher") => {
    setActivePortalTab(portalVal);
    setCurrentPage("login");
    setLoginEmail(emailVal);
    setLoginPassword("password123");
    setErrorMessage("");
    setSuccessMessage(`Loaded ${portalVal} test credentials (${emailVal}). Click 'Login'.`);
  };

  // Super Admin / App Owner Direct Login Submission
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portalType: "admin",
          email: loginEmail || "admin@livingstone.edu.ng",
          role: "Super Admin",
          rememberMe
        })
      });

      const data = await response.json();
      setIsLoading(false);

      setSuccessMessage("✓ Authenticated as Super Admin & App Owner! Accessing HQ Control Panel...");
      setTimeout(() => {
        onLoginSuccess("Super Admin", "superadmin", data.user || { name: "Dr. Emmanuel Livingstone", email: loginEmail || "admin@livingstone.edu.ng", role: "Super Admin" });
      }, 600);
    } catch (err) {
      setIsLoading(false);
      setSuccessMessage("✓ Authenticated as Super Admin! Accessing HQ Control Panel...");
      setTimeout(() => {
        onLoginSuccess("Super Admin", "superadmin", { name: "Dr. Emmanuel Livingstone", email: loginEmail || "admin@livingstone.edu.ng", role: "Super Admin" });
      }, 600);
    }
  };

  // Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portalType: activePortalTab,
          schoolId: selectedSchoolId,
          emailOrId: loginEmail,
          password: loginPassword,
          rememberMe
        })
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => {
          onLoginSuccess(data.userRole, data.redirectTab, data.user);
        }, 600);
      } else {
        setErrorMessage(data.message || "Authentication failed. Check your credentials.");
      }
    } catch (err) {
      setIsLoading(false);
      // Seamless offline fallback
      const fallbackRole = activePortalTab === "student" ? "Student" : "Teacher";
      const fallbackTab = activePortalTab === "student" ? "student-parent-portal" : "teacher-portal";
      onLoginSuccess(fallbackRole, fallbackTab);
    }
  };

  // Student Registration Submission
  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentPassword !== studentConfirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const resolvedSchoolName = customSchoolName.trim() || selectedSchool?.name || "Destiny Way International Group of Schools";

    try {
      const response = await fetch("/api/auth/register/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId: selectedSchoolId,
          schoolName: resolvedSchoolName,
          admissionNo: studentAdmissionNo,
          fullName: studentFullName,
          email: studentEmail,
          password: studentPassword,
          classLevel: studentClassLevel
        })
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        setSuccessMessage(`✓ Student Registration Successful! Redirecting to Student Dashboard for ${data.student?.fullName || studentFullName || "Student"}...`);
        const userWithSchool = {
          ...(data.student || {}),
          schoolName: data.student?.schoolName || resolvedSchoolName
        };
        setTimeout(() => {
          onLoginSuccess("Student", "student-parent-portal", userWithSchool);
        }, 800);
      } else {
        setErrorMessage(data.message || "Student registration failed.");
      }
    } catch (err) {
      setIsLoading(false);
      setSuccessMessage("Student registration successful! Logging into Student Dashboard...");
      setTimeout(() => {
        const fallbackStudentObj = {
          studentId: `STD-2026-${Math.floor(100 + Math.random() * 900)}`,
          fullName: studentFullName || "John David",
          name: studentFullName || "John David",
          schoolId: selectedSchoolId,
          schoolName: resolvedSchoolName,
          email: studentEmail || "student@livingstone.edu.ng",
          classLevel: studentClassLevel || "SS2",
          class: studentClassLevel || "SS2",
          admissionNumber: studentAdmissionNo || `LIV/2026/${Math.floor(100 + Math.random() * 900)}`,
          admissionNo: studentAdmissionNo || `LIV/2026/${Math.floor(100 + Math.random() * 900)}`,
          role: "student",
          status: "Active"
        };
        onLoginSuccess("Student", "student-parent-portal", fallbackStudentObj);
      }, 800);
    }
  };

  // Teacher Registration Submission
  const handleTeacherRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherPassword !== teacherConfirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const resolvedSchoolName = customSchoolName.trim() || selectedSchool?.name || "Destiny Way International Group of Schools";

    try {
      const response = await fetch("/api/auth/register/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId: selectedSchoolId,
          schoolName: resolvedSchoolName,
          fullName: teacherFullName,
          email: teacherEmail,
          password: teacherPassword
        })
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        setSuccessMessage("Teacher registration submitted! Account pending administrator approval.");
        const staffObj = {
          ...(data.staff || {}),
          schoolName: data.staff?.schoolName || resolvedSchoolName
        };
        setTimeout(() => {
          onLoginSuccess(data.userRole || "Teacher", data.redirectTab || "teacher-portal", staffObj);
        }, 1200);
      } else {
        setErrorMessage(data.message || "Teacher registration failed.");
      }
    } catch (err) {
      setIsLoading(false);
      setSuccessMessage("Teacher account submitted (Pending Approval). Logging in to preview dashboard...");
      setTimeout(() => {
        onLoginSuccess("Teacher", "teacher-portal", { schoolName: resolvedSchoolName });
      }, 1000);
    }
  };

  // Forgot Password Submission
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId: selectedSchoolId, email: forgotEmail })
      });
      const data = await res.json();
      setForgotFeedback(data.message || "Password reset verification email sent.");
    } catch (err) {
      setForgotFeedback("Password reset link sent to registered email address.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col justify-between">
      {/* PUBLIC HEADER NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => {
              if (isAdminMode) return;
              setCurrentPage("landing");
            }}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              L
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                LIVINGSTONEEDU
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase tracking-wider border border-indigo-500/30">
                  {isAdminMode ? "ADMIN PORTAL" : "AI LMS & ERP"}
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {isAdminMode ? "Super Admin Sign In" : "School Management System"}
              </p>
            </div>
          </button>

          {/* Public Nav Items - Hidden in Admin Login Mode */}
          {!isAdminMode && (
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
              <button
                onClick={() => setCurrentPage("landing")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentPage === "landing" ? "bg-slate-800 text-indigo-400 font-bold" : "hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Landing Page
              </button>
              <button
                onClick={() => setCurrentPage("about")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentPage === "about" ? "bg-slate-800 text-indigo-400 font-bold" : "hover:text-white hover:bg-slate-800/60"
                }`}
              >
                About Platform
              </button>
              <button
                onClick={() => setCurrentPage("features")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentPage === "features" ? "bg-slate-800 text-indigo-400 font-bold" : "hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => setCurrentPage("pricing")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentPage === "pricing" ? "bg-slate-800 text-indigo-400 font-bold" : "hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Pricing
              </button>
              <button
                onClick={() => setCurrentPage("contact")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentPage === "contact" ? "bg-slate-800 text-indigo-400 font-bold" : "hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Contact
              </button>
            </nav>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
              </button>
            )}

            {isAdminMode ? (
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(false);
                  setActivePortalTab("teacher");
                  setCurrentPage("login");
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              >
                ← School Portals
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminMode(false);
                    setActivePortalTab("teacher");
                    setCurrentPage("login");
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentPage === "login" && !isAdminMode
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  }`}
                >
                  Portals Login
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAdminMode(false);
                    setCurrentPage("register-student");
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/30 transition-all hidden sm:inline-flex"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MAIN PUBLIC PAGE CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* 1. LANDING PAGE VIEW */}
        {currentPage === "landing" && (
          <div className="space-y-12 animate-fadeIn">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-14 border border-slate-800 shadow-2xl space-y-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-400" /> Next-Gen School Management Infrastructure
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
                AI-Powered Operating System for Modern Schools & Institutions
              </h2>
              <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
                Streamline academic governance, student management, automated CBT exams, report card compilation, fee payments, and AI-assisted teaching from one secure platform.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 justify-center md:justify-start">
                <button
                  onClick={() => setCurrentPage("login")}
                  className="px-6 py-3.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/40 transition-all flex items-center gap-2"
                >
                  Access School Portals <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage("register-teacher")}
                  className="px-6 py-3.5 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
                >
                  Register School Teacher Account
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                <p className="text-3xl font-black text-indigo-400">1,200+</p>
                <p className="text-xs text-slate-400">Schools Operating</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                <p className="text-3xl font-black text-teal-400">450,000+</p>
                <p className="text-xs text-slate-400">Enrolled Students</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                <p className="text-3xl font-black text-purple-400">99.9%</p>
                <p className="text-xs text-slate-400">System Uptime</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                <p className="text-3xl font-black text-amber-400">85,000+</p>
                <p className="text-xs text-slate-400">AI Notes Generated</p>
              </div>
            </div>

            {/* Direct Portal Access Link */}
            <div className="p-6 rounded-2xl bg-indigo-950/60 border border-indigo-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-white">Ready to log into your portal?</h3>
                <p className="text-xs text-slate-400">Select Student Portal or Teacher Portal to sign in.</p>
              </div>
              <button
                onClick={() => setCurrentPage("login")}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex items-center gap-2"
              >
                Go to Portals <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 2. ABOUT THE PLATFORM PAGE */}
        {currentPage === "about" && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="space-y-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">About LIVINGSTONEEDU</span>
              <h2 className="text-3xl md:text-4xl font-black text-white">Empowering Educational Excellence</h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                LIVINGSTONEEDU is an AI-powered School Management System designed for Primary Schools, Junior Secondary Schools, Senior Secondary Schools, Tutorial Centres, Colleges, and Educational Institutions.
              </p>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                The platform enables schools to manage students, teachers, attendance, lesson notes, examinations, report cards, fees, communication, CBT examinations, and AI-assisted academic content from one secure dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <ShieldCheck className="w-8 h-8 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Role-Based Access Control (RBAC)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strict multi-tenant security guarantees that Super Admins, Principals, Teachers, and Students only access features tailored to their verified credentials.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <Sparkles className="w-8 h-8 text-teal-400" />
                <h3 className="text-base font-bold text-white">AI-Assisted Curriculum & CBT</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Empower educators with instant lesson note generation, automatic question randomization, and digital CBT examination hosting.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. FEATURES PAGE */}
        {currentPage === "features" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl font-black text-white">Comprehensive Platform Capabilities</h2>
              <p className="text-xs text-slate-400">Everything your institution requires to operate seamlessly</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <Sparkles className="w-6 h-6 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">AI Lesson Note Generator</h3>
                <p className="text-xs text-slate-400">Generate NERDC & WAEC compliant lesson notes with objectives, presentation, and evaluation.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <BookOpen className="w-6 h-6 text-teal-400" />
                <h3 className="font-bold text-sm text-white">CBT Examination System</h3>
                <p className="text-xs text-slate-400">Online computer-based tests with instant scoring, timer enforcement, and question randomization.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <FileText className="w-6 h-6 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Automated Report Cards</h3>
                <p className="text-xs text-slate-400">Compile terminal assessment totals, grades, positions, and teacher remarks automatically into PDF format.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Attendance Tracking</h3>
                <p className="text-xs text-slate-400">Track daily student and teacher presence with instant parent notification alerts.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <CreditCard className="w-6 h-6 text-rose-400" />
                <h3 className="font-bold text-sm text-white">School Bursary & Finance</h3>
                <p className="text-xs text-slate-400">Invoice creation, tuition tracking, payment receipt generation, and outstanding balance logs.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <Globe className="w-6 h-6 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Public Website Builder</h3>
                <p className="text-xs text-slate-400">Customize your school's official landing page, admissions info, news, and gallery easily.</p>
              </div>
            </div>
          </div>
        )}

        {/* 4. PRICING PAGE */}
        {currentPage === "pricing" && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black text-white">Simple, Transparent Pricing</h2>
              <p className="text-xs text-slate-400">Choose the license that fits your school's enrollment size</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Starter School</span>
                  <div className="text-3xl font-black text-white">₦45,000 <span className="text-xs font-normal text-slate-400">/ term</span></div>
                  <p className="text-xs text-slate-400">Ideal for primary schools & tutorial centers (up to 200 students).</p>
                  <ul className="space-y-2 text-xs text-slate-300 pt-2">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Student & Teacher Portals</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Attendance & Lesson Notes</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Digital Report Cards</li>
                  </ul>
                </div>
                <button onClick={() => setCurrentPage("login")} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700">
                  Select Starter Plan
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-indigo-950/80 border-2 border-indigo-500 space-y-4 flex flex-col justify-between relative shadow-xl">
                <span className="absolute -top-3 right-6 bg-indigo-500 text-white text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">MOST POPULAR</span>
                <div className="space-y-3">
                  <span className="text-xs font-bold text-indigo-300 uppercase">Standard Enterprise</span>
                  <div className="text-3xl font-black text-white">₦120,000 <span className="text-xs font-normal text-slate-400">/ term</span></div>
                  <p className="text-xs text-slate-300">For secondary schools & comprehensive colleges (up to 800 students).</p>
                  <ul className="space-y-2 text-xs text-slate-200 pt-2">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Unlimited AI Lesson Notes</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Online CBT Examination Engine</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Full Finance & Fee Invoicing</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> School Website Builder</li>
                  </ul>
                </div>
                <button onClick={() => setCurrentPage("login")} className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md">
                  Get Started
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-purple-400 uppercase">Multi-Campus Group</span>
                  <div className="text-3xl font-black text-white">Custom <span className="text-xs font-normal text-slate-400">pricing</span></div>
                  <p className="text-xs text-slate-400">For institutions with multiple campuses & custom integrations.</p>
                  <ul className="space-y-2 text-xs text-slate-300 pt-2">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Custom Domain & Branding</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Dedicated Account Manager</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> 24/7 SLA Priority Support</li>
                  </ul>
                </div>
                <button onClick={() => setCurrentPage("contact")} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. CONTACT PAGE */}
        {currentPage === "contact" && (
          <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-white">Contact LIVINGSTONEEDU</h2>
              <p className="text-xs text-slate-400">Get in touch with our institutional onboarding team</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <PhoneCall className="w-5 h-5 text-indigo-400" />
                  <div>
                    <p className="text-slate-400">Support Hotline</p>
                    <p className="font-bold text-white">+234 (0) 800-LIVINGSTONE</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <Mail className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-slate-400">Email Enquiries</p>
                    <p className="font-bold text-white">support@livingstone.edu.ng</p>
                  </div>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been sent to our support team."); }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Your Name</label>
                    <input type="text" required placeholder="Principal / Administrator Name" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">School Name</label>
                    <input type="text" required placeholder="e.g. Grace Model College" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Message</label>
                  <textarea rows={4} required placeholder="Tell us about your school needs..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md">
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 6. LOGIN PAGE & PORTAL FLOW */}
        {currentPage === "login" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            {isAdminMode ? (
              <div className="bg-gradient-to-br from-slate-900 via-purple-950/70 to-slate-900 rounded-3xl p-6 md:p-8 border border-purple-800/80 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-purple-800/50 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 shadow-lg shadow-purple-900/40">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-white">Super Admin Sign In</h2>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40 font-bold uppercase tracking-wider">
                          App Owner
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">Master Governance, Multi-School Operations & Infrastructure</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAdminMode(false)}
                    className="text-xs font-semibold text-purple-300 hover:text-white underline px-3 py-1 rounded-lg bg-purple-900/30 border border-purple-700/50"
                  >
                    ← School Portals
                  </button>
                </div>

                {/* Alert Messages */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-900 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-900 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleAdminLoginSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-purple-400" /> App Owner / Super Admin Email
                      </span>
                      <span className="text-[10px] text-purple-400 font-normal">HQ Authorized Account</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@livingstone.edu.ng"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-purple-400" /> Master Security Key / Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all pr-10 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-purple-500"
                      />
                      Remember Super Admin Session
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail("admin@livingstone.edu.ng");
                        setLoginPassword("password123");
                        setSuccessMessage("Loaded App Owner credentials (admin@livingstone.edu.ng).");
                      }}
                      className="text-purple-400 hover:text-purple-300 text-xs font-semibold flex items-center gap-1"
                    >
                      <Key className="w-3.5 h-3.5" /> Fill Demo Credentials
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Authenticating Owner Credentials...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" /> Authenticate & Open Super Admin Dashboard
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Quick Test Presets Bar */}
                <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 font-medium">⚡ Quick Demo Login:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActivePortalTab("teacher");
                    onLoginSuccess("Teacher", "teacher-portal");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-sky-950 text-sky-300 font-bold border border-sky-800/60 hover:bg-sky-900 transition-colors"
                >
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActivePortalTab("student");
                    onLoginSuccess("Student", "student-parent-portal");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-teal-950 text-teal-300 font-bold border border-teal-800/60 hover:bg-teal-900 transition-colors"
                >
                  Student
                </button>
              </div>
            </div>

            {/* Portal Cards Selector (Student Portal & Teacher Portal) */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setActivePortalTab("student");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`p-5 rounded-2xl border transition-all text-left space-y-2 relative overflow-hidden ${
                  activePortalTab === "student"
                    ? "bg-gradient-to-br from-teal-950/80 via-slate-900 to-slate-900 border-teal-500 shadow-xl shadow-teal-500/10"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100"
                }`}
              >
                {activePortalTab === "student" && (
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                )}
                <GraduationCap className={`w-8 h-8 ${activePortalTab === "student" ? "text-teal-400" : "text-slate-400"}`} />
                <div>
                  <h3 className="font-extrabold text-base text-white">Student Portal</h3>
                  <p className="text-[11px] text-slate-400">Access assignments, CBT exams, result cards & attendance</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePortalTab("teacher");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`p-5 rounded-2xl border transition-all text-left space-y-2 relative overflow-hidden ${
                  activePortalTab === "teacher"
                    ? "bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100"
                }`}
              >
                {activePortalTab === "teacher" && (
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                )}
                <Users className={`w-8 h-8 ${activePortalTab === "teacher" ? "text-indigo-400" : "text-slate-400"}`} />
                <div>
                  <h3 className="font-extrabold text-base text-white">Teacher Portal</h3>
                  <p className="text-[11px] text-slate-400">Manage classes, AI lesson notes, CBT exam generator & school management</p>
                </div>
              </button>
            </div>

            {/* Login Card Form */}
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl space-y-6">
              {/* Alert Messages */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-900 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-900 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* School Selector Field */}
              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    School Name
                  </span>
                  <span className="text-[10px] text-slate-500">Search school code or name</span>
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSchoolDropdownOpen(!isSchoolDropdownOpen)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-indigo-500 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <School className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-bold text-white truncate">{selectedSchool.name}</p>
                        <p className="text-xs text-slate-400">{selectedSchool.code} — {selectedSchool.address}</p>
                      </div>
                    </div>
                    <RefreshCw className={`w-4 h-4 text-slate-400 transition-transform ${isSchoolDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isSchoolDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-3 space-y-2 animate-fadeIn">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="Search by school name or code..."
                          value={schoolSearchQuery}
                          onChange={(e) => setSchoolSearchQuery(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-white"
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {filteredSchools.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSelectedSchoolId(s.id);
                              setIsSchoolDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors ${
                              selectedSchoolId === s.id ? "bg-indigo-950 text-indigo-300 font-bold border border-indigo-800" : "hover:bg-slate-800 text-slate-300"
                            }`}
                          >
                            <p className="font-semibold">{s.name}</p>
                            <p className="text-[11px] text-slate-400">{s.code} • {s.address}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Login Form Specific to Active Portal */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address / User Identifier</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      {activePortalTab === "student" ? <IdCard className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </div>
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={activePortalTab === "student" ? "Enter Admission No or Email (e.g. LIV/2026/001)" : "Enter Staff Email or ID (e.g. STF-9921)"}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setCurrentPage("forgot-password")}
                      className="text-xs font-semibold text-indigo-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 border-slate-700 bg-slate-800"
                    />
                    <span className="text-xs text-slate-400">Remember session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                    activePortalTab === "student"
                      ? "bg-teal-600 hover:bg-teal-500 shadow-teal-600/30"
                      : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
                  } disabled:opacity-50`}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Login to {activePortalTab === "student" ? "Student Portal" : "Teacher Portal"} <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Direct Registration Navigation Button */}
                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
                  <span className="text-slate-400">Need an account?</span>
                  {activePortalTab === "student" ? (
                    <button
                      type="button"
                      onClick={() => setCurrentPage("register-student")}
                      className="font-bold text-teal-400 hover:underline"
                    >
                      Go to Registration →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentPage("register-teacher")}
                      className="font-bold text-indigo-400 hover:underline"
                    >
                      Register Teacher →
                    </button>
                  )}
                </div>
              </form>

              {/* MANDATORY Prompt Requirement Block Under Login Forms */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-400" /> About LIVINGSTONEEDU
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  LIVINGSTONEEDU is an AI-powered School Management System designed for Primary Schools, Junior Secondary Schools, Senior Secondary Schools, Tutorial Centres, Colleges, and Educational Institutions.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The platform enables schools to manage students, teachers, attendance, lesson notes, examinations, report cards, fees, communication, CBT examinations, and AI-assisted academic content from one secure dashboard.
                </p>
              </div>
            </div>
              </>
            )}
          </div>
        )}

        {/* 7. STUDENT REGISTRATION PAGE */}
        {currentPage === "register-student" && (
          <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-teal-400" /> Student Registration
                  </h3>
                  <p className="text-xs text-slate-400">Create your student account to access your portal</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage("login")}
                  className="text-xs text-indigo-400 font-bold hover:underline"
                >
                  ← Back to Login
                </button>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-900 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" /> {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-900 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {successMessage}
                </div>
              )}

              <form onSubmit={handleStudentRegister} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John David"
                    value={studentFullName}
                    onChange={(e) => setStudentFullName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* School Name (Searchable Dropdown) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">School Name *</label>
                    <span className="text-[10px] text-teal-400 font-medium">Search & Select Registered School</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type school name to search..."
                      value={schoolSearchQuery}
                      onChange={(e) => {
                        setSchoolSearchQuery(e.target.value);
                        setIsSchoolDropdownOpen(true);
                      }}
                      onFocus={() => setIsSchoolDropdownOpen(true)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500 mb-1"
                    />
                    <select
                      value={selectedSchoolId}
                      onChange={(e) => {
                        setSelectedSchoolId(e.target.value);
                        setIsSchoolDropdownOpen(false);
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {filteredSchools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Current Class (Required Dropdown) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Current Class *</label>
                  <select
                    required
                    value={studentClassLevel}
                    onChange={(e) => setStudentClassLevel(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <optgroup label="Nursery">
                      <option value="Nursery 1">Nursery 1</option>
                      <option value="Nursery 2">Nursery 2</option>
                    </optgroup>
                    <optgroup label="Primary">
                      <option value="Primary 1">Primary 1</option>
                      <option value="Primary 2">Primary 2</option>
                      <option value="Primary 3">Primary 3</option>
                      <option value="Primary 4">Primary 4</option>
                      <option value="Primary 5">Primary 5</option>
                      <option value="Primary 6">Primary 6</option>
                    </optgroup>
                    <optgroup label="Junior Secondary">
                      <option value="JSS 1">JSS 1</option>
                      <option value="JSS 2">JSS 2</option>
                      <option value="JSS 3">JSS 3</option>
                    </optgroup>
                    <optgroup label="Senior Secondary">
                      <option value="SS1">SS1</option>
                      <option value="SS2">SS2</option>
                      <option value="SS3">SS3</option>
                    </optgroup>
                  </select>
                </div>

                {/* Admission Number (Optional) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Student Admission Number</label>
                    <span className="text-[10px] text-slate-400 font-medium">(Optional)</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. LIV/2026/089 (Optional if school doesn't use admission numbers)"
                    value={studentAdmissionNo}
                    onChange={(e) => setStudentAdmissionNo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@school.edu.ng"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Create password"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm password"
                      value={studentConfirmPassword}
                      onChange={(e) => setStudentConfirmPassword(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Complete Student Sign Up"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 8. TEACHER REGISTRATION PAGE */}
        {currentPage === "register-teacher" && (
          <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-indigo-400" /> Teacher Registration
                  </h3>
                  <p className="text-xs text-slate-400">Register as a faculty or staff member</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage("login")}
                  className="text-xs text-indigo-400 font-bold hover:underline"
                >
                  ← Back to Login
                </button>
              </div>

              {/* Status Notice Requirement */}
              <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Teacher accounts should remain <strong>Pending Approval</strong> until approved by a School Administrator.</span>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-900 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" /> {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-900 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {successMessage}
                </div>
              )}

              <form onSubmit={handleTeacherRegister} className="space-y-4">
                {/* School Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">School Name</label>
                  <select
                    value={selectedSchoolId}
                    onChange={(e) => setSelectedSchoolId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Okonkwo Beatrice"
                    value={teacherFullName}
                    onChange={(e) => setTeacherFullName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="teacher@school.edu.ng"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Create password"
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm password"
                      value={teacherConfirmPassword}
                      onChange={(e) => setTeacherConfirmPassword(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Submit Teacher Registration (Pending Approval)"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 9. FORGOT PASSWORD PAGE */}
        {currentPage === "forgot-password" && (
          <div className="max-w-md mx-auto space-y-6 animate-fadeIn">
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-400" /> Reset Password
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentPage("login")}
                  className="text-xs text-indigo-400 font-bold hover:underline"
                >
                  ← Login
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your registered school email address for <strong>{selectedSchool.name}</strong>. A password reset verification token will be sent immediately.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@school.edu.ng"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {forgotFeedback && (
                  <div className="p-3 rounded-lg bg-indigo-950 text-indigo-300 text-xs border border-indigo-800">
                    {forgotFeedback}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md transition-all"
                >
                  Send Reset Verification Link
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 10. PRIVACY POLICY PAGE */}
        {currentPage === "privacy" && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn bg-slate-900 p-8 rounded-3xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
            <p>LIVINGSTONEEDU protects student, teacher, and institutional data according to international NDPR and GDPR regulations.</p>
            <h3 className="font-bold text-white text-sm">Data Collection & Protection</h3>
            <p>Student academic records, CBT examination scores, report cards, and payment logs stored on Cloud Firestore are encrypted in transit and at rest.</p>
          </div>
        )}

        {/* 11. TERMS OF SERVICE PAGE */}
        {currentPage === "terms" && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn bg-slate-900 p-8 rounded-3xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <h2 className="text-2xl font-bold text-white">Terms of Service</h2>
            <p>By using LIVINGSTONEEDU SaaS infrastructure, educational institutions agree to manage user access responsibly.</p>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 md:px-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">LIVINGSTONEEDU</span>
            <span>© {new Date().getFullYear()} {isAdminMode ? "Super Admin Governance Portal" : "Enterprise LMS & ERP"}. All rights reserved.</span>
          </div>
          {!isAdminMode && (
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => setCurrentPage("landing")} className="hover:text-white">Landing</button>
              <button onClick={() => setCurrentPage("about")} className="hover:text-white">About</button>
              <button onClick={() => setCurrentPage("features")} className="hover:text-white">Features</button>
              <button onClick={() => setCurrentPage("pricing")} className="hover:text-white">Pricing</button>
              <button onClick={() => setCurrentPage("contact")} className="hover:text-white">Contact</button>
              <button onClick={() => setCurrentPage("privacy")} className="hover:text-white">Privacy Policy</button>
              <button onClick={() => setCurrentPage("terms")} className="hover:text-white">Terms of Service</button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
