import React, { useState } from "react";
import {
  Globe,
  Palette,
  FileText,
  Eye,
  Settings2,
  Plus,
  Trash2,
  CheckCircle,
  Save,
  Upload,
  Sparkles,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  Layers,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Video,
  Edit3,
  ShieldCheck,
  Megaphone,
  Check,
  RefreshCw,
  Search,
  Code,
  Share2,
} from "lucide-react";
import { WebsitePage, WebsiteSection, WebsiteThemeConfig, UserRole } from "../../types";

interface WebsiteBuilderViewProps {
  currentRole?: UserRole;
}

const DEFAULT_THEME: WebsiteThemeConfig = {
  schoolName: "LIVINGSTONE INTERNATIONAL ACADEMY",
  tagline: "Empowerment, Character & Academic Excellence",
  logoUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80",
  primaryColor: "#1e3a8a", // Royal Blue
  accentColor: "#d97706", // Amber / Gold
  fontFamily: "Plus Jakarta Sans",
  headerStyle: "topbar",
  showAnnouncementBanner: true,
  announcementText: "🎉 2026/2027 Academic Year Admission is Now Open! Entrance Exams commence Aug 15th.",
  customDomain: "www.livingstone.edu.ng",
  isLive: true,
  lastPublishedAt: "Today at 04:15 PM",
};

const INITIAL_PAGES: WebsitePage[] = [
  {
    id: "page-home",
    title: "Home",
    slug: "home",
    isPublished: true,
    isSystemDefault: true,
    metaDescription: "Official website of Livingstone International Academy - Excellence in Early Years, Primary and Secondary Education.",
    sections: [
      {
        id: "sec-hero",
        type: "hero",
        title: "Welcome to Livingstone International Academy",
        subtitle: "Building World-Class Leaders, Innovators & Visionaries",
        content: "Discover a transformative education where academic rigor meets character development in a state-of-the-art learning environment.",
        imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
        ctaText: "Apply For Admission",
        ctaLink: "#admissions",
      },
      {
        id: "sec-welcome",
        type: "welcome",
        title: "Message From The Head of School",
        subtitle: "Dr. Elizabeth Livingstone",
        content: "Welcome to Livingstone! For over two decades, our commitment has been to foster curiosity, integrity, and resilience in every child. We provide an inspiring dual-curriculum that prepares students for global university success.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "sec-features",
        type: "features",
        title: "Why Choose Livingstone?",
        subtitle: "World-class facilities and holistic educational standards",
        items: [
          {
            id: "feat-1",
            title: "Dual Accreditation",
            description: "Cambridge International & National Curriculum synergy.",
            icon: "Award",
          },
          {
            id: "feat-2",
            title: "STEM & Robotics Labs",
            description: "Cutting-edge artificial intelligence, coding and science facilities.",
            icon: "Sparkles",
          },
          {
            id: "feat-3",
            title: "Modern Boarding",
            description: "Safe, serene and nurturing residential halls with 24/7 care.",
            icon: "Home",
          },
          {
            id: "feat-4",
            title: "100% Exam Pass Rate",
            description: "Consistent top scores in WAEC, IGCSE, and SAT assessments.",
            icon: "CheckCircle",
          },
        ],
      },
      {
        id: "sec-stats",
        type: "stats",
        title: "Livingstone By The Numbers",
        items: [
          { id: "st-1", title: "Active Students", statValue: "1,450+" },
          { id: "st-2", title: "Certified Educators", statValue: "120+" },
          { id: "st-3", title: "University Scholarship Rate", statValue: "98%" },
          { id: "st-4", title: "Sports & Club Trophies", statValue: "45+" },
        ],
      },
      {
        id: "sec-contact",
        type: "contact",
        title: "Get In Touch With Admissions",
        subtitle: "Plot 12, Educational Zone, Victoria Island Annex",
        content: "Admissions Office: +234 800 548 4647 | info@livingstone.edu.ng",
      },
    ],
  },
  {
    id: "page-about",
    title: "About Us",
    slug: "about-us",
    isPublished: true,
    isSystemDefault: true,
    metaDescription: "Learn about Livingstone's history, mission, core values, and governance team.",
    sections: [
      {
        id: "sec-about-hero",
        type: "hero",
        title: "Our Heritage & Vision",
        subtitle: "Shaping the leaders of tomorrow since 2004",
        content: "Livingstone International Academy was founded on the belief that every child possesses unique genius waiting to be unlocked.",
        imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80",
      },
      {
        id: "sec-about-text",
        type: "custom_text",
        title: "Mission & Core Values",
        content: "Core Values: Integrity, Innovation, Excellence, Discipline, and Empathy. We strive to instill these principles in every lesson and extracurricular endeavor.",
      },
    ],
  },
  {
    id: "page-academics",
    title: "Academics",
    slug: "academics",
    isPublished: true,
    isSystemDefault: true,
    metaDescription: "Explore our Early Years, Primary, Secondary, and Advanced Placement programs.",
    sections: [
      {
        id: "sec-acad-hero",
        type: "hero",
        title: "Academic Programs",
        subtitle: "Rigorous, balanced, and future-focused learning paths",
        imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "page-news",
    title: "News & Events",
    slug: "news-events",
    isPublished: true,
    isSystemDefault: false,
    metaDescription: "Stay updated with campus activities, sports meets, and academic achievements.",
    sections: [
      {
        id: "sec-news-1",
        type: "news",
        title: "Campus Highlights & Announcements",
        subtitle: "Latest happenings at Livingstone Academy",
        items: [
          {
            id: "nw-1",
            title: "Livingstone Robotics Team Wins National Championship",
            description: "Our high school STEM squad secured 1st position in the 2026 Innovation Challenge.",
          },
          {
            id: "nw-2",
            title: "Annual Inter-House Sports Competition Date Announced",
            description: "Join us at the Main Athletics Stadium on October 12th for a day of sportsmanship.",
          },
        ],
      },
    ],
  },
  {
    id: "page-contact",
    title: "Contact Us",
    slug: "contact",
    isPublished: true,
    isSystemDefault: true,
    metaDescription: "Contact details, campus map, and inquiry form for prospective parents.",
    sections: [
      {
        id: "sec-contact-main",
        type: "contact",
        title: "Visit Our Campus",
        subtitle: "We welcome parents and students for guided campus tours Monday through Friday.",
        content: "Email: admissions@livingstone.edu.ng | Phone: +234 800 548 4647",
      },
    ],
  },
];

export const WebsiteBuilderView: React.FC<WebsiteBuilderViewProps> = ({ currentRole }) => {
  const [activeTab, setActiveTab] = useState<"pages" | "editor" | "theme" | "preview" | "settings">("editor");
  const [pages, setPages] = useState<WebsitePage[]>(INITIAL_PAGES);
  const [selectedPageId, setSelectedPageId] = useState<string>("page-home");
  const [theme, setTheme] = useState<WebsiteThemeConfig>(DEFAULT_THEME);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewPageSlug, setPreviewPageSlug] = useState<string>("home");
  const [isSaved, setIsSaved] = useState(true);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>("sec-hero");

  // New Page Modal State
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageDescription, setNewPageDescription] = useState("");

  const selectedPage = pages.find((p) => p.id === selectedPageId) || pages[0];
  const canPublish = currentRole === "Super Admin" || currentRole === "School Administrator" || currentRole === "Principal";

  const handlePublish = () => {
    setTheme((prev) => ({
      ...prev,
      isLive: true,
      lastPublishedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  const handleUpdateTheme = (key: keyof WebsiteThemeConfig, value: any) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleAddPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle) return;
    const slug = newPageSlug || newPageTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newPage: WebsitePage = {
      id: `page-${Date.now()}`,
      title: newPageTitle,
      slug,
      isPublished: true,
      metaDescription: newPageDescription || `Page for ${newPageTitle}`,
      sections: [
        {
          id: `sec-${Date.now()}`,
          type: "hero",
          title: newPageTitle,
          subtitle: "Welcome to " + newPageTitle,
          content: "Customize this section using the visual editor.",
        },
      ],
    };

    setPages([...pages, newPage]);
    setSelectedPageId(newPage.id);
    setShowAddPageModal(false);
    setNewPageTitle("");
    setNewPageSlug("");
    setNewPageDescription("");
    setIsSaved(false);
  };

  const handleDeletePage = (pageId: string) => {
    const pageToDelete = pages.find((p) => p.id === pageId);
    if (pageToDelete?.isSystemDefault) {
      alert("System default pages cannot be deleted.");
      return;
    }
    if (confirm("Are you sure you want to delete this page?")) {
      const filtered = pages.filter((p) => p.id !== pageId);
      setPages(filtered);
      if (selectedPageId === pageId) {
        setSelectedPageId(filtered[0]?.id || "");
      }
      setIsSaved(false);
    }
  };

  const handleAddSection = (type: WebsiteSection["type"]) => {
    const newSection: WebsiteSection = {
      id: `sec-${Date.now()}`,
      type,
      title: `New ${type.toUpperCase()} Section`,
      subtitle: "Add your subtitle or section summary here",
      content: "Enter your content description here for website visitors.",
    };

    const updatedPages = pages.map((p) => {
      if (p.id === selectedPageId) {
        return { ...p, sections: [...p.sections, newSection] };
      }
      return p;
    });

    setPages(updatedPages);
    setEditingSectionId(newSection.id);
    setIsSaved(false);
  };

  const handleUpdateSection = (sectionId: string, updatedFields: Partial<WebsiteSection>) => {
    const updatedPages = pages.map((p) => {
      if (p.id === selectedPageId) {
        const updatedSections = p.sections.map((sec) => {
          if (sec.id === sectionId) {
            return { ...sec, ...updatedFields };
          }
          return sec;
        });
        return { ...p, sections: updatedSections };
      }
      return p;
    });

    setPages(updatedPages);
    setIsSaved(false);
  };

  const handleDeleteSection = (sectionId: string) => {
    const updatedPages = pages.map((p) => {
      if (p.id === selectedPageId) {
        return { ...p, sections: p.sections.filter((s) => s.id !== sectionId) };
      }
      return p;
    });
    setPages(updatedPages);
    if (editingSectionId === sectionId) {
      setEditingSectionId(null);
    }
    setIsSaved(false);
  };

  const handleMoveSection = (sectionId: string, direction: "up" | "down") => {
    const page = pages.find((p) => p.id === selectedPageId);
    if (!page) return;
    const index = page.sections.findIndex((s) => s.id === sectionId);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === page.sections.length - 1) return;

    const newSections = [...page.sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    const updatedPages = pages.map((p) => (p.id === selectedPageId ? { ...p, sections: newSections } : p));
    setPages(updatedPages);
    setIsSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Globe className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              School Website Builder
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {theme.isLive ? "Live & Synchronized" : "Draft Changes"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>Domain: <strong className="text-slate-700 dark:text-slate-200">{theme.customDomain}</strong></span>
            <span>•</span>
            <span>Last Published: {theme.lastPublishedAt}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("preview")}
            className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4 text-indigo-500" />
            <span>Interactive Preview</span>
          </button>

          <button
            onClick={() => setIsSaved(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>{isSaved ? "All Saved" : "Save Draft"}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={!canPublish}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all ${
              publishSuccess
                ? "bg-emerald-600 text-white"
                : canPublish
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30"
                : "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
            title={canPublish ? "Publish site updates to public domain" : "Requires Admin privileges to publish"}
          >
            {publishSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Published Successfully!</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Publish Website</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl px-4 pt-2 shadow-sm">
        <button
          onClick={() => setActiveTab("editor")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "editor"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Visual Page Content Editor</span>
        </button>

        <button
          onClick={() => setActiveTab("pages")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "pages"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Page Structure ({pages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("theme")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "theme"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Theme & Branding Customizer</span>
        </button>

        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "preview"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Site Preview</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "settings"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span>Domain & SEO Config</span>
        </button>
      </div>

      {/* TAB 1: VISUAL CONTENT EDITOR */}
      {activeTab === "editor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Select Page & Section List */}
          <div className="lg:col-span-4 space-y-4">
            {/* Page Selector */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                Select Active Page To Edit
              </label>
              <select
                value={selectedPageId}
                onChange={(e) => setSelectedPageId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              >
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (/{p.slug})
                  </option>
                ))}
              </select>
            </div>

            {/* Sections List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>Page Sections</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  {selectedPage.sections.length} blocks
                </span>
              </div>

              <div className="space-y-2">
                {selectedPage.sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                      editingSectionId === sec.id
                        ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div
                      onClick={() => setEditingSectionId(sec.id)}
                      className="flex-1 cursor-pointer min-w-0"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                          {sec.type}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {sec.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveSection(sec.id, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSection(sec.id, "down")}
                        disabled={idx === selectedPage.sections.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(sec.id)}
                        className="p-1 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Section Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-500 mb-2">Add New Section Block:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleAddSection("hero")}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded text-[11px] font-semibold text-left transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 text-indigo-500" /> Hero Banner
                  </button>
                  <button
                    onClick={() => handleAddSection("welcome")}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded text-[11px] font-semibold text-left transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 text-indigo-500" /> Welcome Msg
                  </button>
                  <button
                    onClick={() => handleAddSection("features")}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded text-[11px] font-semibold text-left transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 text-indigo-500" /> Highlights Grid
                  </button>
                  <button
                    onClick={() => handleAddSection("stats")}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded text-[11px] font-semibold text-left transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 text-indigo-500" /> Stats Counter
                  </button>
                  <button
                    onClick={() => handleAddSection("news")}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded text-[11px] font-semibold text-left transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 text-indigo-500" /> News & Events
                  </button>
                  <button
                    onClick={() => handleAddSection("contact")}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded text-[11px] font-semibold text-left transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 text-indigo-500" /> Contact Info
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Section Content Inspector / Form */}
          <div className="lg:col-span-8">
            {editingSectionId ? (
              (() => {
                const activeSection = selectedPage.sections.find((s) => s.id === editingSectionId);
                if (!activeSection) return null;

                return (
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                          Editing {activeSection.type} Block
                        </span>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          Section Content Customizer
                        </h2>
                      </div>
                      <button
                        onClick={() => handleDeleteSection(activeSection.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove Block
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Section Title */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Main Title / Heading
                        </label>
                        <input
                          type="text"
                          value={activeSection.title}
                          onChange={(e) =>
                            handleUpdateSection(activeSection.id, { title: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Subtitle */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Subtitle / Tagline
                        </label>
                        <input
                          type="text"
                          value={activeSection.subtitle || ""}
                          onChange={(e) =>
                            handleUpdateSection(activeSection.id, { subtitle: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Content Body */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Description / Text Body
                        </label>
                        <textarea
                          rows={4}
                          value={activeSection.content || ""}
                          onChange={(e) =>
                            handleUpdateSection(activeSection.id, { content: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                          placeholder="Write detailed paragraph content..."
                        />
                      </div>

                      {/* Image URL Picker */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-indigo-500" /> Image URL / Media Asset
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={activeSection.imageUrl || ""}
                            onChange={(e) =>
                              handleUpdateSection(activeSection.id, { imageUrl: e.target.value })
                            }
                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                            placeholder="https://..."
                          />
                        </div>
                        {activeSection.imageUrl && (
                          <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-slate-200">
                            <img
                              src={activeSection.imageUrl}
                              alt="Section preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* CTA Button Link */}
                      {activeSection.type === "hero" && (
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Call To Action Button Text
                            </label>
                            <input
                              type="text"
                              value={activeSection.ctaText || ""}
                              onChange={(e) =>
                                handleUpdateSection(activeSection.id, { ctaText: e.target.value })
                              }
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
                              placeholder="e.g. Apply Now"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Button Target Link
                            </label>
                            <input
                              type="text"
                              value={activeSection.ctaLink || ""}
                              onChange={(e) =>
                                handleUpdateSection(activeSection.id, { ctaLink: e.target.value })
                              }
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
                              placeholder="e.g. #admissions"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
                <Edit3 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Select a section from the left list to edit its content.
                </h3>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PAGE STRUCTURE */}
      {activeTab === "pages" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Website Pages & Navigation Menu
              </h2>
              <p className="text-xs text-slate-500">
                Manage all published pages and site hierarchy on livingstone.edu.ng
              </p>
            </div>
            <button
              onClick={() => setShowAddPageModal(true)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" /> Add New Page
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  <th className="py-3 px-4">Page Title</th>
                  <th className="py-3 px-4">URL Slug</th>
                  <th className="py-3 px-4">Sections</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span>{p.title}</span>
                      {p.isSystemDefault && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                          System Default
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-indigo-600 dark:text-indigo-400">
                      /{p.slug}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">
                      {p.sections.length} section blocks
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Published
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPageId(p.id);
                          setActiveTab("editor");
                        }}
                        className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-semibold hover:bg-indigo-100"
                      >
                        Edit Content
                      </button>
                      {!p.isSystemDefault && (
                        <button
                          onClick={() => handleDeletePage(p.id)}
                          className="px-2 py-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: THEME & BRANDING CUSTOMIZER */}
      {activeTab === "theme" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-500" />
              <span>School Branding & Color Palette</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                School Display Name
              </label>
              <input
                type="text"
                value={theme.schoolName}
                onChange={(e) => handleUpdateTheme("schoolName", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Motto / Tagline
              </label>
              <input
                type="text"
                value={theme.tagline}
                onChange={(e) => handleUpdateTheme("tagline", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Theme Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handleUpdateTheme("primaryColor", e.target.value)}
                    className="w-9 h-9 rounded cursor-pointer border"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => handleUpdateTheme("primaryColor", e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Accent Gold / Highlight Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => handleUpdateTheme("accentColor", e.target.value)}
                    className="w-9 h-9 rounded cursor-pointer border"
                  />
                  <input
                    type="text"
                    value={theme.accentColor}
                    onChange={(e) => handleUpdateTheme("accentColor", e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Typography Font Family
              </label>
              <select
                value={theme.fontFamily}
                onChange={(e) => handleUpdateTheme("fontFamily", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
                <option value="Playfair Display">Playfair Display (Academic Serif)</option>
                <option value="Inter">Inter (Minimalist Standard)</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-500" />
              <span>Announcement Bar & Top Notification</span>
            </h2>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Enable Announcement Banner
                </h4>
                <p className="text-[11px] text-slate-500">
                  Displays a highlighted bar at the top of the school website
                </p>
              </div>
              <input
                type="checkbox"
                checked={theme.showAnnouncementBanner}
                onChange={(e) => handleUpdateTheme("showAnnouncementBanner", e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            {theme.showAnnouncementBanner && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Banner Text Message
                </label>
                <textarea
                  rows={3}
                  value={theme.announcementText}
                  onChange={(e) => handleUpdateTheme("announcementText", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LIVE SITE PREVIEW MODE */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          {/* Device Viewport Bar */}
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Device View:</span>
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold ${
                  previewDevice === "desktop"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Laptop className="w-4 h-4" /> Desktop
              </button>
              <button
                onClick={() => setPreviewDevice("tablet")}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold ${
                  previewDevice === "tablet"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Tablet className="w-4 h-4" /> Tablet
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold ${
                  previewDevice === "mobile"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Smartphone className="w-4 h-4" /> Mobile
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Page:</span>
              <select
                value={previewPageSlug}
                onChange={(e) => setPreviewPageSlug(e.target.value)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-semibold text-slate-900 dark:text-slate-100"
              >
                {pages.map((p) => (
                  <option key={p.id} value={p.slug}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rendered School Website Frame */}
          <div className="flex justify-center bg-slate-200 dark:bg-slate-950 p-6 rounded-xl min-h-[650px] overflow-x-auto">
            <div
              className={`bg-white text-slate-900 shadow-2xl rounded-lg overflow-hidden transition-all duration-300 ${
                previewDevice === "desktop"
                  ? "w-full max-w-5xl"
                  : previewDevice === "tablet"
                  ? "w-[768px]"
                  : "w-[375px]"
              }`}
            >
              {/* Top Announcement Bar */}
              {theme.showAnnouncementBanner && (
                <div
                  style={{ backgroundColor: theme.accentColor }}
                  className="px-4 py-2 text-white text-xs font-bold text-center"
                >
                  {theme.announcementText}
                </div>
              )}

              {/* Website Public Header */}
              <header
                style={{ backgroundColor: theme.primaryColor }}
                className="px-6 py-4 text-white flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white text-indigo-900 flex items-center justify-center font-black text-lg shadow">
                    L
                  </div>
                  <div>
                    <h1 className="text-base font-extrabold tracking-wide">{theme.schoolName}</h1>
                    <p className="text-[10px] text-amber-200 opacity-90">{theme.tagline}</p>
                  </div>
                </div>

                <nav className="hidden md:flex items-center gap-4 text-xs font-bold">
                  {pages.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPreviewPageSlug(p.slug)}
                      className={`hover:text-amber-300 transition-colors ${
                        previewPageSlug === p.slug ? "text-amber-300 underline" : "text-white/90"
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                  <button className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-[11px] shadow">
                    Student Portal
                  </button>
                </nav>
              </header>

              {/* Active Page Public View */}
              <main className="min-h-[450px]">
                {(() => {
                  const activePageObj =
                    pages.find((p) => p.slug === previewPageSlug) || pages[0];

                  return (
                    <div>
                      {activePageObj.sections.map((sec) => {
                        if (sec.type === "hero") {
                          return (
                            <div
                              key={sec.id}
                              className="relative bg-slate-900 text-white py-16 px-8 text-center bg-cover bg-center"
                              style={{
                                backgroundImage: sec.imageUrl ? `url(${sec.imageUrl})` : undefined,
                              }}
                            >
                              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"></div>
                              <div className="relative z-10 max-w-2xl mx-auto space-y-3">
                                <h2 className="text-2xl md:text-3xl font-black">{sec.title}</h2>
                                <p className="text-amber-300 font-bold text-sm">{sec.subtitle}</p>
                                <p className="text-slate-200 text-xs leading-relaxed">{sec.content}</p>
                                {sec.ctaText && (
                                  <button
                                    style={{ backgroundColor: theme.accentColor }}
                                    className="mt-4 px-5 py-2.5 rounded-lg text-xs font-black text-white shadow-lg hover:opacity-95"
                                  >
                                    {sec.ctaText}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        }

                        if (sec.type === "welcome") {
                          return (
                            <div key={sec.id} className="py-12 px-8 bg-slate-50 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                              {sec.imageUrl && (
                                <div className="md:col-span-4">
                                  <img
                                    src={sec.imageUrl}
                                    alt="Head of school"
                                    className="w-full h-56 object-cover rounded-xl shadow"
                                  />
                                </div>
                              )}
                              <div className={sec.imageUrl ? "md:col-span-8" : "md:col-span-12"}>
                                <h3 className="text-xl font-bold text-slate-900">{sec.title}</h3>
                                <p className="text-xs font-bold text-indigo-700 mt-0.5">{sec.subtitle}</p>
                                <p className="text-xs text-slate-600 mt-3 leading-relaxed">{sec.content}</p>
                              </div>
                            </div>
                          );
                        }

                        if (sec.type === "features") {
                          return (
                            <div key={sec.id} className="py-12 px-8 bg-white">
                              <div className="text-center max-w-md mx-auto mb-8">
                                <h3 className="text-xl font-bold text-slate-900">{sec.title}</h3>
                                <p className="text-xs text-slate-500">{sec.subtitle}</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {sec.items?.map((it) => (
                                  <div key={it.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:shadow-md transition-shadow">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-2">
                                      ★
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-900">{it.title}</h4>
                                    <p className="text-[11px] text-slate-500 mt-1">{it.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        if (sec.type === "stats") {
                          return (
                            <div key={sec.id} style={{ backgroundColor: theme.primaryColor }} className="py-10 px-8 text-white text-center">
                              <h3 className="text-lg font-bold mb-6">{sec.title}</h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {sec.items?.map((st) => (
                                  <div key={st.id} className="p-3 bg-white/10 rounded-lg">
                                    <span className="text-2xl font-black text-amber-300">{st.statValue}</span>
                                    <p className="text-[11px] text-white/80 font-semibold">{st.title}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={sec.id} className="py-8 px-8 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">{sec.title}</h3>
                            <p className="text-xs text-slate-600 mt-2">{sec.content}</p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </main>

              {/* Public Website Footer */}
              <footer style={{ backgroundColor: theme.primaryColor }} className="px-6 py-6 text-white border-t border-white/10 text-xs">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-bold">{theme.schoolName}</p>
                    <p className="text-[10px] text-white/70">
                      © 2026 LIVINGSTONEEDU Platform. All Rights Reserved.
                    </p>
                  </div>
                  <div className="flex gap-3 text-[11px]">
                    <a href="#privacy" className="hover:underline">Privacy Policy</a>
                    <a href="#terms" className="hover:underline">Terms of Admission</a>
                    <a href="#portal" className="hover:underline">Staff Portal</a>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DOMAIN & SEO CONFIG */}
      {activeTab === "settings" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-500" />
            <span>Domain Mapping & SEO Integration</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Custom Domain URL
              </label>
              <input
                type="text"
                value={theme.customDomain}
                onChange={(e) => handleUpdateTheme("customDomain", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Point CNAME record to <code className="text-indigo-600">dns.livingstone.edu.ng</code>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Google Analytics / Tracking ID
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PAGE MODAL */}
      {showAddPageModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-500" />
                <span>Create New Website Page</span>
              </h3>
              <button
                onClick={() => setShowAddPageModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPage} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Page Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sports & Athletics"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Slug (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. sports-athletics"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Meta Description (SEO)
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary for search engines..."
                  value={newPageDescription}
                  onChange={(e) => setNewPageDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPageModal(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow"
                >
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
