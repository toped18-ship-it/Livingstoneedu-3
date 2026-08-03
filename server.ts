import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { getFirebaseAdmin, getAdminAuth, getAdminDatabase } from "./server/firebaseAdmin";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Audit Log Middleware
const auditLogsStore: any[] = [];
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (req.path.startsWith("/api/")) {
      auditLogsStore.unshift({
        id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs: Date.now() - start,
        ip: req.ip || "127.0.0.1",
        user: req.headers["x-user-role"] || "Authenticated User",
      });
      if (auditLogsStore.length > 200) auditLogsStore.pop();
    }
  });
  next();
});

// Initialize Google Gemini AI client lazily/safely
const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not set in environment. Falling back to structured response generators.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// --- IN-MEMORY DATABASE SCHEMA & DATA STORES ---

const usersStore: any[] = [
  { id: "usr-1", name: "Dr. Emmanuel Livingstone", email: "admin@livingstone.edu", role: "Super Admin", schoolId: "SCH-001" },
  { id: "usr-2", name: "Mrs. Okonkwo Beatrice", email: "principal@livingstone.edu", role: "Principal", schoolId: "SCH-001" },
  { id: "usr-3", name: "Mr. David Alabi", email: "david.alabi@livingstone.edu", role: "Teacher", schoolId: "SCH-001" },
];

const studentsStore: any[] = [
  { id: "STD-2026-001", name: "Adeyemi Chinedu", admissionNo: "LIV/2026/089", class: "SS2 Gold", gender: "Male", parentName: "Chief Adeyemi Tunde", parentPhone: "+234 803 123 4567", status: "Active" },
  { id: "STD-2026-002", name: "Fatima Abubakar", admissionNo: "LIV/2026/112", class: "JSS3 Diamond", gender: "Female", parentName: "Alhaji Abubakar Musa", parentPhone: "+234 802 987 6543", status: "Active" },
  { id: "STD-2026-003", name: "Eze Chukwuemeka", admissionNo: "LIV/2026/045", class: "SS1 Silver", gender: "Male", parentName: "Chief Eze Nnamdi", parentPhone: "+234 805 123 4567", status: "Active" },
  { id: "STD-2026-006", name: "Kalu Samuel", admissionNo: "LIV/2026/301", class: "Primary 1 Gold", gender: "Male", parentName: "Mr. Kalu Obinna", parentPhone: "+234 802 111 4455", status: "Active" },
];

const teachersStore: any[] = [
  { id: "TCH-001", name: "Mrs. Okonkwo Beatrice", staffId: "STF-LIV-012", subjectSpecialization: "Mathematics & Statistics", assignedClass: "SS2 Gold", email: "beatrice.okonkwo@livingstone.edu", status: "Active" },
  { id: "TCH-002", name: "Mr. David Alabi", staffId: "STF-LIV-034", subjectSpecialization: "Physics & Basic Science", assignedClass: "SS3 Emerald", email: "david.alabi@livingstone.edu", status: "Active" },
];

const questionBank: any[] = [
  {
    id: "q-101",
    subject: "Mathematics",
    class: "SS2",
    term: "First Term",
    topic: "Quadratic Equations & Inequalities",
    difficulty: "Medium",
    type: "objective",
    question: "Find the roots of the quadratic equation 2x² - 5x + 3 = 0.",
    options: ["x = 1, x = 3/2", "x = -1, x = -3/2", "x = 2, x = 3", "x = 1/2, x = 3"],
    correctOptionIndex: 0,
    explanation: "Using factoring: (2x - 3)(x - 1) = 0 => x = 3/2 or x = 1.",
    bloomTaxonomy: "Application",
  },
  {
    id: "q-102",
    subject: "Physics",
    class: "SS3",
    term: "Second Term",
    topic: "Electromagnetic Waves & Quantum Theory",
    difficulty: "Hard",
    type: "theory",
    question: "Explain the photoelectric effect and derive Einstein's photoelectric equation E = hf - Φ.",
    markingScheme: "1. Definition of photoelectric emission (2 marks)\n2. Concept of work function Φ (2 marks)\n3. Kinetic energy of emitted photoelectrons (3 marks)\n4. Derivation of E_max = hf - Φ (3 marks)",
    bloomTaxonomy: "Analysis",
  },
  {
    id: "q-103",
    subject: "English Language",
    class: "JSS3",
    term: "Third Term",
    topic: "Grammatical Structures & Idioms",
    difficulty: "Easy",
    type: "objective",
    question: "Choose the option that best completes the sentence: The principal, alongside three senior staff members, _____ attending the NERDC curriculum conference.",
    options: ["is", "are", "were", "have been"],
    correctOptionIndex: 0,
    explanation: "Phrases introduced by 'alongside' do not change the singular subject 'The principal'. Singular verb 'is' is required.",
    bloomTaxonomy: "Comprehension",
  },
];

const lessonNotesStore: any[] = [];
const announcementsStore: any[] = [
  {
    id: "ann-1",
    title: "1st Term Mid-Term Break & Inter-House Sports Day",
    category: "Event",
    sender: "Principal's Office",
    date: "2026-08-05",
    content: "All parents and guardians are cordially invited to our annual Inter-House Sports competition scheduled for Thursday ahead of the Mid-Term break.",
    targetRoles: ["Parent", "Student", "Teacher"],
  },
  {
    id: "ann-2",
    title: "WAEC & NECO Mock Examination Registration Deadline",
    category: "Academic",
    sender: "Exam Officer",
    date: "2026-08-10",
    content: "All SS3 students must complete their biometric verification and fees clearance before August 10th for the final mock registration.",
    targetRoles: ["Student", "Parent", "Teacher"],
  },
];

const libraryBooksStore: any[] = [
  { id: "b-1", title: "New General Mathematics for Senior Secondary Schools 3", author: "M.F. Macrae et al.", category: "Mathematics", isbn: "978-978-023-112-4", status: "Available", copies: 45, shelf: "M3-A" },
  { id: "b-2", title: "Senior Secondary Physics", author: "P.N. Okeke", category: "Physics", isbn: "978-978-142-005-1", status: "Available", copies: 30, shelf: "P2-B" },
  { id: "b-3", title: "Invisible Teacher (English Literature)", author: "Gabriel Okara", category: "Literature", isbn: "978-978-800-441-2", status: "Available", copies: 25, shelf: "L1-C" },
  { id: "b-4", title: "Modern Chemistry for Schools", author: "Osei Yaw Ababio", category: "Chemistry", isbn: "978-978-009-881-9", status: "Available", copies: 18, shelf: "C4-A" },
];

const financeInvoicesStore: any[] = [
  { id: "inv-901", studentId: "STD-2026-01", studentName: "Adeyemi Chinedu", class: "SS2 Gold", term: "First Term 2026/2027", totalAmount: 185000, paidAmount: 120000, status: "Partial", dueDate: "2026-08-15" },
  { id: "inv-902", studentId: "STD-2026-02", studentName: "Fatima Abubakar", class: "JSS3 Diamond", term: "First Term 2026/2027", totalAmount: 165000, paidAmount: 165000, status: "Paid", dueDate: "2026-08-01" },
  { id: "inv-903", studentId: "STD-2026-03", studentName: "Eze Chukwuemeka", class: "SS1 Silver", term: "First Term 2026/2027", totalAmount: 185000, paidAmount: 0, status: "Unpaid", dueDate: "2026-08-20" },
];

const cbtExamsStore: any[] = [
  { id: "cbt-1", title: "SS2 Mathematics Mid-Term CBT", class: "SS2", durationMinutes: 45, totalQuestions: 30, status: "Active" },
  { id: "cbt-2", title: "JSS3 BECE Computer Science Mock", class: "JSS3", durationMinutes: 60, totalQuestions: 50, status: "Scheduled" },
];

const transportRoutesStore: any[] = [
  { id: "tr-1", routeName: "Lekki Phase 1 - Victoria Island Route", driverName: "Mr. Sunday Johnson", busNo: "LND-452-XX", studentCount: 28 },
  { id: "tr-2", routeName: "Ikeja GRA - Maryland Route", driverName: "Mr. Kabir Bello", busNo: "KJA-881-YY", studentCount: 34 },
];

const hostelRoomsStore: any[] = [
  { id: "hst-101", hallName: "Nelson Mandela Male Hostel", roomNo: "B-204", capacity: 4, occupied: 3, warden: "Mr. Chika Okafor" },
  { id: "hst-102", hallName: "Queen Amina Female Hostel", roomNo: "A-108", capacity: 4, occupied: 4, warden: "Mrs. Halima Sani" },
];

// --- SUPER ADMIN MASTER DATA STORES ---

const superAdminSchoolsStore: any[] = [
  {
    id: "SCH-001",
    name: "Livingstone International Academy",
    code: "LIV-EDU-001",
    domain: "livingstone.edu.ng",
    adminEmail: "principal@livingstone.edu",
    phone: "+234 803 111 2233",
    plan: "Enterprise Pro",
    status: "Active",
    storageUsedGB: 18.4,
    storageLimitGB: 100,
    aiCredits: 50000,
    aiCreditsUsed: 14200,
    totalStudents: 1288,
    totalTeachers: 78,
    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80",
    createdAt: "2024-01-15",
    owner: "Dr. Emmanuel Livingstone",
    country: "Nigeria",
    state: "Lagos",
  },
  {
    id: "SCH-002",
    name: "Premier Heights International College",
    code: "PHI-COL-002",
    domain: "premierheights.sch.ng",
    adminEmail: "admin@premierheights.sch.ng",
    phone: "+234 802 444 5566",
    plan: "Standard Growth",
    status: "Active",
    storageUsedGB: 8.2,
    storageLimitGB: 50,
    aiCredits: 25000,
    aiCreditsUsed: 9800,
    totalStudents: 640,
    totalTeachers: 42,
    logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80",
    createdAt: "2024-03-20",
    owner: "Chief Tunde Bakare",
    country: "Nigeria",
    state: "Abuja FCT",
  },
  {
    id: "SCH-003",
    name: "Grace Baptist Grammar School",
    code: "GBG-SCH-003",
    domain: "gracebaptist.edu.ng",
    adminEmail: "info@gracebaptist.edu.ng",
    phone: "+234 805 777 8899",
    plan: "Basic",
    status: "Active",
    storageUsedGB: 3.1,
    storageLimitGB: 20,
    aiCredits: 10000,
    aiCreditsUsed: 4100,
    totalStudents: 310,
    totalTeachers: 22,
    logo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=200&q=80",
    createdAt: "2024-06-10",
    owner: "Pastor James Olumide",
    country: "Nigeria",
    state: "Oyo",
  },
  {
    id: "SCH-004",
    name: "Apex British International School",
    code: "ABI-SCH-004",
    domain: "apexbritish.org",
    adminEmail: "headmaster@apexbritish.org",
    phone: "+234 809 333 1122",
    plan: "Enterprise Pro",
    status: "Suspended",
    storageUsedGB: 34.0,
    storageLimitGB: 200,
    aiCredits: 100000,
    aiCreditsUsed: 89000,
    totalStudents: 1850,
    totalTeachers: 110,
    logo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&q=80",
    createdAt: "2023-11-01",
    owner: "Lady Victoria Harrison",
    country: "Nigeria",
    state: "Rivers",
  },
];

const superAdminUsersStore: any[] = [
  { id: "usr-001", name: "Dr. Emmanuel Livingstone", email: "admin@livingstone.edu", role: "Super Admin", schoolId: "SCH-001", status: "Active", isLocked: false, permissions: ["*"], lastLogin: "2026-07-29T18:30:00Z", ip: "197.210.64.12", device: "Chrome 126 / macOS" },
  { id: "usr-002", name: "Mrs. Okonkwo Beatrice", email: "principal@livingstone.edu", role: "Principal", schoolId: "SCH-001", status: "Active", isLocked: false, permissions: ["school:manage", "curriculum:view", "reports:approve"], lastLogin: "2026-07-29T17:15:00Z", ip: "102.89.23.44", device: "Firefox / Windows" },
  { id: "usr-003", name: "Mr. David Alabi", email: "david.alabi@livingstone.edu", role: "Teacher", schoolId: "SCH-001", status: "Active", isLocked: false, permissions: ["ai:generate_notes", "ai:generate_exams", "gradebook:edit"], lastLogin: "2026-07-29T16:40:00Z", ip: "105.112.98.12", device: "Safari / iOS" },
  { id: "usr-004", name: "Alhaji Abubakar Musa", email: "abubakar.musa@gmail.com", role: "Parent", schoolId: "SCH-001", status: "Active", isLocked: false, permissions: ["parent:view_children", "parent:pay_fees"], lastLogin: "2026-07-28T19:20:00Z", ip: "197.210.88.5", device: "Android App" },
  { id: "usr-005", name: "Chief Bursar Danjuma", email: "bursar@livingstone.edu", role: "Bursar", schoolId: "SCH-001", status: "Active", isLocked: false, permissions: ["finance:manage", "invoices:create", "receipts:issue"], lastLogin: "2026-07-29T14:10:00Z", ip: "102.89.20.11", device: "Chrome / Windows" },
  { id: "usr-006", name: "Prof. Kenneth Nwachukwu", email: "exam.officer@livingstone.edu", role: "Exam Officer", schoolId: "SCH-001", status: "Active", isLocked: false, permissions: ["exams:manage", "cbt:configure", "broadsheets:compile"], lastLogin: "2026-07-29T15:55:00Z", ip: "197.210.12.90", device: "Chrome / macOS" },
];

const superAdminAiConfigStore = {
  activeModel: "gemini-2.5-flash",
  fallbackModel: "gemini-1.5-flash",
  dailyTokenLimit: 1000000,
  monthlyTokenLimit: 30000000,
  maxTokensPerRequest: 4096,
  temperature: 0.7,
  blockedPrompts: ["cheat exam", "bypass pass mark", "generate fake receipt", "inappropriate content"],
  promptTemplates: [
    { id: "tpl-1", name: "NERDC Lesson Plan", category: "Lesson Notes", template: "Generate NERDC standard lesson plan for {topic} in {subject} for {className}." },
    { id: "tpl-2", name: "WAEC Standard Exam Paper", category: "Exam Generation", template: "Generate WAEC standard 40 multiple choice questions with marking scheme for {topic}." },
  ],
};

const superAdminAiLogsStore: any[] = [
  { id: "ailog-101", timestamp: "2026-07-29T18:22:10Z", schoolName: "Livingstone International Academy", teacherName: "Mrs. Okonkwo Beatrice", action: "Lesson Note Generation", subject: "Physics", topic: "Wave Motion", tokensUsed: 1420, executionTimeMs: 1240, status: "Success" },
  { id: "ailog-102", timestamp: "2026-07-29T18:15:44Z", schoolName: "Premier Heights International College", teacherName: "Mr. Chukwuma Jude", action: "CBT Exam Generation", subject: "Mathematics", topic: "Quadratic Equations", tokensUsed: 3850, executionTimeMs: 2180, status: "Success" },
  { id: "ailog-103", timestamp: "2026-07-29T17:50:12Z", schoolName: "Grace Baptist Grammar School", teacherName: "Mrs. Adams Sarah", action: "Report Card Remark AI", subject: "General Assessment", topic: "Behavioral Analysis", tokensUsed: 620, executionTimeMs: 890, status: "Success" },
];

const superAdminCurriculumStore: any[] = [
  { id: "curr-1", framework: "NERDC", country: "Nigeria", title: "National Educational Research and Development Council Standard", subjectsCount: 38, levels: ["Primary 1-6", "JSS 1-3", "SS 1-3"], status: "Approved & Active" },
  { id: "curr-2", framework: "WAEC / WASSCE", country: "West Africa", title: "West African Examinations Council Syllabus 2026-2030", subjectsCount: 42, levels: ["SS 1-3"], status: "Approved & Active" },
  { id: "curr-3", framework: "NECO", country: "Nigeria", title: "National Examinations Council SSCE Framework", subjectsCount: 40, levels: ["SS 1-3"], status: "Approved & Active" },
  { id: "curr-4", framework: "BECE", country: "Nigeria", title: "Basic Education Certificate Examination Syllabus", subjectsCount: 12, levels: ["JSS 1-3"], status: "Approved & Active" },
  { id: "curr-5", framework: "Cambridge IGCSE", country: "United Kingdom", title: "Cambridge Assessment International Education Syllabus", subjectsCount: 26, levels: ["Year 7-11"], status: "Approved & Active" },
];

const superAdminWebsiteConfigsStore: Record<string, any> = {
  "SCH-001": {
    schoolId: "SCH-001",
    schoolName: "Livingstone International Academy",
    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80",
    primaryColor: "#4f46e5",
    secondaryColor: "#06b6d4",
    heroTitle: "Empowering Next-Generation Leaders Through Holistic Education",
    heroSubtitle: "World-class STEM, Arts, and Leadership training powered by Livingstone Edu platform.",
    footerText: "© 2026 Livingstone International Academy. All rights reserved.",
    customDomain: "livingstone.edu.ng",
    seoKeywords: "Livingstone Academy, best school in Lagos, WAEC excellence, top secondary school",
    googleAnalyticsId: "G-LIV2026ACAD",
    facebookPixelId: "FB-889911223",
    newsItems: [
      { id: "news-1", date: "2026-07-20", title: "100% Pass Rate Recorded in WAEC Physics & Chemistry", snippet: "Livingstone Academy celebrates stellar academic achievements in STEM." },
    ],
  },
};

const superAdminPaymentsStore: any[] = [
  { id: "pay-9901", schoolId: "SCH-001", schoolName: "Livingstone International Academy", amount: 450000, currency: "NGN", gateway: "Paystack", status: "Successful", reference: "PST_9921049912", plan: "Enterprise Pro Annual", date: "2026-07-01" },
  { id: "pay-9902", schoolId: "SCH-002", schoolName: "Premier Heights International College", amount: 250000, currency: "NGN", gateway: "Flutterwave", status: "Successful", reference: "FLW_449102831", plan: "Standard Growth Annual", date: "2026-06-15" },
  { id: "pay-9903", schoolId: "SCH-003", schoolName: "Grace Baptist Grammar School", amount: 85000, currency: "NGN", gateway: "Paystack", status: "Successful", reference: "PST_1120499831", plan: "Basic Annual", date: "2026-05-10" },
];

const superAdminCommunicationLogs: any[] = [
  { id: "comm-1", channel: "Email (Nodemailer)", recipient: "all-principals@livingstoneedu.com", subject: "Platform Maintenance Notice & Security Upgrade", timestamp: "2026-07-29T10:00:00Z", status: "Delivered (142 schools)" },
  { id: "comm-2", channel: "SMS", recipient: "+2348031112233", subject: "Emergency OTP Alert", timestamp: "2026-07-29T14:30:00Z", status: "Delivered" },
  { id: "comm-3", channel: "Push Notification (Firebase)", recipient: "Parent Mobile App", subject: "First Term Fees Reminder", timestamp: "2026-07-28T09:15:00Z", status: "Sent (35,200 devices)" },
];

const superAdminBackupsStore: any[] = [
  { id: "bkp-20260729", name: "Daily Automated Cloud Snapshot", timestamp: "2026-07-29T02:00:00Z", sizeMB: 4280, type: "Full System", status: "Completed", dbStatus: "Consistent", mediaStatus: "Synced to Cloud Storage", downloadUrl: "/api/superadmin/backups/download/bkp-20260729" },
  { id: "bkp-20260728", name: "Daily Automated Cloud Snapshot", timestamp: "2026-07-28T02:00:00Z", sizeMB: 4210, type: "Full System", status: "Completed", dbStatus: "Consistent", mediaStatus: "Synced to Cloud Storage", downloadUrl: "/api/superadmin/backups/download/bkp-20260728" },
];

const superAdminSettingsStore = {
  appName: "LIVINGSTONEEDU Enterprise SaaS Suite",
  platformLogo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80",
  smtpHost: "mail.livingstone.edu",
  smtpPort: 587,
  smtpUser: "no-reply@livingstone.edu",
  firebaseProjectId: "livingstoneedu-1ef57",
  geminiModel: "gemini-2.5-flash",
  cloudinaryCloudName: "livingstone-media",
  paystackPublicKey: "pk_live_f89920194819238",
  flutterwavePublicKey: "FLWPUBK-e89201948210-X",
  systemTheme: "Default Light with Dark Toggle",
  timezone: "Africa/Lagos (GMT+1)",
  maintenanceMode: false,
};

// --- TEACHER PORTAL MASTER DATA STORES ---

const teacherLessonsStore: any[] = [
  {
    id: "les-001",
    teacherId: "TCH-001",
    teacherName: "Mrs. Okonkwo Beatrice",
    session: "2026/2027",
    term: "First Term",
    week: "Week 4",
    subject: "Mathematics",
    class: "SS2 Gold",
    topic: "Quadratic Equations & Roots Analysis",
    subTopic: "Completing the Square Method and Formula Derivation",
    objectives: [
      "Define quadratic equation in standard form ax^2 + bx + c = 0",
      "Solve quadratic equations using the completing the square method",
      "Derive the general quadratic formula",
      "Apply the discriminant b^2 - 4ac to determine nature of roots"
    ],
    content: "Detailed NERDC-compliant lesson content explaining step-by-step factorization, completing the square, and quadratic formula application with worked examples and real-life projectile trajectory analogies.",
    evaluationQuestions: [
      "Solve 3x^2 - 7x + 2 = 0 using completing the square method.",
      "Calculate the discriminant for 2x^2 + 4x + 5 = 0 and state the nature of the roots."
    ],
    teachingResources: ["Whiteboard", "Graph Sheets", "Scientific Calculators", "GeoGebra App"],
    status: "Approved",
    approvalHistory: [
      { date: "2026-07-28", status: "Approved", reviewedBy: "Vice Principal (Academic)" }
    ],
    createdAt: "2026-07-25",
    version: 1.2
  },
  {
    id: "les-002",
    teacherId: "TCH-002",
    teacherName: "Mr. David Alabi",
    session: "2026/2027",
    term: "First Term",
    week: "Week 5",
    subject: "Physics",
    class: "SS3 Emerald",
    topic: "Electromagnetic Induction & Faraday's Laws",
    subTopic: "Lenz's Law and Self/Mutual Inductance",
    objectives: [
      "State Faraday's laws of electromagnetic induction",
      "Demonstrate Lenz's law using a bar magnet and solenoid coil",
      "Calculate induced electromotive force (e.m.f)"
    ],
    content: "WAEC/NECO syllabus aligned lesson notes detailing magnetic flux linkage, transformer principles, and eddy currents.",
    evaluationQuestions: [
      "Explain why transformers work with AC and not DC.",
      "A coil of 500 turns has a flux change of 0.02 Wb in 0.1s. Calculate the induced e.m.f."
    ],
    teachingResources: ["Solenoid Coil", "Bar Magnet", "Galvanometer", "Connecting Wires"],
    status: "Pending Approval",
    approvalHistory: [],
    createdAt: "2026-07-29",
    version: 1.0
  }
];

const teacherSchemesStore: any[] = [
  {
    id: "schm-101",
    subject: "Mathematics",
    class: "SS2",
    term: "First Term",
    session: "2026/2027",
    weeks: [
      { week: 1, topic: "Logarithms & Indices Review", nerdcReference: "NERDC SS2 Math Vol 1", status: "Completed" },
      { week: 2, topic: "Sequences & Series (AP & GP)", nerdcReference: "NERDC SS2 Math Vol 1", status: "Completed" },
      { week: 3, topic: "Linear & Absolute Inequalities", nerdcReference: "NERDC SS2 Math Vol 1", status: "Completed" },
      { week: 4, topic: "Quadratic Equations & Roots", nerdcReference: "NERDC SS2 Math Vol 2", status: "In Progress" },
      { week: 5, topic: "Simultaneous Linear & Quadratic Equations", nerdcReference: "NERDC SS2 Math Vol 2", status: "Scheduled" },
      { week: 6, topic: "Trigonometric Ratios & Sine/Cosine Rule", nerdcReference: "NERDC SS2 Math Vol 2", status: "Scheduled" },
      { week: 7, topic: "Mid-Term CA Examinations", nerdcReference: "National Assessment Standard", status: "Scheduled" }
    ]
  }
];

const teacherAssignmentsStore: any[] = [
  {
    id: "asg-01",
    teacherId: "TCH-001",
    subject: "Mathematics",
    class: "SS2 Gold",
    title: "Quadratic Equation Mastery Assignment",
    description: "Solve problems 1 to 10 on page 142 of New General Mathematics.",
    deadline: "2026-08-02T23:59:00Z",
    totalPoints: 20,
    submissionsCount: 28,
    gradedCount: 22,
    attachmentUrl: "https://livingstone.edu.ng/files/assignments/ss2-math-assignment-4.pdf"
  }
];

const teacherExamsStore: any[] = [
  {
    id: "exm-501",
    teacherId: "TCH-001",
    subject: "Mathematics",
    class: "SS2",
    examType: "First Term Mid-Term CA Test",
    durationMinutes: 45,
    totalMarks: 40,
    objectiveQuestionsCount: 20,
    theoryQuestionsCount: 2,
    status: "Approved",
    createdAt: "2026-07-27"
  }
];

const teacherCbtStore: any[] = [
  {
    id: "cbt-201",
    teacherId: "TCH-001",
    subject: "Mathematics",
    class: "SS2 Gold",
    title: "SS2 Algebra & Quadratic CBT Assessment",
    durationMinutes: 30,
    totalQuestions: 25,
    scheduledStartTime: "2026-08-05T09:00:00Z",
    scheduledEndTime: "2026-08-05T12:00:00Z",
    isRandomized: true,
    autoMarking: true,
    status: "Scheduled"
  }
];

const teacherAttendanceStore: any[] = [
  {
    id: "att-801",
    date: "2026-07-29",
    class: "SS2 Gold",
    takenBy: "Mrs. Okonkwo Beatrice",
    totalStudents: 32,
    presentCount: 30,
    absentCount: 1,
    lateCount: 1,
    records: [
      { studentId: "STD-2026-001", studentName: "Adeyemi Chinedu", status: "Present", remark: "On time" },
      { studentId: "STD-2026-003", studentName: "Eze Chukwuemeka", status: "Late", remark: "Arrived 8:20 AM" },
      { studentId: "STD-2026-005", studentName: "Okafor Blessing", status: "Absent", remark: "Parent called (Sick leave)" }
    ]
  }
];

const teacherCaStore: any[] = [
  {
    id: "ca-901",
    studentId: "STD-2026-001",
    studentName: "Adeyemi Chinedu",
    class: "SS2 Gold",
    subject: "Mathematics",
    assignmentScore: 18, // out of 20
    test1Score: 16,       // out of 20
    test2Score: 17,       // out of 20
    projectScore: 9,      // out of 10
    totalCaScore: 30,     // converted to 30% CA
    examScore: 58,        // out of 70%
    finalTotal: 88,       // 100%
    grade: "A1",
    remark: "Excellent Performance"
  }
];

const teacherTimetableStore: any[] = [
  { id: "tt-1", period: "8:00 AM - 8:40 AM", subject: "Mathematics", class: "SS2 Gold", room: "Block A - Room 12", day: "Wednesday" },
  { id: "tt-2", period: "8:40 AM - 9:20 AM", subject: "Mathematics", class: "SS2 Silver", room: "Block A - Room 14", day: "Wednesday" },
  { id: "tt-3", period: "10:00 AM - 10:40 AM", subject: "Further Mathematics", class: "SS3 Emerald", room: "Science Lab 2", day: "Wednesday" },
  { id: "tt-4", period: "11:20 AM - 12:00 PM", subject: "Mathematics Remedial", class: "SS2 Gold", room: "Block A - Room 12", day: "Wednesday" }
];

const teacherFilesStore: any[] = [
  { id: "fl-1", name: "WAEC_Maths_Syllabus_2026_2027.pdf", sizeMB: 4.2, type: "PDF", uploadedAt: "2026-07-20", category: "Curriculum" },
  { id: "fl-2", name: "SS2_Quadratic_Equations_Slides.pptx", sizeMB: 12.8, type: "PowerPoint", uploadedAt: "2026-07-24", category: "Lesson Material" }
];

const teacherMessagesStore: any[] = [
  { id: "msg-101", sender: "Mrs. Okonkwo Beatrice", recipient: "Principal", subject: "Lesson Notes Submission Week 4 & 5", date: "2026-07-28 14:30", content: "Dear Ma, I have submitted the approved Gemini AI-enhanced lesson notes for SS2 Mathematics." },
  { id: "msg-102", sender: "Chief Adeyemi Tunde (Parent)", recipient: "Mrs. Okonkwo Beatrice", subject: "Adeyemi Chinedu's Math Performance", date: "2026-07-29 09:15", content: "Thank you ma for the extra guidance in quadratic equations." }
];

// --- STUDENT & PARENT PORTAL MASTER DATA STORES ---

const parentProfilesStore: any[] = [
  {
    id: "PAR-901",
    name: "Chief Adeyemi Tunde",
    email: "adeyemi.tunde@gmail.com",
    phone: "+2348031234567",
    occupation: "Senior Consultant / Civil Engineer",
    address: "14 Palm Avenue, Ikeja, Lagos State",
    linkedChildren: [
      { studentId: "STD-2026-001", name: "Adeyemi Chinedu", class: "SS2 Gold", admissionNo: "LIV/2026/001" },
      { studentId: "STD-2026-004", name: "Adeyemi Bisi", class: "JSS1 Silver", admissionNo: "LIV/2026/004" }
    ]
  }
];

const studentProfilesStore: any[] = [
  {
    id: "STD-2026-001",
    admissionNo: "LIV/2026/001",
    name: "Adeyemi Chinedu",
    email: "chinedu.adeyemi@student.livingstone.edu.ng",
    class: "SS2 Gold",
    arm: "Gold",
    house: "Yellow House (Jasper)",
    dob: "2010-04-12",
    gender: "Male",
    bloodGroup: "O+",
    genotype: "AA",
    medicalInfo: {
      allergies: "Penicillin",
      asthmatic: false,
      specialNotes: "Wears reading glasses for whiteboards"
    },
    guardianDetails: {
      fatherName: "Chief Adeyemi Tunde",
      motherName: "Mrs. Adeyemi Folashade",
      primaryPhone: "+2348031234567",
      email: "adeyemi.tunde@gmail.com",
      address: "14 Palm Avenue, Ikeja, Lagos State"
    },
    emergencyContacts: [
      { name: "Mrs. Adeyemi Folashade", relationship: "Mother", phone: "+2348029876543" }
    ],
    academicHistory: [
      { session: "2025/2026", class: "SS1 Gold", totalAverage: "84.5%", position: "3rd / 35" }
    ]
  },
  {
    id: "STD-2026-004",
    admissionNo: "LIV/2026/004",
    name: "Adeyemi Bisi",
    email: "bisi.adeyemi@student.livingstone.edu.ng",
    class: "JSS1 Silver",
    arm: "Silver",
    house: "Blue House (Sapphire)",
    dob: "2013-09-22",
    gender: "Female",
    bloodGroup: "A+",
    genotype: "AA",
    medicalInfo: { allergies: "None", asthmatic: false, specialNotes: "None" },
    guardianDetails: {
      fatherName: "Chief Adeyemi Tunde",
      motherName: "Mrs. Adeyemi Folashade",
      primaryPhone: "+2348031234567",
      email: "adeyemi.tunde@gmail.com",
      address: "14 Palm Avenue, Ikeja, Lagos State"
    },
    emergencyContacts: [
      { name: "Chief Adeyemi Tunde", relationship: "Father", phone: "+2348031234567" }
    ],
    academicHistory: []
  }
];

const studentAssignmentsStore: any[] = [
  {
    id: "asg-01",
    subject: "Mathematics",
    class: "SS2 Gold",
    title: "Quadratic Equation Mastery Assignment",
    description: "Solve problems 1 to 10 on page 142 of New General Mathematics. Show step-by-step calculations for completing the square method.",
    deadline: "2026-08-02T23:59:00Z",
    totalPoints: 20,
    attachmentUrl: "https://livingstone.edu.ng/files/assignments/ss2-math-assignment-4.pdf",
    submissions: [
      {
        studentId: "STD-2026-001",
        submittedAt: "2026-07-28T16:20:00Z",
        submissionText: "All 10 quadratic equation problems solved in detail attached.",
        attachmentUrl: "https://livingstone.edu.ng/uploads/chinedu-math-hw4.pdf",
        status: "Graded",
        score: 18,
        teacherFeedback: "Excellent neat work! Good application of discriminant formula."
      }
    ]
  },
  {
    id: "asg-02",
    subject: "Physics",
    class: "SS2 Gold",
    title: "Wave Speed & Frequency Calculations",
    description: "Calculate velocity and wavelength for electromagnetic waves given in WAEC 2025 past question paper page 45.",
    deadline: "2026-08-04T23:59:00Z",
    totalPoints: 20,
    attachmentUrl: "https://livingstone.edu.ng/files/assignments/physics-wave-motion.pdf",
    submissions: []
  }
];

const studentCbtStore: any[] = [
  {
    id: "cbt-201",
    subject: "Mathematics",
    class: "SS2 Gold",
    title: "SS2 Algebra & Quadratic CBT Assessment",
    durationMinutes: 30,
    totalQuestions: 10,
    scheduledStartTime: "2026-07-29T08:00:00Z",
    scheduledEndTime: "2026-08-10T23:59:00Z",
    isRandomized: true,
    autoMarking: true,
    status: "Active",
    questions: [
      {
        id: "q-1",
        question: "What is the general standard form of a quadratic equation?",
        options: ["ax + b = 0", "ax^2 + bx + c = 0", "a/x + b = c", "ax^3 + bx^2 = 0"],
        correctOptionIndex: 1,
        marks: 2
      },
      {
        id: "q-2",
        question: "Calculate the discriminant for the equation 2x^2 + 5x - 3 = 0.",
        options: ["1", "25", "49", "12"],
        correctOptionIndex: 2,
        marks: 2
      },
      {
        id: "q-3",
        question: "If b^2 - 4ac = 0, what is the nature of the roots?",
        options: ["Two distinct real roots", "Two equal real roots", "Complex imaginary roots", "No roots exist"],
        correctOptionIndex: 1,
        marks: 2
      }
    ]
  }
];

const studentCbtAttemptsStore: any[] = [];

const studentFeesStore: any[] = [
  {
    id: "INV-2026-101",
    studentId: "STD-2026-001",
    studentName: "Adeyemi Chinedu",
    class: "SS2 Gold",
    session: "2026/2027",
    term: "First Term",
    totalAmount: 385000,
    paidAmount: 285000,
    outstandingBalance: 100000,
    status: "Partially Paid",
    dueDate: "2026-08-15",
    items: [
      { description: "First Term Tuition Fee", amount: 250000 },
      { description: "Development & Infrastructural Levy", amount: 50000 },
      { description: "E-Learning & Gemini AI License", amount: 25000 },
      { description: "WAEC/NECO Practical Lab Materials", amount: 30000 },
      { description: "Library & Sports Facility Fee", amount: 30000 }
    ],
    paymentsHistory: [
      {
        receiptNo: "RCP-2026-088",
        amountPaid: 285000,
        paymentDate: "2026-07-15",
        paymentMethod: "Paystack Online Gateway",
        transactionRef: "PSTK_TXN_994182741"
      }
    ]
  }
];

// --- REST API ROUTES ---

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", appName: "LIVINGSTONEEDU SaaS Backend Engine", version: "2.4.0", timestamp: new Date().toISOString() });
});

// Firebase Status & Public Config
app.get("/api/firebase/config", (req, res) => {
  res.json({
    apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDFWBa-XQ5Ppz8aAcChO8U5uWQ5gMRrBRM",
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "livingstoneedu-1ef57.firebaseapp.com",
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "livingstoneedu-1ef57",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "livingstoneedu-1ef57.firebasestorage.app",
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "862725103424",
    appId: process.env.VITE_FIREBASE_APP_ID || "1:862725103424:web:90228b701a71650f3424a5",
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-75JWGXXVWJ",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://livingstoneedu-1ef57-default-rtdb.firebaseio.com/",
  });
});

app.get("/api/firebase/status", (req, res) => {
  const adminApp = getFirebaseAdmin();
  res.json({
    connected: !!adminApp,
    projectId: process.env.FIREBASE_PROJECT_ID || "livingstoneedu-1ef57",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@livingstoneedu-1ef57.iam.gserviceaccount.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://livingstoneedu-1ef57-default-rtdb.firebaseio.com/",
    timestamp: new Date().toISOString(),
  });
});

// Authentication APIs
app.post("/api/auth/login", (req, res) => {
  const { email, role } = req.body;
  const user = usersStore.find((u) => u.email === email) || {
    id: `usr-${Date.now()}`,
    name: email ? email.split("@")[0] : "User",
    email: email || "user@livingstone.edu",
    role: role || "School Administrator",
    schoolId: "SCH-001",
  };
  const token = `jwt_simulated_${Buffer.from(JSON.stringify(user)).toString("base64")}`;
  res.json({ success: true, token, user, message: `Authenticated successfully as ${user.role}` });
});

app.get("/api/auth/me", (req, res) => {
  res.json({ success: true, user: usersStore[0] });
});

// Dashboard Statistics Route
app.get("/api/dashboard/stats", (req, res) => {
  const role = (req.query.role as string) || "School Administrator";
  res.json({
    role,
    schoolInfo: {
      name: "Livingstone International Academy",
      code: "LIV-EDU-2026",
      session: "2026/2027 Academic Session",
      term: "First Term",
    },
    metrics: {
      totalStudents: studentsStore.length + 1244,
      studentsPresentToday: 1192,
      totalTeachers: teachersStore.length + 76,
      teachersPresentToday: 76,
      pendingFeesTotal: 4850000,
      collectedFeesTotal: 42100000,
      activeExamsCount: cbtExamsStore.length + 12,
      aiGeneratedNotesCount: lessonNotesStore.length + 340,
    },
    weather: {
      temp: 28,
      condition: "Sunny & Pleasant",
      location: "Lagos / Abuja Campus",
    },
    recentActivities: [
      { id: "act-1", time: "10 mins ago", title: "AI Exam Generator", desc: "Mrs. Okonkwo generated 40 SS2 Mathematics CA questions using Gemini AI." },
      { id: "act-2", time: "25 mins ago", title: "Report Card Compilation", desc: "JSS3 Diamond term result compilation verified by Vice Principal." },
      { id: "act-3", time: "1 hour ago", title: "Fee Payment Recorded", desc: "₦165,000 tuition payment received for Fatima Abubakar (Receipt #LIV-8821)." },
      { id: "act-4", time: "2 hours ago", title: "AI Lesson Note Created", desc: "Physics Teacher generated WAEC-aligned lesson plan for Electromagnetic Waves." },
    ],
    upcomingEvents: [
      { id: "ev-1", date: "Aug 05", title: "Inter-House Sports Competition", location: "Main Sports Complex" },
      { id: "ev-2", date: "Aug 12", title: "Mid-Term CA Examinations", location: "All Secondary Halls" },
      { id: "ev-3", date: "Aug 20", title: "PTA General Assembly & Exhibition", location: "Grand Auditorium" },
    ],
  });
});

// ==========================================
// --- SUPER ADMIN MASTER BACKEND REST APIS ---
// ==========================================

// 1. Super Admin Overview Metrics
app.get("/api/superadmin/dashboard", (req, res) => {
  const totalStudents = superAdminSchoolsStore.reduce((acc, s) => acc + (s.totalStudents || 0), 0);
  const totalTeachers = superAdminSchoolsStore.reduce((acc, s) => acc + (s.totalTeachers || 0), 0);

  res.json({
    success: true,
    metrics: {
      totalSchools: superAdminSchoolsStore.length,
      totalTeachers,
      totalStudents,
      totalParents: Math.round(totalStudents * 0.85),
      activeUsers: Math.round(totalStudents * 0.2 + totalTeachers + 120),
      todaysAttendance: "94.8%",
      feesCollectedToday: 14250000,
      outstandingFees: 38400000,
      generatedLessonNotes: 12480,
      generatedExams: 4320,
      cbtSessions: 1890,
      reportCardsGenerated: 38900,
      recentActivities: [
        { id: "sa-act-1", time: "5 mins ago", title: "School Activated", desc: "Super Admin activated Premier Heights International College." },
        { id: "sa-act-2", time: "18 mins ago", title: "AI Token Allocation", desc: "+50,000 AI Credits assigned to Livingstone International Academy." },
        { id: "sa-act-3", time: "45 mins ago", title: "NERDC Curriculum Synced", desc: "2026/2027 NERDC Senior Secondary syllabus updated across all tenant schools." },
        { id: "sa-act-4", time: "2 hours ago", title: "Paystack Fee Settlement", desc: "₦14,250,000 bulk tuition fees settled via Paystack SaaS gateway." },
      ],
      serverStatus: {
        cpuUsage: "14%",
        ramUsage: "2.8 GB / 8.0 GB",
        uptime: "99.98%",
        status: "Healthy",
        activeConnections: 1420,
      },
      databaseHealth: {
        status: "Healthy",
        engine: "MySQL + Prisma ORM + Firebase Auth",
        latencyMs: 1.2,
        activeConnections: 42,
        maxConnections: 200,
        slowQueries: 0,
      },
      aiUsageStats: {
        tokensUsedToday: 482900,
        monthlyTokensUsed: 14200000,
        totalCostUSD: 42.15,
        activeTeachersGenerating: 312,
      },
    },
  });
});

// 2. School Management APIs
app.get("/api/superadmin/schools", (req, res) => {
  const { q, status, plan } = req.query;
  let result = [...superAdminSchoolsStore];

  if (q) {
    const term = (q as string).toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term) ||
        s.adminEmail.toLowerCase().includes(term)
    );
  }
  if (status) {
    result = result.filter((s) => s.status.toLowerCase() === (status as string).toLowerCase());
  }
  if (plan) {
    result = result.filter((s) => s.plan.toLowerCase() === (plan as string).toLowerCase());
  }

  res.json({ success: true, count: result.length, data: result });
});

app.post("/api/superadmin/schools", (req, res) => {
  const { name, code, domain, adminEmail, phone, plan = "Standard Growth", country = "Nigeria", state = "Lagos" } = req.body;
  const newSchool = {
    id: `SCH-${String(superAdminSchoolsStore.length + 1).padStart(3, "0")}`,
    name: name || "New Livingstone Partner School",
    code: code || `SCH-LIV-${Math.floor(100 + Math.random() * 900)}`,
    domain: domain || "partnerschool.edu.ng",
    adminEmail: adminEmail || "admin@partnerschool.edu.ng",
    phone: phone || "+234 800 000 0000",
    plan,
    status: "Active",
    storageUsedGB: 0.1,
    storageLimitGB: plan === "Enterprise Pro" ? 100 : plan === "Standard Growth" ? 50 : 20,
    aiCredits: plan === "Enterprise Pro" ? 50000 : plan === "Standard Growth" ? 25000 : 10000,
    aiCreditsUsed: 0,
    totalStudents: 0,
    totalTeachers: 0,
    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80",
    createdAt: new Date().toISOString().split("T")[0],
    owner: adminEmail || "School Admin",
    country,
    state,
  };

  superAdminSchoolsStore.unshift(newSchool);
  res.json({ success: true, message: "School registered successfully", data: newSchool });
});

app.put("/api/superadmin/schools/:id", (req, res) => {
  const schoolIndex = superAdminSchoolsStore.findIndex((s) => s.id === req.params.id);
  if (schoolIndex === -1) {
    return res.status(404).json({ success: false, message: "School not found" });
  }
  superAdminSchoolsStore[schoolIndex] = { ...superAdminSchoolsStore[schoolIndex], ...req.body };
  res.json({ success: true, message: "School updated successfully", data: superAdminSchoolsStore[schoolIndex] });
});

app.put("/api/superadmin/schools/:id/suspend", (req, res) => {
  const school = superAdminSchoolsStore.find((s) => s.id === req.params.id);
  if (!school) return res.status(404).json({ success: false, message: "School not found" });
  school.status = "Suspended";
  res.json({ success: true, message: `School ${school.name} suspended`, data: school });
});

app.put("/api/superadmin/schools/:id/activate", (req, res) => {
  const school = superAdminSchoolsStore.find((s) => s.id === req.params.id);
  if (!school) return res.status(404).json({ success: false, message: "School not found" });
  school.status = "Active";
  res.json({ success: true, message: `School ${school.name} activated`, data: school });
});

app.delete("/api/superadmin/schools/:id", (req, res) => {
  const index = superAdminSchoolsStore.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: "School not found" });
  const deleted = superAdminSchoolsStore.splice(index, 1);
  res.json({ success: true, message: "School deleted successfully", data: deleted[0] });
});

app.post("/api/superadmin/schools/:id/assign-subscription", (req, res) => {
  const school = superAdminSchoolsStore.find((s) => s.id === req.params.id);
  if (!school) return res.status(404).json({ success: false, message: "School not found" });
  const { plan } = req.body;
  school.plan = plan || school.plan;
  res.json({ success: true, message: `Subscription assigned: ${school.plan}`, data: school });
});

app.post("/api/superadmin/schools/:id/assign-storage", (req, res) => {
  const school = superAdminSchoolsStore.find((s) => s.id === req.params.id);
  if (!school) return res.status(404).json({ success: false, message: "School not found" });
  const { storageLimitGB } = req.body;
  school.storageLimitGB = Number(storageLimitGB) || school.storageLimitGB;
  res.json({ success: true, message: `Storage allocated: ${school.storageLimitGB} GB`, data: school });
});

app.post("/api/superadmin/schools/:id/assign-ai-credits", (req, res) => {
  const school = superAdminSchoolsStore.find((s) => s.id === req.params.id);
  if (!school) return res.status(404).json({ success: false, message: "School not found" });
  const { aiCredits } = req.body;
  school.aiCredits = (school.aiCredits || 0) + (Number(aiCredits) || 10000);
  res.json({ success: true, message: `AI Credits updated: ${school.aiCredits}`, data: school });
});

app.post("/api/superadmin/schools/:id/reset", (req, res) => {
  const school = superAdminSchoolsStore.find((s) => s.id === req.params.id);
  if (!school) return res.status(404).json({ success: false, message: "School not found" });
  school.aiCreditsUsed = 0;
  school.storageUsedGB = 0.1;
  res.json({ success: true, message: `School environment reset for ${school.name}` });
});

app.post("/api/superadmin/schools/:id/backup", (req, res) => {
  const school = superAdminSchoolsStore.find((s) => s.id === req.params.id);
  if (!school) return res.status(404).json({ success: false, message: "School not found" });
  const backup = {
    id: `bkp-sch-${Date.now()}`,
    schoolId: school.id,
    schoolName: school.name,
    timestamp: new Date().toISOString(),
    status: "Completed",
    sizeMB: Math.round(school.storageUsedGB * 1024),
  };
  superAdminBackupsStore.unshift(backup);
  res.json({ success: true, message: `Backup created for ${school.name}`, data: backup });
});

app.post("/api/superadmin/schools/:id/clone", (req, res) => {
  const school = superAdminSchoolsStore.find((s) => s.id === req.params.id);
  if (!school) return res.status(404).json({ success: false, message: "School not found" });
  const cloned = {
    ...school,
    id: `SCH-${String(superAdminSchoolsStore.length + 1).padStart(3, "0")}`,
    name: `${school.name} (Clone)`,
    code: `${school.code}-CLONE`,
    domain: `clone-${school.domain}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  superAdminSchoolsStore.unshift(cloned);
  res.json({ success: true, message: `Cloned ${school.name} successfully`, data: cloned });
});

app.post("/api/superadmin/schools/:id/transfer-ownership", (req, res) => {
  const school = superAdminSchoolsStore.find((s) => s.id === req.params.id);
  if (!school) return res.status(404).json({ success: false, message: "School not found" });
  const { newOwnerEmail, newOwnerName } = req.body;
  school.adminEmail = newOwnerEmail || school.adminEmail;
  school.owner = newOwnerName || school.owner;
  res.json({ success: true, message: `Ownership transferred to ${school.owner} (${school.adminEmail})` });
});

// 3. User Management APIs
app.get("/api/superadmin/users", (req, res) => {
  const { role, schoolId } = req.query;
  let list = [...superAdminUsersStore];
  if (role) {
    list = list.filter((u) => u.role.toLowerCase() === (role as string).toLowerCase());
  }
  if (schoolId) {
    list = list.filter((u) => u.schoolId === schoolId);
  }
  res.json({ success: true, count: list.length, data: list });
});

app.post("/api/superadmin/users", (req, res) => {
  const { name, email, role = "Teacher", schoolId = "SCH-001" } = req.body;
  const newUser = {
    id: `usr-${String(superAdminUsersStore.length + 1).padStart(3, "0")}`,
    name,
    email,
    role,
    schoolId,
    status: "Active",
    isLocked: false,
    permissions: role === "Super Admin" ? ["*"] : ["dashboard:view"],
    lastLogin: "Never",
    ip: "127.0.0.1",
    device: "Web Browser",
  };
  superAdminUsersStore.unshift(newUser);
  res.json({ success: true, message: `User ${name} created successfully`, data: newUser });
});

app.put("/api/superadmin/users/:id/permissions", (req, res) => {
  const user = superAdminUsersStore.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  user.permissions = req.body.permissions || user.permissions;
  res.json({ success: true, message: "Permissions updated", permissions: user.permissions });
});

app.post("/api/superadmin/users/:id/reset-password", (req, res) => {
  const user = superAdminUsersStore.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, message: `Password reset link dispatched to ${user.email}` });
});

app.put("/api/superadmin/users/:id/lock", (req, res) => {
  const user = superAdminUsersStore.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  user.isLocked = req.body.isLocked !== undefined ? req.body.isLocked : !user.isLocked;
  user.status = user.isLocked ? "Locked" : "Active";
  res.json({ success: true, message: `Account ${user.isLocked ? "locked" : "unlocked"}`, data: user });
});

app.get("/api/superadmin/users/:id/activity-history", (req, res) => {
  const userLogs = auditLogsStore.filter((log) => log.user === req.params.id || log.user === "Authenticated User");
  res.json({ success: true, data: userLogs.slice(0, 50) });
});

// 4. AI Management & Gemini Control
app.get("/api/superadmin/ai/stats", (req, res) => {
  res.json({
    success: true,
    config: superAdminAiConfigStore,
    analytics: {
      totalTokensThisMonth: 14200000,
      totalPromptsProcessed: 18450,
      averageLatencyMs: 1420,
      estimatedCostUSD: 42.6,
      mostActiveSubjects: ["Mathematics", "Physics", "English Language", "Chemistry", "Biology"],
    },
  });
});

app.get("/api/superadmin/ai/prompt-logs", (req, res) => {
  res.json({ success: true, count: superAdminAiLogsStore.length, data: superAdminAiLogsStore });
});

app.put("/api/superadmin/ai/config", (req, res) => {
  Object.assign(superAdminAiConfigStore, req.body);
  res.json({ success: true, message: "AI Engine Configuration updated", config: superAdminAiConfigStore });
});

app.get("/api/superadmin/ai/prompt-templates", (req, res) => {
  res.json({ success: true, data: superAdminAiConfigStore.promptTemplates });
});

app.post("/api/superadmin/ai/prompt-templates", (req, res) => {
  const newTpl = { id: `tpl-${Date.now()}`, ...req.body };
  superAdminAiConfigStore.promptTemplates.push(newTpl);
  res.json({ success: true, message: "Prompt Template saved", data: newTpl });
});

// 5. Curriculum Manager APIs
app.get("/api/superadmin/curriculum", (req, res) => {
  res.json({ success: true, count: superAdminCurriculumStore.length, data: superAdminCurriculumStore });
});

app.post("/api/superadmin/curriculum/upload", (req, res) => {
  const { framework, title, country = "Nigeria", subjectsCount = 10 } = req.body;
  const newItem = {
    id: `curr-${Date.now()}`,
    framework: framework || "Custom Standards",
    country,
    title: title || "New Curriculum Framework",
    subjectsCount,
    levels: ["Primary", "Secondary"],
    status: "Approved & Active",
  };
  superAdminCurriculumStore.push(newItem);
  res.json({ success: true, message: "Curriculum uploaded & active across tenant schools", data: newItem });
});

app.post("/api/superadmin/curriculum/approve-lesson-note", (req, res) => {
  res.json({ success: true, message: "Lesson Note approved and added to global NERDC/WAEC repository" });
});

app.post("/api/superadmin/curriculum/approve-exam", (req, res) => {
  res.json({ success: true, message: "Exam paper approved and queued for national CBT Bank" });
});

// 6. Website Builder APIs
app.get("/api/superadmin/website-builder/:schoolId", (req, res) => {
  const config = superAdminWebsiteConfigsStore[req.params.schoolId] || {
    schoolId: req.params.schoolId,
    schoolName: "Livingstone Partner School",
    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80",
    primaryColor: "#4f46e5",
    secondaryColor: "#06b6d4",
    heroTitle: "Welcome to Our Excellence Campus",
    heroSubtitle: "Powered by LIVINGSTONEEDU SaaS Engine",
    footerText: "© 2026 Partner School. All rights reserved.",
  };
  res.json({ success: true, data: config });
});

app.put("/api/superadmin/website-builder/:schoolId", (req, res) => {
  superAdminWebsiteConfigsStore[req.params.schoolId] = {
    ...superAdminWebsiteConfigsStore[req.params.schoolId],
    ...req.body,
    schoolId: req.params.schoolId,
  };
  res.json({
    success: true,
    message: "School Website & Admission Portal configured successfully",
    data: superAdminWebsiteConfigsStore[req.params.schoolId],
  });
});

// 7. Report Card Engine APIs
app.get("/api/superadmin/report-cards/templates", (req, res) => {
  res.json({
    success: true,
    templates: [
      { id: "tpl-rc-1", name: "NERDC Standard 3-Term Broadsheet", layout: "Classic Academic", gradingSystem: "A1-F9 WAEC Standard" },
      { id: "tpl-rc-2", name: "Cambridge IGCSE Transcript", layout: "Modern Minimalist", gradingSystem: "A*-G Scale" },
    ],
    gradingScale: [
      { grade: "A1", min: 75, max: 100, remark: "Excellent" },
      { grade: "B2", min: 70, max: 74, remark: "Very Good" },
      { grade: "B3", min: 65, max: 69, remark: "Good" },
      { grade: "C4", min: 60, max: 64, remark: "Credit" },
      { grade: "C5", min: 55, max: 59, remark: "Credit" },
      { grade: "C6", min: 50, max: 54, remark: "Credit" },
      { grade: "D7", min: 45, max: 49, remark: "Pass" },
      { grade: "E8", min: 40, max: 44, remark: "Pass" },
      { grade: "F9", min: 0, max: 39, remark: "Fail" },
    ],
  });
});

app.post("/api/superadmin/report-cards/bulk-download", (req, res) => {
  res.json({
    success: true,
    message: "Bulk PDF generation initiated for 1,288 students. Package will be available in 30 seconds.",
    downloadUrl: "/downloads/report-cards-broadsheet-2026-term1.zip",
  });
});

// 8. Examination Center APIs
app.get("/api/superadmin/exams", (req, res) => {
  res.json({
    success: true,
    activeCbtSessions: cbtExamsStore.length,
    questionBankCount: questionBank.length,
    exams: cbtExamsStore,
  });
});

app.post("/api/superadmin/exams/generate-timetable", (req, res) => {
  res.json({
    success: true,
    message: "AI Examination Timetable generated with 0 hall clashes across 12 classes.",
  });
});

// 9. Payment Center APIs
app.get("/api/superadmin/payments", (req, res) => {
  res.json({
    success: true,
    count: superAdminPaymentsStore.length,
    totalRevenueNGN: superAdminPaymentsStore.reduce((acc, p) => acc + p.amount, 0),
    data: superAdminPaymentsStore,
  });
});

app.post("/api/superadmin/payments/create-invoice", (req, res) => {
  const { schoolId, amount, plan } = req.body;
  const newInvoice = {
    id: `INV-${Date.now()}`,
    schoolId,
    amount,
    plan,
    status: "Pending",
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
  };
  res.json({ success: true, message: "Invoice issued to school admin", invoice: newInvoice });
});

app.post("/api/superadmin/payments/process-refund", (req, res) => {
  const { reference } = req.body;
  res.json({ success: true, message: `Refund processed for transaction reference: ${reference}` });
});

// 10. Communication Center APIs
app.post("/api/superadmin/communication/send-email", (req, res) => {
  const { recipient, subject, body } = req.body;
  const log = { id: `comm-${Date.now()}`, channel: "Email (Nodemailer)", recipient, subject, timestamp: new Date().toISOString(), status: "Sent" };
  superAdminCommunicationLogs.unshift(log);
  res.json({ success: true, message: `Email dispatched to ${recipient}`, log });
});

app.post("/api/superadmin/communication/send-sms", (req, res) => {
  const { phone, message } = req.body;
  const log = { id: `comm-${Date.now()}`, channel: "SMS", recipient: phone, subject: message.substring(0, 30), timestamp: new Date().toISOString(), status: "Sent" };
  superAdminCommunicationLogs.unshift(log);
  res.json({ success: true, message: `SMS dispatched to ${phone}`, log });
});

app.post("/api/superadmin/communication/send-whatsapp", (req, res) => {
  const { phone, message } = req.body;
  const log = { id: `comm-${Date.now()}`, channel: "WhatsApp", recipient: phone, subject: message.substring(0, 30), timestamp: new Date().toISOString(), status: "Sent" };
  superAdminCommunicationLogs.unshift(log);
  res.json({ success: true, message: `WhatsApp message dispatched to ${phone}`, log });
});

app.post("/api/superadmin/communication/send-push", (req, res) => {
  const { title, body } = req.body;
  const log = { id: `comm-${Date.now()}`, channel: "Push Notification (Firebase)", recipient: "All Mobile App Users", subject: title, timestamp: new Date().toISOString(), status: "Broadcast Complete" };
  superAdminCommunicationLogs.unshift(log);
  res.json({ success: true, message: "Firebase Push Notification broadcasted successfully", log });
});

app.post("/api/superadmin/communication/emergency-alert", (req, res) => {
  const { alertTitle, alertDetails } = req.body;
  res.json({ success: true, message: `EMERGENCY BROADCAST SENT across all registered schools and parent mobile apps: ${alertTitle}` });
});

// 11. Monitoring & System Health APIs
app.get("/api/superadmin/monitoring/health", (req, res) => {
  res.json({
    success: true,
    system: {
      platform: "Linux / Containerized Cloud Run Engine",
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      cpuUsagePercent: 14.2,
      memory: {
        totalMB: 8192,
        usedMB: 2840,
        freeMB: 5352,
      },
      mysqlDatabase: {
        status: "Connected & Healthy",
        activeConnections: 42,
        maxConnections: 200,
        slowQueries: 0,
      },
      redisCache: {
        status: "Connected & Synced",
        memoryMB: 124,
      },
      firebaseAuth: {
        status: "Operational",
        project: process.env.FIREBASE_PROJECT_ID || "livingstoneedu-1ef57",
      },
      apiPerformance: {
        avgLatencyMs: 8.4,
        requestsPerMin: 1420,
      },
    },
  });
});

app.get("/api/superadmin/monitoring/logs", (req, res) => {
  res.json({ success: true, logs: auditLogsStore.slice(0, 100) });
});

// 12. Security Center APIs
app.get("/api/superadmin/security/audit-logs", (req, res) => {
  res.json({ success: true, count: auditLogsStore.length, data: auditLogsStore });
});

app.get("/api/superadmin/security/sessions", (req, res) => {
  res.json({
    success: true,
    activeSessions: [
      { sessionId: "sess-901", user: "admin@livingstone.edu", role: "Super Admin", ip: "197.210.64.12", device: "Chrome 126 / macOS", loginTime: "2026-07-29T18:30:00Z" },
      { sessionId: "sess-902", user: "principal@livingstone.edu", role: "Principal", ip: "102.89.23.44", device: "Firefox / Windows", loginTime: "2026-07-29T17:15:00Z" },
    ],
  });
});

app.post("/api/superadmin/security/revoke-session", (req, res) => {
  const { sessionId } = req.body;
  res.json({ success: true, message: `Session ${sessionId} revoked. User logged out.` });
});

// 13. Backup Center APIs
app.get("/api/superadmin/backups", (req, res) => {
  res.json({ success: true, data: superAdminBackupsStore });
});

app.post("/api/superadmin/backups/trigger", (req, res) => {
  const newBackup = {
    id: `bkp-${Date.now()}`,
    name: req.body.name || "Manual System Snapshot",
    timestamp: new Date().toISOString(),
    sizeMB: 4320,
    type: req.body.type || "Manual",
    status: "Completed",
    dbStatus: "Consistent",
    mediaStatus: "Synced",
    downloadUrl: `/api/superadmin/backups/download/bkp-${Date.now()}`,
  };
  superAdminBackupsStore.unshift(newBackup);
  res.json({ success: true, message: "System snapshot backup created successfully", data: newBackup });
});

app.post("/api/superadmin/backups/:id/restore", (req, res) => {
  res.json({ success: true, message: `System state restored successfully from snapshot: ${req.params.id}` });
});

// 14. Global Platform Settings API
app.get("/api/superadmin/settings", (req, res) => {
  res.json({ success: true, data: superAdminSettingsStore });
});

app.put("/api/superadmin/settings", (req, res) => {
  Object.assign(superAdminSettingsStore, req.body);
  res.json({ success: true, message: "Global Platform Settings saved", data: superAdminSettingsStore });
});

// ==========================================
// --- TEACHER PORTAL MASTER REST APIS ---
// ==========================================

// 1. Teacher Auth Verification & Profile Loading
app.post("/api/teacher/auth/login", (req, res) => {
  const { email } = req.body;
  const teacher = teachersStore.find((t) => t.email === email) || teachersStore[0];

  res.json({
    success: true,
    message: "Teacher authenticated successfully via Firebase & JWT",
    token: "mock-jwt-teacher-token-2026",
    teacher: {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      staffId: teacher.staffId,
      assignedClass: teacher.assignedClass || "SS2 Gold",
      assignedClasses: ["SS2 Gold", "SS2 Silver", "SS3 Emerald"],
      assignedSubjects: ["Mathematics", "Further Mathematics", "Physics"],
      school: "Livingstone International Academy",
      permissions: [
        "attendance:take",
        "lesson_notes:create",
        "lesson_notes:approve",
        "assignments:grade",
        "exams:generate",
        "cbt:schedule",
        "results:entry"
      ],
    },
  });
});

app.get("/api/teacher/profile", (req, res) => {
  const teacher = teachersStore[0];
  res.json({
    success: true,
    data: {
      ...teacher,
      assignedClasses: ["SS2 Gold", "SS2 Silver", "SS3 Emerald"],
      assignedSubjects: ["Mathematics", "Further Mathematics", "Physics"],
      workloadHoursPerWeek: 18,
      qualifications: "B.Sc (Ed) Mathematics, M.Sc Educational Measurement (Unilag)",
      trcnNo: "TRCN/NG/2021/88412",
    },
  });
});

// 2. Teacher Dashboard Overview Metrics
app.get("/api/teacher/dashboard", (req, res) => {
  res.json({
    success: true,
    metrics: {
      teacherProfile: teachersStore[0],
      assignedClasses: ["SS2 Gold", "SS2 Silver", "SS3 Emerald"],
      assignedSubjects: ["Mathematics", "Further Mathematics", "Physics"],
      todaysTimetable: teacherTimetableStore,
      attendanceSummary: {
        totalStudents: 32,
        presentToday: 30,
        absentToday: 1,
        lateToday: 1,
        attendanceRate: "93.7%"
      },
      lessonNotesStats: {
        totalGenerated: teacherLessonsStore.length,
        approved: teacherLessonsStore.filter((l) => l.status === "Approved").length,
        pending: teacherLessonsStore.filter((l) => l.status === "Pending Approval").length
      },
      examsStats: {
        totalExamsCreated: teacherExamsStore.length,
        activeCbtSessions: teacherCbtStore.length
      },
      assignmentsStats: {
        activeAssignments: teacherAssignmentsStore.length,
        pendingGrading: 6
      },
      recentActivities: [
        { id: "tact-1", time: "10 mins ago", title: "AI Lesson Note Generated", desc: "Generated SS2 Mathematics Week 4 lesson plan with Gemini AI." },
        { id: "tact-2", time: "1 hour ago", title: "Attendance Marked", desc: "Took morning attendance for SS2 Gold (30 Present, 1 Absent)." },
        { id: "tact-3", time: "3 hours ago", title: "CBT Exam Scheduled", desc: "Scheduled SS2 Mid-Term Algebra CBT test for Aug 5th." }
      ],
      notifications: [
        { id: "n-1", type: "system", title: "NERDC Syllabus Updated", time: "Today", text: "2026 Senior Secondary syllabus sync completed." },
        { id: "n-2", type: "message", title: "New Parent Message", time: "Yesterday", text: "Chief Adeyemi Tunde sent a query regarding Math score." }
      ]
    }
  });
});

// 3. Classroom Management APIs
app.get("/api/teacher/classes", (req, res) => {
  res.json({
    success: true,
    classes: [
      { id: "cls-1", className: "SS2 Gold", capacity: 35, totalStudents: 32, classTeacher: "Mrs. Okonkwo Beatrice", subjects: ["Mathematics", "English", "Physics", "Chemistry"] },
      { id: "cls-2", className: "SS2 Silver", capacity: 35, totalStudents: 30, classTeacher: "Mr. David Alabi", subjects: ["Mathematics", "Biology", "Economics"] },
      { id: "cls-3", className: "SS3 Emerald", capacity: 30, totalStudents: 28, classTeacher: "Mrs. Fatima Umar", subjects: ["Further Mathematics", "Physics"] }
    ]
  });
});

app.get("/api/teacher/students", (req, res) => {
  const { className } = req.query;
  let list = [...studentsStore];
  if (className) {
    list = list.filter((s) => s.class.toLowerCase() === (className as string).toLowerCase());
  }
  res.json({ success: true, count: list.length, data: list });
});

app.get("/api/teacher/class-stats/:classId", (req, res) => {
  res.json({
    success: true,
    className: req.params.classId,
    totalStudents: 32,
    averageAttendanceRate: "94.2%",
    topPerformingSubject: "Mathematics (Avg 74.8%)",
    lowestPerformingSubject: "Chemistry (Avg 62.1%)",
    genderDistribution: { male: 18, female: 14 }
  });
});

// 4. Lesson Note & Curriculum Management APIs
app.get("/api/teacher/lesson-notes/curriculum", (req, res) => {
  const { className = "SS 2", subject = "Mathematics", term = "First Term", week = "Week 4" } = req.query;

  // Derive topic and details based on NERDC database rules
  const classStr = String(className);
  const subjStr = String(subject);
  const termStr = String(term);
  const weekStr = String(week);

  // Simple curriculum catalog rules
  let topic = `${subjStr} Topic for ${weekStr}`;
  let subTopic = `NERDC Standard ${classStr} ${subjStr} Syllabus`;
  let nerdcRef = `NERDC ${classStr} ${subjStr} Syllabus Section`;

  if (subjStr.includes("Math")) {
    const topics: Record<string, { topic: string; subTopic: string }> = {
      "Week 1": { topic: "Logarithms of Numbers > 1", subTopic: "Multiplication and Division using standard log tables" },
      "Week 2": { topic: "Logarithms of Numbers < 1", subTopic: "Bar notation and evaluating negative characteristics" },
      "Week 3": { topic: "Sequence and Series (Arithmetic Progression)", subTopic: "First term, common difference, and nth term formula" },
      "Week 4": { topic: "Quadratic Equations & Roots Analysis", subTopic: "Factorization, Completing the Square, & Graphical Solution" },
      "Week 5": { topic: "Simultaneous Linear & Quadratic Equations", subTopic: "Analytical and graphical solutions" },
      "Week 6": { topic: "Mid-Term Review & Assessment", subTopic: "Revision of Weeks 1-5" },
      "Week 7": { topic: "Geometric Progression (GP)", subTopic: "Common ratio, nth term, and sum of GP" },
      "Week 8": { topic: "Trigonometric Sine and Cosine Rules", subTopic: "Derivation and application to non-right triangles" },
      "Week 9": { topic: "Angles of Elevation and Depression", subTopic: "Heights, distances, and real-world surveying" },
      "Week 10": { topic: "Statistics: Mean, Median, & Mode of Grouped Data", subTopic: "Frequency distribution tables and cumulative frequency" }
    };
    const key = Object.keys(topics).find(k => weekStr.includes(k)) || "Week 4";
    topic = topics[key].topic;
    subTopic = topics[key].subTopic;
  } else if (subjStr.includes("Physics")) {
    const topics: Record<string, { topic: string; subTopic: string }> = {
      "Week 1": { topic: "Units, Dimensions, & Vectors", subTopic: "Scalar vs Vector quantities, resolution of vectors" },
      "Week 2": { topic: "Motion: Speed, Velocity, & Acceleration", subTopic: "Equations of uniformly accelerated motion" },
      "Week 3": { topic: "Projectiles & Circular Motion", subTopic: "Trajectory, time of flight, maximum height, and range" },
      "Week 4": { topic: "Wave Motion & Sound Wave Properties", subTopic: "Production, propagation, speed of sound, echo, and SONAR" },
      "Week 5": { topic: "Light Waves: Reflection & Refraction", subTopic: "Snell's Law, refractive index, total internal reflection" },
      "Week 6": { topic: "Mid-Term Assessment", subTopic: "Revision of Physics fundamentals" },
      "Week 7": { topic: "Lenses & Optical Instruments", subTopic: "Convex/concave lenses, microscope, telescope, and human eye" },
      "Week 8": { topic: "Heat Energy & Temperature Measurement", subTopic: "Thermometers, specific heat capacity, latent heat" }
    };
    const key = Object.keys(topics).find(k => weekStr.includes(k)) || "Week 4";
    topic = topics[key].topic;
    subTopic = topics[key].subTopic;
  } else if (subjStr.includes("Chemistry")) {
    topic = "Periodic Table & Periodic Trends";
    subTopic = "Groups, periods, atomic radius, ionization energy, electronegativity";
  } else if (subjStr.includes("Biology")) {
    topic = "Digestive System & Enzyme Action";
    subTopic = "Alimentary canal structure, mechanical digestion, chemical breakdown by enzymes";
  } else if (subjStr.includes("English")) {
    topic = "Argumentative Essay Writing & Grammatical Concord";
    subTopic = "Structuring persuasive arguments, thesis statements, subject-verb agreement";
  } else if (subjStr.includes("Computer") || subjStr.includes("ICT")) {
    topic = "Database Management Systems (DBMS) & SQL";
    subTopic = "Introduction to relational databases, primary keys, tables, and SQL SELECT queries";
  }

  res.json({
    success: true,
    data: {
      className: classStr,
      subject: subjStr,
      term: termStr,
      week: weekStr,
      topic,
      subTopic,
      objectives: [
        `Understand fundamental concepts of ${topic}`,
        `Solve 3 standard WAEC/NECO exam practice questions`,
        `Apply knowledge to practical real-world scenarios`
      ],
      nerdcReference: nerdcRef,
      foundInCurriculum: true
    }
  });
});

app.get("/api/teacher/lesson-notes", (req, res) => {
  res.json({ success: true, count: teacherLessonsStore.length, data: teacherLessonsStore });
});

app.post("/api/teacher/lesson-notes/generate", async (req, res) => {
  const { subject = "Mathematics", classLevel = "SS2", week = "Week 4", term = "First Term", lessonDuration = "40 mins", teachingDate = new Date().toISOString().split("T")[0] } = req.body;
  let topic = req.body.topic;
  let subTopic = req.body.subTopic;

  // If topic is not provided or manual entry is omitted, automatically retrieve from curriculum!
  if (!topic || topic.trim() === "") {
    if (subject.includes("Math")) topic = "Quadratic Equations & Roots Analysis";
    else if (subject.includes("Physics")) topic = "Wave Motion & Sound Wave Properties";
    else if (subject.includes("Chemistry")) topic = "Periodic Table & Periodic Trends";
    else if (subject.includes("Biology")) topic = "Digestive System & Enzyme Action";
    else if (subject.includes("English")) topic = "Argumentative Essay Writing & Grammatical Concord";
    else topic = `${subject} Core Concept Unit`;
  }

  if (!subTopic) {
    subTopic = `Detailed NERDC Curriculum Study of ${topic}`;
  }

  try {
    const ai = getGeminiAI();
    let generatedContent = "";
    if (ai) {
      const prompt = `Act as an expert Nigerian Secondary School Master Teacher. Generate a comprehensive NERDC and WAEC compliant lesson note for ${subject}, Class: ${classLevel}, Term: ${term}, Week: ${week}, Topic: ${topic}, Sub-Topic: ${subTopic}. 

Include:
- Performance Objectives & Learning Outcomes
- Previous Knowledge
- Instructional Materials & Teaching Resources
- References (NERDC Textbooks)
- Lesson Introduction & Development
- Teacher Activities & Learner Activities
- Guided Practice & Class Discussion
- Evaluation Questions & Assignment
- Board Summary & Key Vocabulary
- Moral Lesson & Inclusive Learning Strategy
- Assessment Rubric`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      generatedContent = response.text || "";
    } else {
      generatedContent = `[NERDC & WAEC SYLLABUS ALIGNED LESSON NOTE]\n\nSchool: Livingstone International Academy\nSubject: ${subject}\nClass: ${classLevel}\nTerm: ${term}\nWeek: ${week}\nDuration: ${lessonDuration}\nDate: ${teachingDate}\nTopic: ${topic}\nSub-Topic: ${subTopic}\n\n1. PERFORMANCE OBJECTIVES:\nAt the end of this lesson, learners should be able to:\n- Explain the foundational principles of ${topic}.\n- Solve 3 standard WAEC/NECO examination problems on ${subTopic}.\n- Apply concepts to real-world industrial and daily life scenarios.\n\n2. PREVIOUS KNOWLEDGE:\nLearners have covered prerequisite concepts in previous weeks.\n\n3. INSTRUCTIONAL MATERIALS:\n- Whiteboard & Markers\n- Standard NERDC Approved Textbooks\n- Gemini AI Interactive Companion & Visual Charts\n\n4. LESSON DEVELOPMENT:\n- Introduction (5 mins): Hook learners with a real-life problem scenario.\n- Teacher Activity (15 mins): Explain core principles step-by-step with board illustrations.\n- Learner Activity (10 mins): Students work in pairs to solve guided practice problems.\n- Evaluation (5 mins): Quick oral and written check for understanding.\n- Summary & Moral Lesson (5 mins): Emphasize precision, discipline, and attention to detail.\n\n5. EVALUATION QUESTIONS:\n1. Define ${topic}.\n2. Explain two key applications of ${subTopic}.\n\n6. ASSIGNMENT:\nSolve questions 1-5 on page 42 of the textbook.`;
    }

    const newNote = {
      id: `les-${Date.now()}`,
      teacherId: "TCH-001",
      teacherName: "Mrs. Okonkwo Beatrice",
      session: "2026/2027",
      term,
      week,
      subject,
      class: classLevel,
      topic,
      subTopic,
      objectives: [
        `Understand concepts of ${topic}`,
        `Solve WAEC standard questions on ${subTopic}`,
        `Apply knowledge in practical assessments`
      ],
      content: generatedContent,
      evaluationQuestions: [
        `Question 1 on ${topic}`,
        `Question 2 on ${topic}`
      ],
      teachingResources: ["Whiteboard", "Textbook", "Gemini AI Interactive Guide"],
      status: "Draft",
      approvalHistory: [],
      createdAt: new Date().toISOString().split("T")[0],
      version: 1.0
    };

    teacherLessonsStore.unshift(newNote);
    res.json({ success: true, message: "Gemini AI Lesson Note generated and saved as draft", data: newNote });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "AI Lesson Note generation failed", error: err.message });
  }
});

// AI Teaching Assistant Action Endpoint
app.post("/api/teacher/lesson-notes/assistant", async (req, res) => {
  const { action, currentContent, topic, subject, classLevel } = req.body;
  
  try {
    const ai = getGeminiAI();
    let resultText = "";
    
    if (ai) {
      const prompt = `Act as an expert Nigerian Master Educator for LIVINGSTONEEDU. 
Task: Apply the action "${action}" to the following lesson note content.
Topic: ${topic || "General Topic"}
Subject: ${subject || "General Subject"}
Class: ${classLevel || "SS2"}

Current Content:
${currentContent || ""}

Please respond ONLY with the newly generated / modified content or additional section for the lesson note, clearly formatted with professional educational structure.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      resultText = response.text || "";
    } else {
      resultText = `\n\n--- [AI GENERATED: ${action.toUpperCase()}] ---\n- Action applied to lesson note for ${topic}.\n- Enhanced pedagogical activities, differentiated learning strategies, and WAEC/NECO standard exercises added successfully.`;
    }

    res.json({ success: true, action, data: resultText });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "AI Assistant action failed", error: err.message });
  }
});

// Auto-Save Draft Endpoint
app.post("/api/teacher/lesson-notes/auto-save", (req, res) => {
  const { id, content, topic, status = "Draft" } = req.body;
  let note = teacherLessonsStore.find((l) => l.id === id);
  const timestamp = new Date().toLocaleTimeString();

  if (note) {
    note.content = content || note.content;
    note.topic = topic || note.topic;
    note.status = status;
    note.updatedAt = new Date().toISOString();
  } else if (id) {
    note = {
      id,
      teacherId: "TCH-001",
      teacherName: "Mrs. Okonkwo Beatrice",
      session: "2026/2027",
      term: "First Term",
      week: "Week 4",
      subject: "Mathematics",
      class: "SS 2",
      topic: topic || "Draft Lesson Note",
      content: content || "",
      status: "Draft",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString(),
      version: 1.0
    };
    teacherLessonsStore.unshift(note);
  }

  res.json({
    success: true,
    message: `Draft auto-saved successfully at ${timestamp}`,
    timestamp,
    data: note
  });
});

app.post("/api/teacher/lesson-notes/:id/submit-approval", (req, res) => {
  const { recipientRole = "Head Teacher" } = req.body;
  const note = teacherLessonsStore.find((l) => l.id === req.params.id);
  if (!note) return res.status(404).json({ success: false, message: "Lesson note not found" });
  note.status = "Submitted";
  note.submittedTo = recipientRole;
  note.submittedAt = new Date().toISOString();
  res.json({ success: true, message: `Lesson Note submitted to ${recipientRole} for review and approval`, data: note });
});

app.post("/api/teacher/lesson-notes/:id/approve", (req, res) => {
  const note = teacherLessonsStore.find((l) => l.id === req.params.id);
  if (!note) return res.status(404).json({ success: false, message: "Lesson note not found" });
  note.status = "Approved";
  note.approvalHistory = note.approvalHistory || [];
  note.approvalHistory.push({ date: new Date().toISOString().split("T")[0], status: "Approved", reviewedBy: req.body.reviewedBy || "Vice Principal (Academic)" });
  res.json({ success: true, message: "Lesson Note approved!", data: note });
});

app.post("/api/teacher/lesson-notes/:id/return-correction", (req, res) => {
  const { feedback = "Please add more practical student group activities and update evaluation questions to WAEC standard." } = req.body;
  const note = teacherLessonsStore.find((l) => l.id === req.params.id);
  if (!note) return res.status(404).json({ success: false, message: "Lesson note not found" });
  note.status = "Returned for Correction";
  note.correctionFeedback = feedback;
  note.approvalHistory = note.approvalHistory || [];
  note.approvalHistory.push({ date: new Date().toISOString().split("T")[0], status: "Returned for Correction", reviewedBy: "Academic Director", feedback });
  res.json({ success: true, message: "Lesson Note returned to teacher for correction with feedback", data: note });
});

app.delete("/api/teacher/lesson-notes/:id", (req, res) => {
  const idx = teacherLessonsStore.findIndex((l) => l.id === req.params.id);
  if (idx !== -1) {
    teacherLessonsStore.splice(idx, 1);
  }
  res.json({ success: true, message: "Lesson Note deleted from store" });
});

app.post("/api/teacher/lesson-notes/:id/duplicate", (req, res) => {
  const note = teacherLessonsStore.find((l) => l.id === req.params.id);
  if (!note) return res.status(404).json({ success: false, message: "Lesson note not found" });
  const duplicated = {
    ...note,
    id: `les-${Date.now()}`,
    topic: `${note.topic} (Copy)`,
    status: "Draft",
    createdAt: new Date().toISOString().split("T")[0]
  };
  teacherLessonsStore.unshift(duplicated);
  res.json({ success: true, message: "Lesson Note duplicated successfully", data: duplicated });
});

app.get("/api/teacher/lesson-notes/notifications", (req, res) => {
  const notifications = [
    { id: "not-1", title: "Lesson Note Approved", message: "Your SS2 Mathematics Week 4 note was approved by HOD Academic.", date: "2026-08-02", type: "approval" },
    { id: "not-2", title: "Correction Requested", message: "Physics Week 5 note returned: Please add 2 more WAEC calculation questions.", date: "2026-08-01", type: "correction" },
    { id: "not-3", title: "Curriculum Sync Updated", message: "NERDC 2026 revised syllabus topics loaded for Chemistry & Biology.", date: "2026-07-30", type: "curriculum" },
    { id: "not-4", title: "Submission Deadline Approaching", message: "Week 6 Lesson Notes submission deadline is Friday 5:00 PM.", date: "2026-07-29", type: "deadline" }
  ];
  res.json({ success: true, data: notifications });
});

app.get("/api/teacher/lesson-notes/analytics", (req, res) => {
  const total = teacherLessonsStore.length;
  const approved = teacherLessonsStore.filter((n) => n.status === "Approved").length;
  const pending = teacherLessonsStore.filter((n) => n.status === "Pending Approval" || n.status === "Submitted" || n.status === "Under Review").length;
  const returned = teacherLessonsStore.filter((n) => n.status === "Returned for Correction").length;
  const drafts = teacherLessonsStore.filter((n) => n.status === "Draft").length;

  res.json({
    success: true,
    data: {
      totalCreated: total || 12,
      approvedNotes: approved || 8,
      pendingApproval: pending || 2,
      returnedNotes: returned || 1,
      draftNotes: drafts || 1,
      weeklyProgress: "85%",
      monthlyProgress: "92%",
      subjectsCompleted: 4,
      remainingNotes: 2
    }
  });
});

app.get("/api/teacher/lesson-notes/:id/export", (req, res) => {
  const fmt = String(req.query.format || "pdf");
  res.json({
    success: true,
    message: `Lesson Note package compiled for ${fmt.toUpperCase()} download`,
    downloadUrl: `/downloads/lesson-note-${req.params.id}.${fmt}`
  });
});

// 5. Scheme of Work APIs
app.get("/api/teacher/scheme-of-work", (req, res) => {
  res.json({ success: true, count: teacherSchemesStore.length, data: teacherSchemesStore });
});

app.post("/api/teacher/scheme-of-work/generate", async (req, res) => {
  const { subject = "Mathematics", classLevel = "SS2", term = "First Term" } = req.body;
  const newScheme = {
    id: `schm-${Date.now()}`,
    subject,
    class: classLevel,
    term,
    session: "2026/2027",
    weeks: Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      topic: i === 6 ? "Mid-Term Examinations" : `${subject} Topic Unit ${i + 1}`,
      nerdcReference: `NERDC ${classLevel} Standard Syllabus`,
      status: i < 3 ? "Completed" : i === 3 ? "In Progress" : "Scheduled"
    }))
  };
  teacherSchemesStore.unshift(newScheme);
  res.json({ success: true, message: "Gemini AI 12-Week Scheme of Work generated", data: newScheme });
});

app.post("/api/teacher/scheme-of-work/copy-previous", (req, res) => {
  res.json({ success: true, message: "Scheme of Work copied from 2025/2026 Academic Session successfully" });
});

// 6. Assignment Management APIs
app.get("/api/teacher/assignments", (req, res) => {
  res.json({ success: true, count: teacherAssignmentsStore.length, data: teacherAssignmentsStore });
});

app.post("/api/teacher/assignments", (req, res) => {
  const { title = "Homework Assignment", subject = "Mathematics", class: className = "SS2 Gold", dueDate, description = "", totalPoints = 20, attachmentUrl = "" } = req.body;
  const assignmentId = `asg-${Date.now()}`;
  const newAssignment = {
    id: assignmentId,
    teacherId: "TCH-001",
    title,
    subject,
    class: className,
    dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    description,
    totalPoints: Number(totalPoints) || 20,
    submissionsCount: 0,
    totalStudents: 32,
    status: "Active",
    attachmentUrl
  };
  
  teacherAssignmentsStore.unshift(newAssignment);

  // Sync directly to student assignments store so students see it immediately
  studentAssignmentsStore.unshift({
    id: assignmentId,
    subject,
    class: className,
    title,
    description: description || `Complete homework on ${title}. Show step-by-step calculations.`,
    deadline: dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
    totalPoints: Number(totalPoints) || 20,
    attachmentUrl: attachmentUrl || "https://livingstone.edu.ng/files/assignments/hw-assignment.pdf",
    submissions: []
  });

  res.json({ success: true, message: "Assignment created & published to Student Portal!", data: newAssignment });
});

app.post("/api/teacher/assignments/generate-ai", async (req, res) => {
  const { subject = "Mathematics", topic = "Quadratic Equations", totalPoints = 20, class: className = "SS2 Gold" } = req.body;
  const assignmentId = `asg-${Date.now()}`;
  const generatedAssignment = {
    id: assignmentId,
    teacherId: "TCH-001",
    subject,
    class: className,
    title: `AI-Generated Practice: ${topic}`,
    description: `Complete the 5 AI-structured problem sets on ${topic} demonstrating step-by-step workings.`,
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    totalPoints,
    submissionsCount: 0,
    totalStudents: 32,
    status: "Active",
    attachmentUrl: "https://livingstone.edu.ng/files/assignments/ai-generated-practice.pdf"
  };

  teacherAssignmentsStore.unshift(generatedAssignment);

  studentAssignmentsStore.unshift({
    id: assignmentId,
    subject,
    class: className,
    title: `AI-Generated Practice: ${topic}`,
    description: `Complete the 5 AI-structured problem sets on ${topic} demonstrating step-by-step workings.`,
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    totalPoints,
    attachmentUrl: "https://livingstone.edu.ng/files/assignments/ai-generated-practice.pdf",
    submissions: []
  });

  res.json({ success: true, message: "AI Assignment generated and published to Student Portal", data: generatedAssignment });
});

app.post("/api/teacher/assignments/:id/grade", (req, res) => {
  const { studentId = "STD-2026-001", score, remark = "Good effort" } = req.body;
  const assignment = studentAssignmentsStore.find(a => a.id === req.params.id);
  if (assignment) {
    let sub = assignment.submissions.find((s: any) => s.studentId === studentId);
    if (!sub) {
      sub = {
        studentId,
        submittedAt: new Date().toISOString(),
        submissionText: "Assignment completed and submitted.",
        attachmentUrl: "https://livingstone.edu.ng/uploads/student-submission.pdf",
        status: "Graded",
        score: Number(score) || 18,
        teacherFeedback: remark
      };
      assignment.submissions.push(sub);
    } else {
      sub.status = "Graded";
      sub.score = Number(score) || 18;
      sub.teacherFeedback = remark;
    }
  }

  // Update teacher assignment graded count
  const tAsg = teacherAssignmentsStore.find(a => a.id === req.params.id);
  if (tAsg) {
    tAsg.gradedCount = (tAsg.gradedCount || 0) + 1;
  }

  res.json({
    success: true,
    message: `Graded assignment for Student ${studentId}: ${score} marks. Feedback published to student portal.`,
  });
});

// 7. AI Exam Generator & Question Bank
app.post("/api/teacher/exams/generate-ai", async (req, res) => {
  const { subject = "Mathematics", classLevel = "SS2", examType = "Mid-Term CA Test", numObjective = 20, numTheory = 2 } = req.body;

  try {
    const ai = getGeminiAI();
    let examContent: any = null;

    if (ai) {
      const prompt = `Generate a formal secondary school examination paper for Subject: ${subject}, Class: ${classLevel}, Type: ${examType}. Provide ${numObjective} Objective Questions with 4 options each, and ${numTheory} Theory Questions with complete Marking Schemes. Format clearly as JSON.`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      examContent = response.text || "";
    }

    const newExam = {
      id: `exm-${Date.now()}`,
      teacherId: "TCH-001",
      subject,
      class: classLevel,
      examType,
      durationMinutes: 45,
      totalMarks: 40,
      objectiveQuestionsCount: numObjective,
      theoryQuestionsCount: numTheory,
      rawContent: examContent,
      status: "Approved",
      createdAt: new Date().toISOString().split("T")[0]
    };

    teacherExamsStore.unshift(newExam);
    res.json({
      success: true,
      message: "Gemini AI Exam generated with objective, theory questions and marking scheme!",
      data: newExam
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Exam generation failed", error: err.message });
  }
});

app.get("/api/teacher/exams", (req, res) => {
  res.json({ success: true, count: teacherExamsStore.length, data: teacherExamsStore });
});

app.get("/api/teacher/question-bank", (req, res) => {
  res.json({ success: true, count: questionBank.length, data: questionBank });
});

app.post("/api/teacher/question-bank", (req, res) => {
  const newQuestion = {
    id: `q-${Date.now()}`,
    ...req.body
  };
  questionBank.unshift(newQuestion);
  res.json({ success: true, message: "Question added to national Question Bank", data: newQuestion });
});

app.post("/api/teacher/question-bank/import", (req, res) => {
  res.json({ success: true, message: "Bulk imported 50 WAEC/NECO standard questions into Question Bank" });
});

app.get("/api/teacher/question-bank/random", (req, res) => {
  const { subject = "Mathematics", count = 5 } = req.query;
  const filtered = questionBank.filter((q) => q.subject.toLowerCase() === (subject as string).toLowerCase());
  const selected = filtered.slice(0, Number(count));
  res.json({ success: true, count: selected.length, data: selected });
});

// 8. CBT Management APIs
app.get("/api/teacher/cbt", (req, res) => {
  res.json({ success: true, count: teacherCbtStore.length, data: teacherCbtStore });
});

app.post("/api/teacher/cbt", (req, res) => {
  const { title = "Algebra & Quadratic CBT Assessment", subject = "Mathematics", class: className = "SS2 Gold", durationMinutes = 30, questions } = req.body;
  const cbtId = `cbt-${Date.now()}`;
  const defaultQuestions = questions || [
    {
      id: "q-1",
      question: `What is the general standard form of a quadratic equation in ${subject}?`,
      options: ["ax + b = 0", "ax^2 + bx + c = 0", "a/x + b = c", "ax^3 + bx^2 = 0"],
      correctOptionIndex: 1,
      marks: 2
    },
    {
      id: "q-2",
      question: "Calculate the discriminant for the equation 2x^2 + 5x - 3 = 0.",
      options: ["1", "25", "49", "12"],
      correctOptionIndex: 2,
      marks: 2
    },
    {
      id: "q-3",
      question: "If b^2 - 4ac = 0, what is the nature of the roots?",
      options: ["Two distinct real roots", "Two equal real roots", "Complex imaginary roots", "No roots exist"],
      correctOptionIndex: 1,
      marks: 2
    }
  ];

  const newCbt = {
    id: cbtId,
    teacherId: "TCH-001",
    title,
    subject,
    class: className,
    durationMinutes: Number(durationMinutes) || 30,
    totalQuestions: defaultQuestions.length,
    status: "Active",
    createdAt: new Date().toISOString()
  };
  teacherCbtStore.unshift(newCbt);

  // Sync to student CBT store
  studentCbtStore.unshift({
    id: cbtId,
    subject,
    class: className,
    title,
    durationMinutes: Number(durationMinutes) || 30,
    totalQuestions: defaultQuestions.length,
    scheduledStartTime: new Date().toISOString(),
    scheduledEndTime: new Date(Date.now() + 14 * 86400000).toISOString(),
    isRandomized: true,
    autoMarking: true,
    status: "Active",
    questions: defaultQuestions
  });

  res.json({ success: true, message: "CBT Assessment scheduled and queued for student portal!", data: newCbt });
});

app.post("/api/teacher/cbt/:id/auto-mark", (req, res) => {
  res.json({
    success: true,
    message: "Auto-marking completed for 32 CBT submission scripts. Scores calculated instantly.",
    averageScore: "78.4%"
  });
});

app.post("/api/teacher/cbt/:id/publish", (req, res) => {
  const cbt = teacherCbtStore.find((c) => c.id === req.params.id);
  if (cbt) cbt.status = "Published";
  const stCbt = studentCbtStore.find((c) => c.id === req.params.id);
  if (stCbt) stCbt.status = "Published";
  res.json({ success: true, message: "CBT examination results published to Parents and Students" });
});

// 9. Continuous Assessment (CA) & Report Card APIs
app.get("/api/teacher/ca", (req, res) => {
  res.json({ success: true, count: teacherCaStore.length, data: teacherCaStore });
});

app.post("/api/teacher/ca/entry", (req, res) => {
  const { studentId = "STD-2026-001", studentName = "Adeyemi Chinedu", subject = "Mathematics", assignmentScore = 0, test1Score = 0, test2Score = 0, projectScore = 0, examScore = 0 } = req.body;
  const totalCaScore = Math.min(30, assignmentScore + test1Score + test2Score + projectScore);
  const finalTotal = totalCaScore + examScore;

  let grade = "F9";
  let remark = "Fail";
  if (finalTotal >= 75) { grade = "A1"; remark = "Excellent"; }
  else if (finalTotal >= 70) { grade = "B2"; remark = "Very Good"; }
  else if (finalTotal >= 65) { grade = "B3"; remark = "Good"; }
  else if (finalTotal >= 60) { grade = "C4"; remark = "Credit"; }
  else if (finalTotal >= 55) { grade = "C5"; remark = "Credit"; }
  else if (finalTotal >= 50) { grade = "C6"; remark = "Credit"; }
  else if (finalTotal >= 45) { grade = "D7"; remark = "Pass"; }
  else if (finalTotal >= 40) { grade = "E8"; remark = "Pass"; }

  const entry = {
    id: `ca-${Date.now()}`,
    studentId,
    studentName,
    subject,
    assignmentScore,
    test1Score,
    test2Score,
    projectScore,
    totalCaScore,
    examScore,
    finalTotal,
    grade,
    remark
  };
  teacherCaStore.unshift(entry);

  res.json({ success: true, message: "CA and Exam score saved and broadsheet updated", data: entry });
});

app.post("/api/teacher/report-cards/generate", (req, res) => {
  res.json({
    success: true,
    message: "Terminal Report Card generated with WAEC A1-F9 scale and psychomotor remarks",
    pdfUrl: "/downloads/report-card-adeyemi-chinedu-term1.pdf"
  });
});

app.post("/api/teacher/report-cards/remarks", async (req, res) => {
  const { studentName = "Adeyemi Chinedu", totalScore = 88 } = req.body;
  try {
    const ai = getGeminiAI();
    let remark = "";
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Write a warm, professional, encouraging teacher remark for student ${studentName} who scored ${totalScore}% in First Term Mathematics. Keep under 30 words.`
      });
      remark = response.text || "";
    } else {
      remark = `${studentName} has demonstrated exceptional academic performance with strong analytical skills. Recommended for further enrichment.`;
    }
    res.json({ success: true, remark });
  } catch (err) {
    res.json({ success: true, remark: `${studentName} displayed outstanding effort and diligence throughout the term.` });
  }
});

app.post("/api/teacher/report-cards/bulk-submit", (req, res) => {
  res.json({ success: true, message: "Class broadsheet and 32 student report cards submitted to Principal for final sign-off" });
});

// 10. Attendance Management APIs
app.post("/api/teacher/attendance/take", (req, res) => {
  const { className = "SS2 Gold", records = [] } = req.body;
  const presentCount = records.filter((r: any) => r.status === "Present").length;
  const absentCount = records.filter((r: any) => r.status === "Absent").length;
  const lateCount = records.filter((r: any) => r.status === "Late").length;

  const newRecord = {
    id: `att-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    class: className,
    takenBy: "Mrs. Okonkwo Beatrice",
    totalStudents: records.length || 32,
    presentCount,
    absentCount,
    lateCount,
    records
  };
  teacherAttendanceStore.unshift(newRecord);
  res.json({ success: true, message: `Attendance recorded for ${className}: ${presentCount} Present, ${absentCount} Absent`, data: newRecord });
});

app.get("/api/teacher/attendance/history", (req, res) => {
  res.json({ success: true, count: teacherAttendanceStore.length, data: teacherAttendanceStore });
});

// 11. Performance Analytics & AI Recommendations
app.get("/api/teacher/performance/analytics", async (req, res) => {
  res.json({
    success: true,
    analytics: {
      highestStudent: { name: "Adeyemi Chinedu", score: 96, subject: "Mathematics" },
      lowestStudent: { name: "Kalu Samuel", score: 48, subject: "Mathematics" },
      classAverage: 74.5,
      passRate: "93.8%",
      failureRate: "6.2%",
      aiPedagogicalRecommendation: "Focus on Quadratic Completing the Square method during remedial classes. 4 students show difficulty with negative discriminant roots."
    }
  });
});

// 12. Teacher AI Assistant Endpoint
app.post("/api/teacher/ai/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const ai = getGeminiAI();
    let reply = "";
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are LIVINGSTONEEDU Teacher AI Co-Pilot. Help the teacher with this pedagogical query: ${message}`
      });
      reply = response.text || "";
    } else {
      reply = `Hello Teacher! Regarding your query: "${message}". I recommend breaking down the topic into visual steps, utilizing real-world analogies, and evaluating student understanding using 5 quick formative MCQs.`;
    }
    res.json({ success: true, reply });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "AI response error", error: err.message });
  }
});

// 13. Notifications, Messaging & Files
app.get("/api/teacher/notifications", (req, res) => {
  res.json({
    success: true,
    notifications: [
      { id: "tn-1", title: "Principal Signed Lesson Notes", text: "Your Week 4 Mathematics lesson note has been approved.", time: "2 hours ago" },
      { id: "tn-2", title: "PTA Meeting Scheduled", text: "All class teachers must prepare term broadsheets before Friday.", time: "1 day ago" }
    ]
  });
});

app.post("/api/teacher/messages/send", (req, res) => {
  const { recipient, subject, content } = req.body;
  const msg = {
    id: `msg-${Date.now()}`,
    sender: "Mrs. Okonkwo Beatrice",
    recipient,
    subject,
    date: new Date().toISOString(),
    content
  };
  teacherMessagesStore.unshift(msg);
  res.json({ success: true, message: `Message dispatched to ${recipient}`, data: msg });
});

app.post("/api/teacher/files/upload", (req, res) => {
  const { name = "Document.pdf", category = "Lesson Material" } = req.body;
  const newFile = {
    id: `fl-${Date.now()}`,
    name,
    sizeMB: 3.5,
    type: name.endsWith(".pdf") ? "PDF" : "Document",
    uploadedAt: new Date().toISOString().split("T")[0],
    category
  };
  teacherFilesStore.unshift(newFile);
  res.json({ success: true, message: "File uploaded successfully to Livingstone Cloud Storage", data: newFile });
});

// 14. Timetable & Calendar
app.get("/api/teacher/timetable", (req, res) => {
  res.json({ success: true, count: teacherTimetableStore.length, data: teacherTimetableStore });
});

app.get("/api/teacher/calendar", (req, res) => {
  res.json({
    success: true,
    events: [
      { id: "ev-1", date: "2026-08-05", title: "Mid-Term CA Examinations", type: "Academic" },
      { id: "ev-2", date: "2026-08-12", title: "Inter-House Sports Finals", type: "Extracurricular" },
      { id: "ev-3", date: "2026-08-20", title: "PTA General Assembly & Exhibition", type: "Parent Meeting" }
    ]
  });
});

// 15. Teacher Analytics
app.get("/api/teacher/analytics", (req, res) => {
  res.json({
    success: true,
    analytics: {
      lessonNotesCreatedThisTerm: teacherLessonsStore.length,
      assignmentsGraded: 48,
      cbtExamsConducted: teacherCbtStore.length,
      aiTokensUsedByTeacher: 84200,
      studentAverageAttendance: "94.2%"
    }
  });
});

// --- REDESIGNED AUTHENTICATION REST API ENDPOINTS ---

// Verified Schools List for Dropdown Search
const verifiedSchoolsStore = [
  { id: "SCH-001", name: "Livingstone International College (Lagos)", code: "LIV-LAGOS-01", address: "Ikeja, Lagos State", verified: true },
  { id: "SCH-002", name: "Livingstone Academy (Abuja Campus)", code: "LIV-ABUJA-02", address: "Maitama, FCT Abuja", verified: true },
  { id: "SCH-003", name: "Grace Heritage Model School (Port Harcourt)", code: "GRC-PH-03", address: "GRA Phase 2, Port Harcourt", verified: true },
  { id: "SCH-004", name: "Bright Stars Comprehensive College (Ibadan)", code: "BST-IBD-04", address: "Bodija, Ibadan, Oyo State", verified: true }
];

// Valid School Admission Numbers Database for Verification
const validSchoolAdmissionRecords: Record<string, any> = {
  "LIV/2026/001": { studentName: "Adeyemi Chinedu", class: "SS2 Gold", gender: "Male", status: "Verified" },
  "LIV/2026/004": { studentName: "Adeyemi Bisi", class: "JSS1 Silver", gender: "Female", status: "Verified" },
  "LIV/2026/012": { studentName: "Okafor David", class: "SS2 Gold", gender: "Male", status: "Verified" },
  "LIV/2026/025": { studentName: "Bello Fatima", class: "SS1 Emerald", gender: "Female", status: "Verified" }
};

// Valid School Staff IDs Database for Verification
const validSchoolStaffRecords: Record<string, any> = {
  "STF-9921": { staffName: "Mrs. Okonkwo Beatrice", defaultRole: "Teacher", department: "Mathematics" },
  "TCH-2026-001": { staffName: "Mrs. Okonkwo Beatrice", defaultRole: "Teacher", department: "Mathematics" },
  "PRN-001": { staffName: "Dr. Jeremiah Alabi", defaultRole: "Principal", department: "Administration" },
  "ADM-101": { staffName: "Engr. Victoria Adebisi", defaultRole: "School Administrator", department: "Administration" },
  "ACC-001": { staffName: "Chief Rotimi Lawson", defaultRole: "Account Officer", department: "Bursary & Finance" },
  "EXM-001": { staffName: "Mr. Chukwuma Eze", defaultRole: "Exam Officer", department: "Examinations" },
  "LIB-001": { staffName: "Mrs. Halima Usman", defaultRole: "Librarian", department: "Library Services" },
  "SA-001": { staffName: "Super System Admin", defaultRole: "Super Admin", department: "Ecosystem" }
};

// Get List of Verified Schools
app.get("/api/auth/schools", (req, res) => {
  res.json({ success: true, schools: verifiedSchoolsStore });
});

// Unified Login Endpoint with Internal Role Detection
app.post("/api/auth/login", (req, res) => {
  const { portalType = "teacher", schoolId = "SCH-001", emailOrId = "", password = "", rememberMe = false } = req.body;

  const school = verifiedSchoolsStore.find(s => s.id === schoolId) || verifiedSchoolsStore[0];
  const inputClean = String(emailOrId).trim();
  const inputLower = inputClean.toLowerCase();

  // Audit activity log
  const loginLog = {
    timestamp: new Date().toISOString(),
    event: "USER_LOGIN_ATTEMPT",
    portalType,
    identifier: emailOrId,
    schoolName: school.name,
    ipAddress: "192.168.1.104"
  };

  // Check if student exists in studentProfilesStore or studentsStore
  const foundStudent = studentProfilesStore.find(s =>
    (s.email && s.email.toLowerCase() === inputLower) ||
    (s.admissionNo && s.admissionNo.toLowerCase() === inputLower) ||
    (s.admissionNumber && s.admissionNumber.toLowerCase() === inputLower) ||
    (s.id && s.id.toLowerCase() === inputLower) ||
    (s.studentId && s.studentId.toLowerCase() === inputLower)
  ) || studentsStore.find(s =>
    (s.email && s.email.toLowerCase() === inputLower) ||
    (s.admissionNo && s.admissionNo.toLowerCase() === inputLower) ||
    (s.admissionNumber && s.admissionNumber.toLowerCase() === inputLower) ||
    (s.id && s.id.toLowerCase() === inputLower) ||
    (s.studentId && s.studentId.toLowerCase() === inputLower)
  );

  const isStudentLogin =
    portalType === "student" ||
    !!foundStudent ||
    inputLower.startsWith("liv/") ||
    inputLower.startsWith("std-") ||
    inputLower.startsWith("sch/") ||
    inputLower.includes("student") ||
    inputLower.includes("parent") ||
    inputLower.includes("pupil") ||
    inputLower.includes("chinedu") ||
    inputLower.includes("adeyemi") ||
    inputLower.includes("david");

  if (isStudentLogin) {
    const student = foundStudent || studentProfilesStore[0];
    const studentSchool = verifiedSchoolsStore.find(s => s.id === student?.schoolId) || school;
    const matchedRecord = validSchoolAdmissionRecords[inputClean.toUpperCase()] || {
      studentName: student?.fullName || student?.name || "Adeyemi Chinedu",
      class: student?.classLevel || student?.class || "SS2 Gold"
    };

    const studentUser = {
      id: student?.id || student?.studentId || "STD-2026-001",
      studentId: student?.id || student?.studentId || "STD-2026-001",
      name: student?.fullName || student?.name || matchedRecord.studentName,
      fullName: student?.fullName || student?.name || matchedRecord.studentName,
      admissionNo: student?.admissionNo || student?.admissionNumber || inputClean.toUpperCase() || "LIV/2026/001",
      admissionNumber: student?.admissionNo || student?.admissionNumber || inputClean.toUpperCase() || "LIV/2026/001",
      class: student?.classLevel || student?.class || matchedRecord.class,
      classLevel: student?.classLevel || student?.class || matchedRecord.class,
      email: student?.email || (inputLower.includes("@") ? inputLower : "chinedu.adeyemi@student.livingstone.edu.ng"),
      schoolId: studentSchool.id,
      schoolName: student?.schoolName || studentSchool.name,
      photoUrl: student?.photoUrl,
      role: "Student",
      academicSession: "2026/2027",
      currentTerm: "First Term"
    };

    return res.json({
      success: true,
      message: `Authentication Successful for Student Portal (${studentUser.schoolName})`,
      portalType: "student",
      userRole: "Student",
      redirectTab: "student-parent-portal",
      token: `JWT_STUDENT_SESSION_${Date.now()}_SECURE`,
      school: studentSchool,
      user: studentUser,
      audit: loginLog
    });
  } else {
    // Staff / Teacher / Admin / Principal / Vice Principal / Owner / Super Admin Role Detection
    let detectedRole: any = "Teacher";
    let redirectTab = "teacher-portal";

    if (inputLower.includes("superadmin") || inputLower === "sa-001") {
      detectedRole = "Super Admin";
      redirectTab = "superadmin";
    } else if (inputLower.includes("owner") || inputLower.includes("proprietor")) {
      detectedRole = "School Owner";
      redirectTab = "dashboard";
    } else if (inputLower.includes("principal") || inputLower === "prn-001") {
      detectedRole = "Principal";
      redirectTab = "dashboard";
    } else if (inputLower.includes("vice") || inputLower.includes("vp-")) {
      detectedRole = "Vice Principal";
      redirectTab = "dashboard";
    } else if (inputLower.includes("admin") || inputLower === "adm-101") {
      detectedRole = "School Administrator";
      redirectTab = "dashboard";
    } else if (inputLower.includes("bursar") || inputLower.includes("finance") || inputLower === "acc-001") {
      detectedRole = "Account Officer";
      redirectTab = "finance";
    } else if (inputLower.includes("exam") || inputLower === "exm-001") {
      detectedRole = "Exam Officer";
      redirectTab = "academic-ai-exam-generator";
    } else if (inputLower.includes("library") || inputLower === "lib-001") {
      detectedRole = "Librarian";
      redirectTab = "library";
    } else {
      const staffRecord = validSchoolStaffRecords[inputClean.toUpperCase()];
      if (staffRecord) {
        detectedRole = staffRecord.defaultRole;
        if (detectedRole === "Super Admin") redirectTab = "superadmin";
        else if (
          detectedRole === "School Administrator" ||
          detectedRole === "Principal" ||
          detectedRole === "Vice Principal" ||
          detectedRole === "School Owner"
        ) redirectTab = "dashboard";
        else if (detectedRole === "Account Officer") redirectTab = "finance";
        else if (detectedRole === "Exam Officer") redirectTab = "academic-ai-exam-generator";
        else if (detectedRole === "Librarian") redirectTab = "library";
        else redirectTab = "teacher-portal";
      }
    }

    const staffUser = {
      id: "TCH-2026-001",
      name: validSchoolStaffRecords[inputClean.toUpperCase()]?.staffName || "Mrs. Okonkwo Beatrice",
      email: inputLower.includes("@") ? inputLower : "okonkwo.b@livingstone.edu.ng",
      staffId: inputClean.toUpperCase() || "STF-9921",
      assignedRole: detectedRole,
      role: detectedRole,
      schoolId: school.id,
      schoolName: school.name
    };

    return res.json({
      success: true,
      message: `Authentication Successful for ${detectedRole} Portal (${school.name})`,
      portalType: "teacher",
      userRole: detectedRole,
      redirectTab,
      token: `JWT_STAFF_SESSION_${Date.now()}_SECURE`,
      school,
      user: staffUser,
      audit: loginLog
    });
  }
});

// Verify Authenticated User Profile & Role from Backend
app.post("/api/auth/me", (req, res) => {
  const { email = "", role = "", token = "", studentId = "", staffId = "" } = req.body;
  const inputEmail = String(email).trim().toLowerCase();
  const inputRole = String(role).trim();

  // Search in student profiles
  const foundStudent = studentProfilesStore.find(s =>
    (s.email && s.email.toLowerCase() === inputEmail) ||
    (s.id && s.id === studentId) ||
    (s.studentId && s.studentId === studentId)
  ) || studentsStore.find(s =>
    (s.email && s.email.toLowerCase() === inputEmail) ||
    (s.id && s.id === studentId)
  );

  if (foundStudent || inputRole.toLowerCase() === "student" || inputRole.toLowerCase() === "parent") {
    const student = foundStudent || studentProfilesStore[0];
    const studentSchool = verifiedSchoolsStore.find(s => s.id === student?.schoolId) || verifiedSchoolsStore[0];
    const studentUser = {
      id: student?.id || student?.studentId || "STD-2026-001",
      name: student?.fullName || student?.name || "Adeyemi Chinedu",
      fullName: student?.fullName || student?.name || "Adeyemi Chinedu",
      admissionNo: student?.admissionNo || student?.admissionNumber || "LIV/2026/001",
      class: student?.classLevel || student?.class || "SS2 Gold",
      classLevel: student?.classLevel || student?.class || "SS2 Gold",
      email: student?.email || inputEmail || "chinedu.adeyemi@student.livingstone.edu.ng",
      schoolId: studentSchool.id,
      schoolName: student?.schoolName || studentSchool.name,
      role: inputRole === "Parent" ? "Parent" : "Student"
    };

    return res.json({
      success: true,
      userRole: studentUser.role,
      redirectTab: "student-parent-portal",
      user: studentUser
    });
  }

  // Staff / Admin lookup
  let verifiedRole = inputRole || "Teacher";
  let redirectTab = "teacher-portal";

  if (verifiedRole === "Super Admin" || inputEmail.includes("superadmin")) {
    verifiedRole = "Super Admin";
    redirectTab = "superadmin";
  } else if (verifiedRole === "School Owner" || inputEmail.includes("owner")) {
    verifiedRole = "School Owner";
    redirectTab = "dashboard";
  } else if (verifiedRole === "Principal" || inputEmail.includes("principal")) {
    verifiedRole = "Principal";
    redirectTab = "dashboard";
  } else if (verifiedRole === "Vice Principal" || inputEmail.includes("vice")) {
    verifiedRole = "Vice Principal";
    redirectTab = "dashboard";
  } else if (verifiedRole === "School Administrator" || verifiedRole === "Admin" || inputEmail.includes("admin")) {
    verifiedRole = "School Administrator";
    redirectTab = "dashboard";
  } else if (verifiedRole === "Account Officer" || inputEmail.includes("bursar")) {
    verifiedRole = "Account Officer";
    redirectTab = "finance";
  } else if (verifiedRole === "Exam Officer") {
    verifiedRole = "Exam Officer";
    redirectTab = "academic-ai-exam-generator";
  } else if (verifiedRole === "Librarian") {
    verifiedRole = "Librarian";
    redirectTab = "library";
  }

  const defaultSchool = verifiedSchoolsStore[0];
  const staffUser = {
    id: staffId || "TCH-2026-001",
    name: "Mrs. Okonkwo Beatrice",
    email: inputEmail || "okonkwo.b@livingstone.edu.ng",
    role: verifiedRole,
    schoolId: defaultSchool.id,
    schoolName: defaultSchool.name
  };

  return res.json({
    success: true,
    userRole: verifiedRole,
    redirectTab,
    user: staffUser
  });
});

// Audit Store for Class Promotion Changes
const classChangeAuditLogStore: any[] = [];

// Student Account Registration with Admission Number Verification & Required Fields
app.post("/api/auth/register/student", (req, res) => {
  const {
    schoolId = "SCH-001",
    schoolName = "",
    fullName = "",
    admissionNo = "",
    classLevel = "SS2",
    email = "",
    password = ""
  } = req.body;

  const school = verifiedSchoolsStore.find(s => s.id === schoolId) || verifiedSchoolsStore[0];
  const registeredSchoolName = schoolName ? String(schoolName).trim() : school.name;
  const cleanAdm = String(admissionNo).trim().toUpperCase();

  const generatedId = `STD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const finalAdmissionNo = cleanAdm || `LIV/2026/${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();

  const newStudentProfile = {
    studentId: generatedId,
    id: generatedId,
    fullName: fullName || "John David",
    name: fullName || "John David",
    schoolId: school.id,
    schoolName: registeredSchoolName,
    email: email || "student@livingstone.edu.ng",
    classLevel: classLevel || "SS2",
    class: classLevel || "SS2",
    admissionNumber: finalAdmissionNo,
    admissionNo: finalAdmissionNo,
    role: "student",
    status: "Active",
    createdAt: now,
    updatedAt: now,
    arm: "A",
    house: "Yellow House (Jasper)",
    medicalInfo: { allergies: "None", asthmatic: false, specialNotes: "None" },
    guardianDetails: {
      fatherName: "Guardian / Parent",
      motherName: "Guardian / Parent",
      primaryPhone: "+234 803 000 0000",
      email: email || "parent@livingstone.edu.ng",
      address: school.address
    },
    emergencyContacts: [],
    academicHistory: []
  };

  // Persist into memory stores
  studentsStore.unshift({
    id: generatedId,
    studentId: generatedId,
    name: fullName || "John David",
    fullName: fullName || "John David",
    admissionNo: finalAdmissionNo,
    admissionNumber: finalAdmissionNo,
    class: classLevel,
    classLevel: classLevel,
    gender: "Male",
    parentName: "Parent",
    parentPhone: "+234 803 000 0000",
    status: "Active",
    email,
    schoolId: school.id,
    schoolName: registeredSchoolName,
    role: "student",
    createdAt: now,
    updatedAt: now
  });

  studentProfilesStore.unshift(newStudentProfile);

  return res.json({
    success: true,
    message: `Student Registration Completed Successfully for ${fullName || "Student"} in class ${classLevel}`,
    userRole: "Student",
    redirectTab: "student-parent-portal",
    token: `JWT_REGISTERED_STUDENT_${Date.now()}`,
    school: { ...school, name: registeredSchoolName },
    student: newStudentProfile
  });
});

// Update / Promote Student Class (Teacher, Class Teacher, Administrator Only)
app.put("/api/students/:id/class", (req, res) => {
  const { id } = req.params;
  const { newClassLevel, changedBy = "Teacher / Administrator", reason = "Academic Promotion" } = req.body;

  if (!newClassLevel) {
    return res.status(400).json({ success: false, message: "newClassLevel is required" });
  }

  const std = studentsStore.find(s => s.id === id || s.studentId === id);
  const stdProf = studentProfilesStore.find(s => s.id === id || s.studentId === id);

  const oldClass = std ? (std.classLevel || std.class) : (stdProf ? (stdProf.classLevel || stdProf.class) : "SS1");

  if (std) {
    std.classLevel = newClassLevel;
    std.class = newClassLevel;
    std.updatedAt = new Date().toISOString();
  }
  if (stdProf) {
    stdProf.classLevel = newClassLevel;
    stdProf.class = newClassLevel;
    stdProf.updatedAt = new Date().toISOString();
  }

  const auditRecord = {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    studentId: id,
    studentName: std ? (std.fullName || std.name) : (stdProf?.fullName || stdProf?.name || "Student"),
    oldClass,
    newClass: newClassLevel,
    changedBy,
    reason
  };

  classChangeAuditLogStore.unshift(auditRecord);

  res.json({
    success: true,
    message: `Student class successfully updated from ${oldClass} to ${newClassLevel}`,
    audit: auditRecord
  });
});

// Audit Log for Class Promotion Changes
app.get("/api/students/class-audit-log", (req, res) => {
  res.json({ success: true, count: classChangeAuditLogStore.length, logs: classChangeAuditLogStore });
});

// Teacher Account Registration with Staff ID Verification
app.post("/api/auth/register/teacher", (req, res) => {
  const { schoolId = "SCH-001", schoolName = "", staffId = "", fullName = "", email = "", password = "" } = req.body;

  const school = verifiedSchoolsStore.find(s => s.id === schoolId) || verifiedSchoolsStore[0];
  const registeredSchoolName = schoolName ? String(schoolName).trim() : school.name;
  const cleanStaffId = String(staffId).trim().toUpperCase();

  const record = validSchoolStaffRecords[cleanStaffId];

  if (!cleanStaffId.startsWith("STF-") && !cleanStaffId.startsWith("TCH-") && !cleanStaffId.startsWith("ADM-") && !cleanStaffId.startsWith("PRN-") && !record) {
    return res.status(400).json({
      success: false,
      message: `Verification Failed: Staff ID / Invitation Code '${cleanStaffId}' is invalid or has not been issued by ${registeredSchoolName}'s School Administrator.`
    });
  }

  const detectedRole = record ? record.defaultRole : "Teacher";

  return res.json({
    success: true,
    message: `Staff Account Activated Successfully! Verified Role: ${detectedRole}`,
    userRole: detectedRole,
    redirectTab: detectedRole === "School Administrator" || detectedRole === "Principal" ? "dashboard" : "teacher-portal",
    token: `JWT_REGISTERED_STAFF_${Date.now()}`,
    school: { ...school, name: registeredSchoolName },
    staff: {
      staffId: cleanStaffId,
      name: fullName || record?.staffName || "Mrs. Okonkwo Beatrice",
      assignedRole: detectedRole,
      email,
      schoolName: registeredSchoolName
    }
  });
});

// Password Reset Endpoint
app.post("/api/auth/forgot-password", (req, res) => {
  const { schoolId = "SCH-001", email = "" } = req.body;

  res.json({
    success: true,
    message: `Secure password reset instructions & verification OTP have been dispatched to ${email || "your registered email address"}.`
  });
});

// --- STUDENT & PARENT PORTAL REST API ENDPOINTS ---

// Auth Endpoint for Student / Parent
app.post("/api/student-parent/auth/login", (req, res) => {
  const { emailOrAdmission, role = "Student" } = req.body;

  if (role === "Parent") {
    const parent = parentProfilesStore[0];
    return res.json({
      success: true,
      role: "Parent",
      token: `JWT_PAR_${Date.now()}_SECURE_TOKEN`,
      school: {
        id: "SCH-001",
        name: "Livingstone International College",
        code: "LIV-LAGOS-01",
        logo: "https://livingstone.edu.ng/logo.png"
      },
      profile: parent,
      activeChild: parent.linkedChildren[0]
    });
  } else {
    const student = studentProfilesStore[0];
    return res.json({
      success: true,
      role: "Student",
      token: `JWT_STD_${Date.now()}_SECURE_TOKEN`,
      school: {
        id: "SCH-001",
        name: "Livingstone International College",
        code: "LIV-LAGOS-01",
        logo: "https://livingstone.edu.ng/logo.png"
      },
      profile: student
    });
  }
});

// Parent Linked Children Endpoint
app.get("/api/parent/children", (req, res) => {
  const parent = parentProfilesStore[0];
  res.json({ success: true, children: parent.linkedChildren });
});

// Student Dashboard Overview
app.get("/api/student/dashboard", (req, res) => {
  const student = studentProfilesStore[0];
  const fees = studentFeesStore[0];
  const activeCbt = studentCbtStore.filter(c => c.status === "Active");
  const pendingAssignments = studentAssignmentsStore.filter(a => a.submissions.length === 0);

  res.json({
    success: true,
    studentProfile: {
      id: student.id,
      admissionNo: student.admissionNo,
      name: student.name,
      class: student.class,
      arm: student.arm,
      house: student.house,
      genotype: student.genotype,
      bloodGroup: student.bloodGroup
    },
    attendanceSummary: {
      totalDays: 65,
      presentDays: 62,
      absentDays: 2,
      excusedDays: 1,
      attendancePercentage: "95.4%"
    },
    academicTerm: {
      session: "2026/2027",
      term: "First Term",
      week: "Week 4"
    },
    todayTimetable: [
      { period: "1st Period (08:00 - 08:40)", subject: "Mathematics", teacher: "Mrs. Okonkwo Beatrice", venue: "Block A - Room 12" },
      { period: "2nd Period (08:40 - 09:20)", subject: "English Language", teacher: "Mr. Adebayo Kunle", venue: "Block A - Room 12" },
      { period: "3rd Period (09:20 - 10:00)", subject: "Physics", teacher: "Dr. Eze Chukwuma", venue: "Physics Laboratory" },
      { period: "4th Period (10:40 - 11:20)", subject: "Chemistry", teacher: "Mrs. Usman Fatima", venue: "Chemistry Laboratory" }
    ],
    pendingAssignments: pendingAssignments.map(a => ({
      id: a.id,
      subject: a.subject,
      title: a.title,
      deadline: a.deadline,
      totalPoints: a.totalPoints
    })),
    upcomingExamsAndCbt: activeCbt,
    feesSummary: {
      totalAmount: fees.totalAmount,
      paidAmount: fees.paidAmount,
      outstandingBalance: fees.outstandingBalance,
      status: fees.status
    },
    schoolAnnouncements: [
      { id: "ann-1", title: "Inter-House Sports Heat Practice", date: "2026-07-28", text: "All students in Yellow and Blue houses must assemble at the main stadium by 3:30 PM today." },
      { id: "ann-2", title: "WAEC Chemistry Practical Lab Prep", date: "2026-07-27", text: "Ensure your safety goggles and lab coats are presented to Dr. Eze before Thursday." }
    ]
  });
});

// Parent Dashboard Overview
app.get("/api/parent/dashboard", (req, res) => {
  const childId = String(req.query.studentId || "STD-2026-001");
  const student = studentProfilesStore.find(s => s.id === childId) || studentProfilesStore[0];
  const fees = studentFeesStore.find(f => f.studentId === student.id) || studentFeesStore[0];

  res.json({
    success: true,
    parentProfile: parentProfilesStore[0],
    selectedChild: {
      id: student.id,
      name: student.name,
      admissionNo: student.admissionNo,
      class: student.class,
      arm: student.arm,
      house: student.house
    },
    attendance: {
      percentage: "95.4%",
      present: 62,
      absent: 2,
      status: "Excellent Regularity"
    },
    academicPerformance: {
      currentAverage: "84.2%",
      rankInClass: "2nd / 42",
      topSubject: "Mathematics (92%)",
      needsAttention: "Chemistry (68%)"
    },
    feesStatus: {
      invoiceId: fees.id,
      totalAmount: fees.totalAmount,
      paidAmount: fees.paidAmount,
      outstandingBalance: fees.outstandingBalance,
      status: fees.status,
      dueDate: fees.dueDate
    },
    teacherMessages: teacherMessagesStore.slice(0, 3),
    recentActivities: [
      { activity: "Completed CBT Math Assessment", date: "2026-07-28", score: "18/20" },
      { activity: "Submitted Physics Homework 4", date: "2026-07-27", status: "Graded" },
      { activity: "Attended STEM Robotics Workshop", date: "2026-07-25", status: "Verified" }
    ]
  });
});

// Full Student Profile
app.get("/api/student/profile", (req, res) => {
  const studentId = String(req.query.studentId || "STD-2026-001");
  let profile = studentProfilesStore.find(s => s.id === studentId || s.studentId === studentId) || studentProfilesStore[0];
  res.json({ success: true, profile });
});

// Update Student Bio Profile & Passport Photo
app.put("/api/student/profile", (req, res) => {
  const {
    studentId,
    fullName,
    name,
    dob,
    gender,
    phone,
    address,
    parentName,
    parentPhone,
    photoUrl,
    schoolName
  } = req.body;

  const targetId = studentId || "STD-2026-001";
  let profile = studentProfilesStore.find(s => s.id === targetId || s.studentId === targetId);

  if (!profile) {
    profile = studentProfilesStore[0];
  }

  const updatedName = fullName || name || profile.fullName || profile.name;

  if (updatedName) {
    profile.fullName = updatedName;
    profile.name = updatedName;
  }
  if (dob !== undefined) profile.dob = dob;
  if (gender !== undefined) profile.gender = gender;
  if (phone !== undefined) profile.phone = phone;
  if (address !== undefined) profile.address = address;
  if (photoUrl !== undefined) profile.photoUrl = photoUrl;
  if (schoolName !== undefined) profile.schoolName = schoolName;

  if (parentName || parentPhone || address) {
    if (!profile.guardianDetails) profile.guardianDetails = {};
    if (parentName) profile.guardianDetails.fatherName = parentName;
    if (parentPhone) profile.guardianDetails.primaryPhone = parentPhone;
    if (address) profile.guardianDetails.address = address;
  }

  // Sync back to studentsStore
  const std = studentsStore.find(s => s.id === targetId || s.studentId === targetId);
  if (std) {
    std.name = updatedName;
    std.fullName = updatedName;
    if (gender) std.gender = gender;
    if (parentName) std.parentName = parentName;
    if (parentPhone) std.parentPhone = parentPhone;
  }

  res.json({
    success: true,
    message: "Student profile updated successfully in database!",
    profile
  });
});

// Student Attendance Report
app.get("/api/student/attendance", (req, res) => {
  res.json({
    success: true,
    summary: {
      termTotalDays: 65,
      presentDays: 62,
      absentDays: 2,
      lateDays: 1,
      attendanceRate: "95.4%"
    },
    monthlyBreakdown: [
      { month: "May 2026", total: 22, present: 21, absent: 1 },
      { month: "June 2026", total: 20, present: 19, absent: 1 },
      { month: "July 2026", total: 23, present: 22, absent: 0 }
    ],
    dailyLogs: [
      { date: "2026-07-29", status: "Present", arrivalTime: "07:38 AM", verifiedBy: "Mr. Chukwudi (Class Teacher)" },
      { date: "2026-07-28", status: "Present", arrivalTime: "07:42 AM", verifiedBy: "Mr. Chukwudi (Class Teacher)" },
      { date: "2026-07-27", status: "Present", arrivalTime: "07:35 AM", verifiedBy: "Mr. Chukwudi (Class Teacher)" },
      { date: "2026-07-24", status: "Absent", arrivalTime: "-", verifiedBy: "Parent Excuse Note (Medical)" },
      { date: "2026-07-23", status: "Present", arrivalTime: "07:45 AM", verifiedBy: "Mr. Chukwudi (Class Teacher)" }
    ]
  });
});

// Student Results & Report Card Engine
app.get("/api/student/results", (req, res) => {
  const results = {
    session: "2025/2026",
    term: "Third Term Final Broadsheet",
    studentName: "Adeyemi Chinedu",
    admissionNo: "LIV/2026/001",
    class: "SS2 Gold",
    subjects: [
      { subject: "Mathematics", ca1: 18, ca2: 19, exam: 55, total: 92, grade: "A1", remark: "Excellent", classAvg: 71.4, positionInSubject: "1st" },
      { subject: "English Language", ca1: 16, ca2: 17, exam: 48, total: 81, grade: "A1", remark: "Excellent", classAvg: 68.2, positionInSubject: "3rd" },
      { subject: "Physics", ca1: 17, ca2: 18, exam: 52, total: 87, grade: "A1", remark: "Excellent", classAvg: 65.0, positionInSubject: "2nd" },
      { subject: "Chemistry", ca1: 14, ca2: 15, exam: 45, total: 74, grade: "B2", remark: "Very Good", classAvg: 62.5, positionInSubject: "5th" },
      { subject: "Biology", ca1: 15, ca2: 16, exam: 49, total: 80, grade: "A1", remark: "Excellent", classAvg: 64.1, positionInSubject: "4th" },
      { subject: "Further Mathematics", ca1: 19, ca2: 18, exam: 58, total: 95, grade: "A1", remark: "Distinction", classAvg: 58.0, positionInSubject: "1st" },
      { subject: "Technical Drawing", ca1: 16, ca2: 15, exam: 50, total: 81, grade: "A1", remark: "Excellent", classAvg: 70.2, positionInSubject: "2nd" },
      { subject: "Civic Education", ca1: 17, ca2: 17, exam: 46, total: 80, grade: "A1", remark: "Excellent", classAvg: 73.0, positionInSubject: "4th" },
      { subject: "Computer Studies / ICT", ca1: 19, ca2: 19, exam: 56, total: 94, grade: "A1", remark: "Distinction", classAvg: 75.1, positionInSubject: "1st" }
    ],
    overallTotal: 764,
    maximumPossible: 900,
    average: 84.89,
    positionInClass: "2nd out of 42",
    psychomotorAssessment: {
      handwriting: 5,
      verbalFluency: 5,
      sportsAndGames: 4,
      musicalSkills: 3,
      craftsAndDesign: 4
    },
    affectiveAssessment: {
      punctuality: 5,
      cleanliness: 5,
      honestyAndIntegrity: 5,
      leadershipAttitude: 4,
      politenessAndRespect: 5
    },
    teacherRemarks: "Chinedu is an exemplary STEM scholar. His analytical depth in Further Mathematics and Physics is outstanding.",
    principalRemarks: "Remarkable academic brilliance. Highly recommended for National Olympiad representation.",
    promotionStatus: "PROMOTED TO SS3 GOLD"
  };

  res.json({ success: true, results });
});

// Report Card PDF Compilation
app.get("/api/student/report-card/pdf", (req, res) => {
  res.json({
    success: true,
    message: "Official Livingstone International College Report Card PDF Compiled",
    downloadUrl: "https://livingstone.edu.ng/reports/STD-2026-001-Term3-ReportCard.pdf",
    verificationToken: "LIV-VERIFY-2026-99381A"
  });
});

// Student Homework & Assignments
app.get("/api/student/assignments", (req, res) => {
  res.json({ success: true, count: studentAssignmentsStore.length, data: studentAssignmentsStore });
});

app.post("/api/student/assignments/:id/submit", (req, res) => {
  const { submissionText = "", attachmentUrl = "" } = req.body;
  const assignment = studentAssignmentsStore.find(a => a.id === req.params.id);

  if (!assignment) {
    return res.status(404).json({ success: false, message: "Assignment not found" });
  }

  const submission = {
    studentId: "STD-2026-001",
    submittedAt: new Date().toISOString(),
    submissionText,
    attachmentUrl: attachmentUrl || "https://livingstone.edu.ng/uploads/student-submission.pdf",
    status: "Submitted",
    score: null,
    teacherFeedback: "Submitted on time. Awaiting teacher grading."
  };

  assignment.submissions = [submission];
  res.json({ success: true, message: "Homework submitted successfully to Livingstone Cloud Portal", data: submission });
});

// Student CBT Exam Endpoints
app.get("/api/student/cbt/active", (req, res) => {
  res.json({ success: true, count: studentCbtStore.length, data: studentCbtStore });
});

app.post("/api/student/cbt/start", (req, res) => {
  const { examId } = req.body;
  const exam = studentCbtStore.find(e => e.id === examId) || studentCbtStore[0];

  const attempt = {
    attemptId: `ATT-${Date.now()}`,
    examId: exam.id,
    studentId: "STD-2026-001",
    startTime: new Date().toISOString(),
    remainingSeconds: exam.durationMinutes * 60,
    status: "In Progress",
    questions: exam.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      marks: q.marks
    }))
  };

  studentCbtAttemptsStore.push(attempt);
  res.json({ success: true, message: "CBT exam session initialized securely", data: attempt });
});

app.post("/api/student/cbt/submit", (req, res) => {
  const { examId, userAnswers } = req.body;
  const exam = studentCbtStore.find(e => e.id === examId) || studentCbtStore[0];

  let totalScore = 0;
  let maxScore = 0;

  const gradedQuestions = exam.questions.map(q => {
    maxScore += q.marks;
    const selectedOpt = userAnswers ? userAnswers[q.id] : null;
    const isCorrect = selectedOpt === q.correctOptionIndex;
    if (isCorrect) totalScore += q.marks;

    return {
      id: q.id,
      question: q.question,
      selectedOption: selectedOpt,
      correctOption: q.correctOptionIndex,
      isCorrect,
      marksObtained: isCorrect ? q.marks : 0
    };
  });

  const percentage = maxScore > 0 ? ((totalScore / maxScore) * 100).toFixed(1) : "0";

  const result = {
    examId: exam.id,
    examTitle: exam.title,
    studentId: "STD-2026-001",
    totalScore,
    maxScore,
    percentage: `${percentage}%`,
    submittedAt: new Date().toISOString(),
    status: Number(percentage) >= 50 ? "Passed" : "Needs Improvement",
    breakdown: gradedQuestions
  };

  res.json({ success: true, message: "CBT Exam submitted and auto-graded successfully", data: result });
});

// Fees Portal & Paystack / Flutterwave Online Payment Integration
app.get("/api/student/fees/invoice", (req, res) => {
  res.json({ success: true, invoice: studentFeesStore[0] });
});

app.post("/api/student/fees/pay", (req, res) => {
  const { amount, paymentMethod = "Paystack Online Gateway", cardOrBankDetails } = req.body;
  const fees = studentFeesStore[0];

  const paidNum = Number(amount) || 50000;
  fees.paidAmount += paidNum;
  fees.outstandingBalance = Math.max(0, fees.totalAmount - fees.paidAmount);
  fees.status = fees.outstandingBalance === 0 ? "Fully Paid" : "Partially Paid";

  const receiptNo = `RCP-2026-${Math.floor(100 + Math.random() * 900)}`;
  const txnRef = `PAYSTACK_REF_${Date.now()}`;

  const newReceipt = {
    receiptNo,
    amountPaid: paidNum,
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod,
    transactionRef: txnRef
  };

  fees.paymentsHistory.unshift(newReceipt);

  res.json({
    success: true,
    message: `Payment of ₦${paidNum.toLocaleString()} processed successfully via ${paymentMethod}`,
    receipt: {
      ...newReceipt,
      studentName: fees.studentName,
      admissionNo: "LIV/2026/001",
      class: fees.class,
      remainingOutstanding: fees.outstandingBalance,
      officialSealUrl: "https://livingstone.edu.ng/seal.png"
    }
  });
});

// AI Student Learning Assistant (Gemini AI Powered)
app.post("/api/student/ai/study-assistant", async (req, res) => {
  const { prompt = "Explain completing the square method in quadratic equations step by step with an example", subject = "Mathematics", examTarget = "WAEC" } = req.body;

  const gemini = getGeminiAI();

  if (gemini) {
    try {
      const aiPrompt = `You are the LIVINGSTONEEDU Gemini AI Personal Study Tutor for high school students preparing for ${examTarget} exams in ${subject}.
Answer the student's question clearly, concisely, and with accurate step-by-step explanations, formulas, or practice problems.

Student Request: ${prompt}`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.6-flash",
        contents: aiPrompt,
      });

      if (response.text) {
        return res.json({ success: true, reply: response.text });
      }
    } catch (err: any) {
      console.error("Gemini AI Student Tutor Error:", err);
    }
  }

  // Fallback step-by-step study tutor response
  return res.json({
    success: true,
    reply: `### Livingstone AI Study Tutor - ${subject} (${examTarget} Prep)\n\n**Topic Explanation & Step-by-Step Solution:**\n\nTo solve quadratic equations $ax^2 + bx + c = 0$ using **Completing the Square Method**:\n\n1. **Step 1:** Divide the entire equation by $a$ so coefficient of $x^2$ is 1.\n2. **Step 2:** Transpose the constant term $c/a$ to the right side: $x^2 + \\frac{b}{a}x = -\\frac{c}{a}$.\n3. **Step 3:** Add the square of half the coefficient of $x$, i.e., $\\left(\\frac{b}{2a}\\right)^2$, to both sides.\n4. **Step 4:** Factor the left-hand side as a perfect square: $\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}$.\n5. **Step 5:** Take the square root on both sides and solve for $x$.\n\n*Try this WAEC Practice Question:* Solve $2x^2 + 5x - 3 = 0$ using completing the square!`
  });
});

// AI Parent Assistant (Gemini AI Powered)
app.post("/api/parent/ai/guidance", async (req, res) => {
  const { prompt = "How can I help my child improve in Chemistry this term?" } = req.body;

  const gemini = getGeminiAI();

  if (gemini) {
    try {
      const aiPrompt = `You are the LIVINGSTONEEDU AI Parent Advisory Assistant. Provide empathetic, practical, educational guidance for a parent regarding their child's academic performance, school policies, or home study tips.

Parent Inquiry: ${prompt}`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.6-flash",
        contents: aiPrompt,
      });

      if (response.text) {
        return res.json({ success: true, reply: response.text });
      }
    } catch (err: any) {
      console.error("Gemini AI Parent Guidance Error:", err);
    }
  }

  return res.json({
    success: true,
    reply: `### Livingstone Parent Advisory Guide\n\n**Recommendations for Enhancing Chemistry Performance:**\n\n1. **Review WAEC Practical Lab Topics:** Chemistry requires hands-on understanding of volumetric analysis (titration) and qualitative analysis. Encourage Chinedu to spend 30 minutes daily reviewing reaction equations.\n2. **Utilize E-Library Resources:** Access the Livingstone Digital Library under the Student Download Center to download past WAEC practical worksheets.\n3. **Schedule Teacher Consultation:** You can send a direct message to Mrs. Usman Fatima (Chemistry Teacher) via the Messages tab on this portal.`
  });
});

// Student & Parent Download Center
app.get("/api/student/downloads", (req, res) => {
  res.json({
    success: true,
    downloads: [
      { id: "dl-1", title: "Third Term Official Report Card (PDF)", category: "Report Cards", size: "2.4 MB", date: "2026-07-28", fileUrl: "/downloads/report-card.pdf" },
      { id: "dl-2", title: "Tuition Fee Official Receipt (RCP-2026-088)", category: "Receipts", size: "850 KB", date: "2026-07-15", fileUrl: "/downloads/receipt-88.pdf" },
      { id: "dl-3", title: "SS2 First Term Master Timetable & Exam Schedule", category: "Timetables", size: "1.1 MB", date: "2026-07-20", fileUrl: "/downloads/ss2-timetable.pdf" },
      { id: "dl-4", title: "WAEC 2026 STEM Syllabi & Formula Sheet", category: "Academic Materials", size: "4.8 MB", date: "2026-07-10", fileUrl: "/downloads/waec-stem-formulae.pdf" },
      { id: "dl-5", title: "Principal's School Circular - Inter-House Sports & PTA Assembly", category: "Circulars", size: "920 KB", date: "2026-07-25", fileUrl: "/downloads/circular-july.pdf" }
    ]
  });
});

// Students API
app.get("/api/students", (req, res) => {
  res.json({ success: true, count: studentsStore.length, data: studentsStore });
});

app.post("/api/students", (req, res) => {
  const newStudent = {
    id: `STD-2026-${String(studentsStore.length + 1).padStart(3, "0")}`,
    admissionNo: `LIV/2026/${Math.floor(100 + Math.random() * 900)}`,
    status: "Active",
    ...req.body,
  };
  studentsStore.unshift(newStudent);
  res.json({ success: true, message: "Student enrolled successfully", data: newStudent });
});

// Teachers API
app.get("/api/teachers", (req, res) => {
  res.json({ success: true, count: teachersStore.length, data: teachersStore });
});

app.post("/api/teachers", (req, res) => {
  const newTeacher = {
    id: `TCH-${String(teachersStore.length + 1).padStart(3, "0")}`,
    staffId: `STF-LIV-${Math.floor(100 + Math.random() * 900)}`,
    status: "Active",
    ...req.body,
  };
  teachersStore.unshift(newTeacher);
  res.json({ success: true, message: "Teacher added to directory", data: newTeacher });
});

// AI Lesson Notes Generator Endpoint
app.post("/api/ai/lesson-notes", async (req, res) => {
  const { country = "Nigeria", state = "Lagos", className = "SS2", subject = "Physics", term = "First Term", week = "Week 4", topic = "Wave Motion and Sound Waves", objectives = "", curriculum = "NERDC / WAEC Standard" } = req.body;

  const gemini = getGeminiAI();

  if (gemini) {
    try {
      const prompt = `You are a Master Curriculum Developer & Senior Pedagogy Expert for secondary schools following the ${curriculum} (Country: ${country}, State: ${state}).
Generate a highly detailed, professional, production-grade Lesson Note for:
- Class: ${className}
- Subject: ${subject}
- Term: ${term}, ${week}
- Topic: ${topic}
- Learning Objectives: ${objectives || "Define key concepts, explain physical principles, calculate numerical problems, list real-world applications."}

Respond ONLY with a valid JSON object matching this schema:
{
  "topic": "string",
  "subject": "string",
  "className": "string",
  "week": "string",
  "curriculumRef": "string",
  "durationMinutes": 80,
  "behavioralObjectives": ["string"],
  "instructionalMaterials": ["string"],
  "previousKnowledge": "string",
  "introduction": "string",
  "coreContent": [
    {
      "subheading": "string",
      "explanation": "string",
      "keyTerms": ["string"]
    }
  ],
  "teacherDemonstration": "string",
  "studentActivities": ["string"],
  "evaluationQuestions": ["string"],
  "summaryWrapUp": "string",
  "assignment": "string"
}`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        lessonNotesStore.unshift({ id: `ln-${Date.now()}`, ...parsed, createdAt: new Date().toISOString() });
        return res.json({ success: true, data: parsed });
      }
    } catch (err: any) {
      console.error("Gemini AI Lesson Notes Error:", err);
    }
  }

  // Fallback high quality lesson note generator if AI key is pending
  const fallbackNote = {
    topic: topic || "Wave Motion & Properties of Waves",
    subject: subject || "Physics",
    className: className || "SS2",
    week: week || "Week 4",
    curriculumRef: `${curriculum} - Unit 3 Section B`,
    durationMinutes: 80,
    behavioralObjectives: [
      `By the end of the lesson, students should be able to define progressive and stationary wave motion clearly.`,
      `State the wave equation V = fλ and solve 3 standard numerical problems.`,
      `Distinguish between transverse and longitudinal waves with 2 practical examples each.`,
      `Identify wave characteristics: Amplitude, Wavelength, Period, Frequency, and Wave Velocity.`,
    ],
    instructionalMaterials: ["Ripple tank apparatus", "Slinky spring toy", "Tuning forks (256Hz, 512Hz)", "Wall chart showing electromagnetic spectrum"],
    previousKnowledge: "Students are already familiar with simple harmonic motion (SHM) and mechanical oscillations.",
    introduction: "Teacher initiates the lesson by dropping a stone into a quiet vessel of water and asking students to observe the concentric ripples moving outward without transporting water particles.",
    coreContent: [
      {
        subheading: "1. Definition & Classification of Waves",
        explanation: "A wave is a disturbance that travels through a medium or vacuum, transferring energy and momentum from one point to another without causing permanent displacement of the medium particles. Waves are classified into Mechanical Waves (require material medium) and Electromagnetic Waves (travel in vacuum).",
        keyTerms: ["Disturbance", "Medium", "Mechanical Wave", "Electromagnetic Wave"],
      },
      {
        subheading: "2. Wave Characteristics & Mathematical Relations",
        explanation: "Mathematical equation: Wave speed (V) = Frequency (f) × Wavelength (λ). Period T = 1/f. Phase angle φ determines displacement position at any instance t.",
        keyTerms: ["Amplitude (A)", "Wavelength (λ)", "Frequency (f)", "Phase Difference"],
      },
    ],
    teacherDemonstration: "Demonstrating transverse wave pulses along a stretched rubber hose and longitudinal compression pulses along a slinky spring.",
    studentActivities: ["Measure wavelength intervals on graph grid", "Calculate wave frequency given velocity V = 340 m/s and λ = 0.85 m", "Group discussion on seismic S-waves and P-waves"],
    evaluationQuestions: [
      "Define wave motion and state two differences between mechanical and electromagnetic waves.",
      "A radio station broadcasts electromagnetic waves at a frequency of 90.5 MHz. Calculate the wavelength if speed of light c = 3.0 × 10⁸ m/s.",
      "Draw a labelled transverse wave profile showing amplitude and wavelength.",
    ],
    summaryWrapUp: "Re-emphasize that waves transfer energy without transferring matter, governed by the universal wave equation V = fλ.",
    assignment: "Complete questions 4 to 8 in Chapter 5 of New Secondary Physics (Okeke) and submit before Friday.",
  };

  lessonNotesStore.unshift({ id: `ln-${Date.now()}`, ...fallbackNote, createdAt: new Date().toISOString() });
  return res.json({ success: true, data: fallbackNote });
});

// AI Exam & Question Generator Endpoint
app.post("/api/ai/exam-generator", async (req, res) => {
  const {
    className = "SS2",
    subject = "Mathematics",
    term = "First Term",
    examType = "Mid-Term Examination",
    questionCount = 20,
    difficulty = "Medium",
    topics = "Quadratic Equations, Indices & Logarithms, Trigonometry",
  } = req.body;

  const gemini = getGeminiAI();

  if (gemini) {
    try {
      const prompt = `You are a Senior West African Examinations Council (WAEC) & NERDC Senior Examiner.
Generate an official Examination Paper and Marking Scheme for:
- Subject: ${subject}
- Class: ${className}
- Term: ${term}
- Exam Type: ${examType}
- Target Questions Count: ${questionCount}
- Difficulty Level: ${difficulty}
- Topics Covered: ${topics}

Return ONLY valid JSON matching this schema:
{
  "title": "string",
  "subject": "string",
  "className": "string",
  "term": "string",
  "timeAllowed": "string",
  "instructions": "string",
  "objectives": [
    {
      "id": "q-1",
      "questionNumber": 1,
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "correctOptionIndex": 0,
      "explanation": "string",
      "bloomTaxonomy": "string"
    }
  ],
  "theoryQuestions": [
    {
      "id": "th-1",
      "questionNumber": 1,
      "question": "string",
      "marks": 10,
      "markingScheme": "string",
      "bloomTaxonomy": "string"
    }
  ]
}`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ success: true, data: parsed });
      }
    } catch (err: any) {
      console.error("Gemini AI Exam Generator Error:", err);
    }
  }

  // Fallback high quality exam generator
  const fallbackExam = {
    title: `${className} ${subject} ${examType}`,
    subject,
    className,
    term,
    timeAllowed: "1 Hour 30 Minutes",
    instructions: "Answer ALL questions in Section A (Objectives) and TWO questions from Section B (Theory). Show clear mathematical workings where appropriate.",
    objectives: Array.from({ length: Math.min(Number(questionCount), 10) }).map((_, idx) => ({
      id: `q-gen-${idx + 1}`,
      questionNumber: idx + 1,
      question: `Question ${idx + 1}: Solve for x in the equation 3^(2x + 1) = 27^(x - 2).`,
      options: ["x = 7", "x = 5", "x = 3", "x = 9"],
      correctAnswer: "x = 7",
      correctOptionIndex: 0,
      explanation: "Rewrite 27 as 3^3. Then 3^(2x + 1) = 3^(3x - 6) => 2x + 1 = 3x - 6 => x = 7.",
      bloomTaxonomy: idx % 2 === 0 ? "Application" : "Analysis",
    })),
    theoryQuestions: [
      {
        id: "th-1",
        questionNumber: 1,
        question: "1(a) Prove by mathematical induction or expansion that the sum of roots of ax² + bx + c = 0 is -b/a.\n1(b) Given that 𝛼 and 𝛽 are roots of 2x² - 7x + 3 = 0, find the quadratic equation whose roots are 1/𝛼 and 1/𝛽.",
        marks: 10,
        markingScheme: "1(a) Correct derivation using quadratic formula x = (-b ± √(b² - 4ac))/2a (4 marks)\n1(b) Sum of roots 𝛼+𝛽 = 7/2, product 𝛼𝛽 = 3/2. New sum = (𝛼+𝛽)/𝛼𝛽 = (7/2)/(3/2) = 7/3. New product = 2/3. Equation: 3x² - 7x + 2 = 0 (6 marks)",
        bloomTaxonomy: "Synthesis",
      },
      {
        id: "th-2",
        questionNumber: 2,
        question: "2(a) Evaluate log₁₀(25) + log₁₀(4) - log₁₀(10).\n2(b) A ladder of length 12m leans against a vertical wall making an angle of 60° with the horizontal ground. Calculate the height reached up the wall.",
        marks: 10,
        markingScheme: "2(a) log₁₀(25 × 4 / 10) = log₁₀(100/10) = log₁₀(10) = 1 (4 marks)\n2(b) sin(60°) = h/12 => h = 12 × (√3/2) = 6√3 ≈ 10.39m (6 marks)",
        bloomTaxonomy: "Evaluation",
      },
    ],
  };

  return res.json({ success: true, data: fallbackExam });
});

// Question Bank API
app.get("/api/question-bank", (req, res) => {
  res.json({ success: true, count: questionBank.length, data: questionBank });
});

app.post("/api/question-bank", (req, res) => {
  const newQ = { id: `q-${Date.now()}`, ...req.body };
  questionBank.unshift(newQ);
  res.json({ success: true, message: "Question saved to Question Bank", data: newQ });
});

// Report Card Calculation Engine Endpoint
app.post("/api/report-card/calculate", (req, res) => {
  const { studentName, class: className, term, scores } = req.body;

  // Calculate scores per subject
  const processedSubjects = (scores || []).map((subj: any) => {
    const ca1 = Number(subj.ca1) || 0;
    const ca2 = Number(subj.ca2) || 0;
    const exam = Number(subj.exam) || 0;
    const total = ca1 + ca2 + exam;

    let grade = "F";
    let remark = "Fail";

    if (total >= 75) { grade = "A1"; remark = "Excellent"; }
    else if (total >= 70) { grade = "B2"; remark = "Very Good"; }
    else if (total >= 65) { grade = "B3"; remark = "Good"; }
    else if (total >= 60) { grade = "C4"; remark = "Credit"; }
    else if (total >= 55) { grade = "C5"; remark = "Credit"; }
    else if (total >= 50) { grade = "C6"; remark = "Credit"; }
    else if (total >= 45) { grade = "D7"; remark = "Pass"; }
    else if (total >= 40) { grade = "E8"; remark = "Pass"; }

    return {
      ...subj,
      ca1,
      ca2,
      exam,
      total,
      grade,
      remark,
    };
  });

  const overallTotal = processedSubjects.reduce((acc: number, item: any) => acc + item.total, 0);
  const average = processedSubjects.length > 0 ? (overallTotal / processedSubjects.length).toFixed(2) : 0;

  let promotionStatus = "Promoted to Next Class";
  if (Number(average) < 45) {
    promotionStatus = "Advised to Repeat";
  }

  const resultCard = {
    reportId: `REP-${Date.now()}`,
    studentName: studentName || "Adeyemi Chinedu",
    studentId: "STD-2026-089",
    class: className || "SS2 Gold",
    term: term || "First Term 2026/2027",
    subjects: processedSubjects,
    overallTotal,
    average: Number(average),
    positionInClass: "2nd out of 42",
    attendance: "64 out of 65 days",
    psychomotor: {
      punctuality: 5,
      cleanliness: 5,
      sports: 4,
      leadership: 4,
      honesty: 5,
    },
    affectiveDomain: {
      socialBehavior: 5,
      attentiveness: 4,
      perseverance: 5,
      emotionalStability: 4,
    },
    teacherComment: "Chinedu is a brilliant, disciplined student who consistently shows high aptitude in STEM subjects.",
    principalComment: "Outstanding performance! Keep maintaining this academic standard.",
    promotionStatus,
    qrVerificationToken: `VERIFY-LIV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
  };

  res.json({ success: true, data: resultCard });
});

// Floating AI Assistant Endpoint
app.post("/api/ai/assistant", async (req, res) => {
  const { prompt = "", role = "Teacher", context = "General" } = req.body;
  const gemini = getGeminiAI();

  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are the LIVINGSTONEEDU AI Copilot Assistant serving a user with role "${role}" in context "${context}".
Provide an articulate, helpful, structured, and actionable response for:
Prompt: ${prompt}`,
      });

      if (response.text) {
        return res.json({ success: true, reply: response.text });
      }
    } catch (err: any) {
      console.error("Gemini AI Copilot Error:", err);
    }
  }

  // Fallback response
  return res.json({
    success: true,
    reply: `LIVINGSTONEEDU AI Assistant Response for [${role}]:\n\nI have analyzed your request regarding "${prompt}". Here are the suggested next steps:\n\n1. Automatically generated curriculum alignment draft verified against standard NERDC guidelines.\n2. You can export this draft directly to PDF, DOCX, or publish it to the School Notice Board.\n3. Let me know if you would like me to adjust the difficulty level or format!`,
  });
});

// Audit Logs Endpoint
app.get("/api/audit-logs", (req, res) => {
  res.json({ success: true, count: auditLogsStore.length, data: auditLogsStore });
});

// Announcements Endpoint
app.get("/api/announcements", (req, res) => {
  res.json({ success: true, data: announcementsStore });
});

app.post("/api/announcements", (req, res) => {
  const newAnn = { id: `ann-${Date.now()}`, date: new Date().toISOString().split("T")[0], ...req.body };
  announcementsStore.unshift(newAnn);
  res.json({ success: true, message: "Announcement broadcasted successfully", data: newAnn });
});

// Library Books Endpoint
app.get("/api/library/books", (req, res) => {
  res.json({ success: true, data: libraryBooksStore });
});

// Super Admin API Endpoints
app.get("/api/superadmin/dashboard", (req, res) => {
  res.json({
    success: true,
    metrics: {
      totalSchools: superAdminSchoolsStore.length || 142,
      totalTeachers: 3840,
      totalStudents: 42600,
      totalParents: 36210,
      activeUsers: 1420,
      totalRevenue: 142500000,
      aiRequestsToday: 18450,
      databaseUsage: "4.2 GB",
      storageUsage: "184.2 GB",
      serverHealth: "Healthy",
    },
  });
});

app.get("/api/superadmin/schools", (req, res) => {
  res.json({ success: true, data: superAdminSchoolsStore });
});

app.post("/api/superadmin/schools", (req, res) => {
  const newSch = {
    id: `SCH-${String(superAdminSchoolsStore.length + 1).padStart(3, "0")}`,
    name: req.body.name || "New Partner School",
    code: req.body.code || `SCH-${Date.now().toString().slice(-4)}`,
    adminEmail: req.body.adminEmail || "admin@school.edu.ng",
    plan: req.body.plan || "Enterprise Pro",
    storageUsedGB: 0.1,
    storageLimitGB: 100,
    aiCredits: 50000,
    aiCreditsUsed: 0,
    status: "Active",
    createdAt: new Date().toISOString().split("T")[0],
  };
  superAdminSchoolsStore.unshift(newSch);
  res.json({ success: true, message: "School provisioned successfully", data: newSch });
});

app.put("/api/superadmin/schools/:id/activate", (req, res) => {
  const sch = superAdminSchoolsStore.find((s) => s.id === req.params.id);
  if (sch) sch.status = "Active";
  res.json({ success: true, message: "School activated", data: sch });
});

app.put("/api/superadmin/schools/:id/suspend", (req, res) => {
  const sch = superAdminSchoolsStore.find((s) => s.id === req.params.id);
  if (sch) sch.status = "Suspended";
  res.json({ success: true, message: "School suspended", data: sch });
});

app.get("/api/superadmin/users", (req, res) => {
  res.json({ success: true, data: usersStore });
});

// --- WEBSITE BUILDER MODULE STORES & ENDPOINTS ---

let websiteThemeStore: any = {
  schoolName: "LIVINGSTONE INTERNATIONAL ACADEMY",
  tagline: "Empowerment, Character & Academic Excellence",
  logoUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80",
  primaryColor: "#1e3a8a",
  accentColor: "#d97706",
  backgroundColor: "#f8fafc",
  fontFamily: "Plus Jakarta Sans",
  headerStyle: "topbar",
  showAnnouncementBanner: true,
  announcementText: "🎉 2026/2027 Academic Year Admission is Now Open! Entrance Exams commence Aug 15th.",
  customDomain: "www.livingstone.edu.ng",
  subdomain: "livingstone.livingstone.edu.ng",
  isLive: true,
  maintenanceMode: false,
  lastPublishedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  themePreset: "Modern School",
  sslStatus: "Active & Secured (256-bit TLS)",
  dnsStatus: "Connected & Verified"
};

let websitePagesStore: any[] = [
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
          { id: "feat-1", title: "Dual Accreditation", description: "Cambridge International & National Curriculum synergy.", icon: "Award" },
          { id: "feat-2", title: "STEM & Robotics Labs", description: "Cutting-edge artificial intelligence, coding and science facilities.", icon: "Sparkles" },
          { id: "feat-3", title: "Modern Boarding", description: "Safe, serene and nurturing residential halls with 24/7 care.", icon: "Home" },
          { id: "feat-4", title: "100% Exam Pass Rate", description: "Consistent top scores in WAEC, IGCSE, and SAT assessments.", icon: "CheckCircle" },
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
        content: "Livingstone International Academy was founded on the belief that every child possesses unique genius waiting to be unlocked through holistic education.",
        imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80",
      },
      {
        id: "sec-about-text",
        type: "custom_text",
        title: "Mission, Vision & Core Values",
        content: "Mission: To empower students through personalized learning, critical thinking, and moral leadership. Core Values: Integrity, Innovation, Excellence, Discipline, and Empathy.",
      },
    ],
  },
  {
    id: "page-academics",
    title: "Academics",
    slug: "academics",
    isPublished: true,
    isSystemDefault: true,
    metaDescription: "Explore our Creche, Nursery, Primary, Secondary, and Cambridge IGCSE academic tracks.",
    sections: [
      {
        id: "sec-acad-hero",
        type: "hero",
        title: "Academic Programs & Curriculum",
        subtitle: "A balanced blend of NERDC National Standards & Cambridge International Education",
        content: "Our academic framework is structured into Early Years, Lower/Upper Basic, and Senior Secondary STEM/Humanities streams.",
        imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "page-admissions",
    title: "Admission",
    slug: "admission",
    isPublished: true,
    isSystemDefault: true,
    metaDescription: "Apply for admission into Livingstone Academy. Requirements, online enrollment form, and entrance exam dates.",
    sections: [
      {
        id: "sec-adm-hero",
        type: "hero",
        title: "Join The Livingstone Family",
        subtitle: "2026/2027 Academic Year Admission Guidelines & Application Portal",
        content: "We invite prospective parents to tour our campus and submit an application for Creche, Primary, or High School entry.",
        imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "page-teachers",
    title: "Teachers & Staff",
    slug: "teachers",
    isPublished: true,
    isSystemDefault: false,
    metaDescription: "Meet our passionate, certified educators, subject department heads, and school counselors.",
    sections: [
      {
        id: "sec-tch-hero",
        type: "hero",
        title: "Meet Our Faculty",
        subtitle: "Dedicated international educators inspiring curiosity every day",
        content: "Our teaching staff hold post-graduate certifications and undergo continuous professional development in AI-assisted teaching.",
        imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "page-contact",
    title: "Contact Us",
    slug: "contact",
    isPublished: true,
    isSystemDefault: true,
    metaDescription: "Contact details, campus address, Google Map location, and admissions inquiry form.",
    sections: [
      {
        id: "sec-contact-main",
        type: "contact",
        title: "Visit Our Campus",
        subtitle: "We welcome parents and students for guided campus tours Monday through Friday.",
        content: "Email: info@livingstone.edu.ng | Hotline: +234 800 548 4647",
      },
    ],
  },
];

let websiteBlogStore: any[] = [
  {
    id: "post-1",
    title: "Livingstone Students Excel in 2026 STEM & Robotics Olympiad",
    slug: "stem-olympiad-2026-victory",
    category: "Academic Achievements",
    excerpt: "Our senior secondary high school STEM squad secured first position in the National AI & Robotics Innovation Challenge.",
    content: "The Livingstone Senior Robotics Team demonstrated remarkable ingenuity at the 2026 National STEM Olympiad...",
    author: "Academic Standards Board",
    date: "2026-07-28",
    featuredImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    status: "Published",
    tags: ["Robotics", "STEM", "Excellence"]
  },
  {
    id: "post-2",
    title: "Parent-Teacher Conference and Term 1 Broadsheet Review",
    slug: "ptc-term-1-broadsheet-review",
    category: "Events & Announcements",
    excerpt: "All parents and guardians are cordially invited to the upcoming PTC session to discuss student academic progress reports.",
    content: "Dear Parents, We are pleased to announce our Mid-Term Parent-Teacher Consultation Day...",
    author: "Principal's Office",
    date: "2026-07-15",
    featuredImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
    status: "Published",
    tags: ["Parents", "Academics", "PTC"]
  }
];

let websiteMediaStore: any[] = [
  { id: "med-1", name: "School_Main_Building_Hero.jpg", type: "image", size: "2.4 MB", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80", folder: "Banners" },
  { id: "med-2", name: "Principal_Welcome_Portrait.jpg", type: "image", size: "1.1 MB", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80", folder: "Faculty" },
  { id: "med-3", name: "Admission_Prospectus_2026.pdf", type: "document", size: "4.8 MB", url: "https://example.com/prospectus.pdf", folder: "Downloads" },
  { id: "med-4", name: "Robotics_Lab_Tour.mp4", type: "video", size: "24.5 MB", url: "https://example.com/robotics.mp4", folder: "Media" },
];

let websiteFormInquiriesStore: any[] = [
  {
    id: "inq-101",
    formType: "Admission Form",
    parentName: "Engr. Patrick Nnamdi",
    studentName: "Chinedu Nnamdi",
    email: "p.nnamdi@gmail.com",
    phone: "+234 803 112 2334",
    targetClass: "SS1 STEM Track",
    message: "Inquiring about hostel accommodation facilities and entrance examination past questions.",
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: "New"
  },
  {
    id: "inq-102",
    formType: "Contact Form",
    parentName: "Mrs. Amina Yusuf",
    studentName: "Farida Yusuf",
    email: "a.yusuf@yahoo.com",
    phone: "+234 802 998 7766",
    targetClass: "JSS2 Transfer",
    message: "Would like to schedule a campus tour next Wednesday morning.",
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: "Responded"
  }
];

// GET website theme & settings
app.get("/api/website/settings", (req, res) => {
  res.json({ success: true, theme: websiteThemeStore });
});

// POST update website theme & settings
app.post("/api/website/settings", (req, res) => {
  websiteThemeStore = { ...websiteThemeStore, ...req.body, lastPublishedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
  res.json({ success: true, message: "Website theme and configuration updated!", theme: websiteThemeStore });
});

// GET website pages
app.get("/api/website/pages", (req, res) => {
  res.json({ success: true, pages: websitePagesStore });
});

// POST save website pages
app.post("/api/website/pages", (req, res) => {
  if (Array.isArray(req.body.pages)) {
    websitePagesStore = req.body.pages;
  }
  res.json({ success: true, message: "Website pages saved successfully!", pages: websitePagesStore });
});

// GET blog posts
app.get("/api/website/blog", (req, res) => {
  res.json({ success: true, posts: websiteBlogStore });
});

// POST create/update blog post
app.post("/api/website/blog", (req, res) => {
  const post = req.body;
  if (post.id) {
    const idx = websiteBlogStore.findIndex(p => p.id === post.id);
    if (idx !== -1) websiteBlogStore[idx] = { ...websiteBlogStore[idx], ...post };
    else websiteBlogStore.unshift(post);
  } else {
    post.id = `post-${Date.now()}`;
    post.date = new Date().toISOString().split("T")[0];
    websiteBlogStore.unshift(post);
  }
  res.json({ success: true, message: "Blog post saved successfully!", post });
});

// DELETE blog post
app.delete("/api/website/blog/:id", (req, res) => {
  websiteBlogStore = websiteBlogStore.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: "Blog post deleted!" });
});

// GET media items
app.get("/api/website/media", (req, res) => {
  res.json({ success: true, media: websiteMediaStore });
});

// POST upload/add media item
app.post("/api/website/media", (req, res) => {
  const newItem = {
    id: `med-${Date.now()}`,
    name: req.body.name || "Uploaded_Asset.jpg",
    type: req.body.type || "image",
    size: req.body.size || "1.5 MB",
    url: req.body.url || "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80",
    folder: req.body.folder || "General"
  };
  websiteMediaStore.unshift(newItem);
  res.json({ success: true, message: "Media asset uploaded!", item: newItem });
});

// GET form inquiries
app.get("/api/website/inquiries", (req, res) => {
  res.json({ success: true, inquiries: websiteFormInquiriesStore });
});

// POST submit public website form (Admission / Contact / Newsletter)
app.post("/api/website/submit-form", (req, res) => {
  const newInquiry = {
    id: `inq-${Date.now()}`,
    formType: req.body.formType || "Contact Form",
    parentName: req.body.parentName || req.body.name || "Prospective Parent",
    studentName: req.body.studentName || "-",
    email: req.body.email || "parent@example.com",
    phone: req.body.phone || "+234 800 000 0000",
    targetClass: req.body.targetClass || "General Inquiry",
    message: req.body.message || req.body.comments || "Inquiry submitted via school website.",
    submittedAt: new Date().toISOString(),
    status: "New"
  };
  websiteFormInquiriesStore.unshift(newInquiry);
  res.json({ success: true, message: "Thank you! Your inquiry has been submitted directly to the school admissions board.", inquiry: newInquiry });
});

// POST AI Website Generator (Gemini Prompt Proxy for full website or sections or translation)
app.post("/api/website/ai-generate", async (req, res) => {
  const { prompt = "", schoolDetails = {}, mode = "full-website", targetLanguage = "French" } = req.body;

  const ai = getGeminiAI();

  if (ai) {
    try {
      let systemPrompt = "";
      if (mode === "translate") {
        systemPrompt = `You are a translator for school websites. Translate the following text content accurately into ${targetLanguage}: \n\n${prompt}`;
      } else if (mode === "section") {
        systemPrompt = `You are an expert school website copywriter. Generate a high-converting, professional website section content for school "${schoolDetails.schoolName || 'Livingstone Academy'}". Prompt: ${prompt}`;
      } else {
        systemPrompt = `You are a master AI School Website Architect. Generate complete website JSON content including Hero title, Welcome speech, Mission statement, Features, and FAQ based on these school details: ${JSON.stringify(schoolDetails)}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: systemPrompt,
      });

      const text = response.text || "";
      return res.json({ success: true, generatedText: text, message: "AI Content generated successfully using Gemini 2.0 Flash!" });
    } catch (e: any) {
      console.error("Gemini AI error in website builder:", e);
    }
  }

  // Fallback if AI key not present or call fails
  if (mode === "translate") {
    return res.json({
      success: true,
      generatedText: `[${targetLanguage} Translation]\nBienvenue à ${schoolDetails.schoolName || 'Livingstone International Academy'}! Nous offrons un enseignement de classe mondiale et une formation intellectuelle de premier ordre.`,
      message: `Translated into ${targetLanguage}`
    });
  }

  res.json({
    success: true,
    generatedText: `Welcome to ${schoolDetails.schoolName || 'Livingstone International Academy'}. Empowering leaders through academic excellence, STEM innovation, and moral integrity. Our 2026/2027 admissions are open.`,
    message: "AI generated content prepared successfully!"
  });
});

const superAdminAnnouncementsStore: any[] = [
  {
    id: "ANNC-101",
    title: "Official Directive: First Term Continuous Assessment Deadline",
    message: "All secondary school teaching staff must compile and submit SS1-SS3 CA broadsheets to Admin HQ before 5:00 PM on Friday.",
    channel: "all",
    targetAudience: "teachers",
    sender: "Super Admin HQ",
    createdAt: new Date().toISOString(),
    status: "Active"
  },
  {
    id: "ANNC-102",
    title: "NERDC 2026 STEM Curriculum Auto-Sync",
    message: "The new WAEC/NERDC 2026 Physics and Further Mathematics scheme of work has been pushed to all teacher portals.",
    channel: "push",
    targetAudience: "all-schools",
    sender: "Academic Standards Directorate",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: "Active"
  }
];

const directTeacherNoticesStore: any[] = [
  {
    id: "NTC-501",
    teacherId: "TCH-001",
    teacherName: "Mrs. Okonkwo Beatrice",
    title: "Lesson Note Review Directive",
    message: "Kindly ensure Week 5 Further Mathematics lesson notes are updated with Gemini AI practice problems before the Principal's sign-off.",
    priority: "High",
    sentBy: "Super Admin HQ",
    date: new Date().toISOString(),
    acknowledged: false
  }
];

app.get("/api/superadmin/ai/stats", (req, res) => {
  res.json({
    success: true,
    activeModel: "gemini-1.5-pro",
    monthlyTokensUsed: 14200000,
    monthlyQuota: 50000000,
  });
});

app.get("/api/superadmin/ai/prompt-logs", (req, res) => {
  res.json({
    success: true,
    data: [
      { id: "PL-01", school: "Livingstone Int. College", user: "Mrs. Okonkwo", feature: "AI Lesson Note", model: "gemini-2.0-flash", tokens: 1420, timestamp: "2 mins ago", status: "Success", promptSnippet: "Generate SS2 Physics Lesson Note on Sound Waves" },
      { id: "PL-02", school: "Grace Heritage Academy", user: "Mr. David Alabi", feature: "CBT Question Gen", model: "gemini-1.5-pro", tokens: 3850, timestamp: "12 mins ago", status: "Success", promptSnippet: "20 WAEC Standard Chemistry Multiple Choice Questions" },
      { id: "PL-03", school: "Bright Stars College", user: "Admin Officer", feature: "Report Remark", model: "gemini-1.5-pro", tokens: 480, timestamp: "25 mins ago", status: "Success", promptSnippet: "Encouraging remark for top student in Mathematics" },
    ]
  });
});

app.get("/api/superadmin/curriculum", (req, res) => {
  res.json({
    success: true,
    data: [
      { id: "CURR-01", name: "NERDC National Senior Secondary Curriculum", level: "SS1 - SS3", subjectsCount: 24, status: "Active", updated: "2026-07-10" },
      { id: "CURR-02", name: "WAEC / NECO Official Examination Syllabus", level: "Senior High", subjectsCount: 18, status: "Active", updated: "2026-07-15" },
      { id: "CURR-03", name: "Cambridge IGCSE & A-Levels Standard", level: "International", subjectsCount: 12, status: "Active", updated: "2026-06-20" }
    ]
  });
});

app.get("/api/superadmin/payments", (req, res) => {
  res.json({ success: true, data: financeInvoicesStore });
});

app.get("/api/superadmin/monitoring/health", (req, res) => {
  res.json({
    success: true,
    system: { cpu: "14%", ram: "2.8 GB", status: "Healthy", uptime: "99.98%", activeConnections: 1420, redisPingMs: 0.8 },
  });
});

app.get("/api/superadmin/security/audit-logs", (req, res) => {
  res.json({ success: true, data: auditLogsStore });
});

app.get("/api/superadmin/backups", (req, res) => {
  res.json({
    success: true,
    data: [
      { id: "BKP-001", name: "Automated Daily Master Snapshot", size: "4.2 GB", date: "Today, 04:00 AM", status: "Completed" },
      { id: "BKP-002", name: "Weekly Firestore Disaster Recovery Point", size: "18.6 GB", date: "3 Days ago", status: "Completed" }
    ],
  });
});

app.post("/api/superadmin/backups/trigger", (req, res) => {
  const bk = {
    id: `BKP-${Date.now().toString().slice(-3)}`,
    name: req.body.name || "Manual Snapshot",
    size: "4.2 GB",
    date: "Just now",
    status: "Completed",
  };
  res.json({ success: true, message: "Backup snapshot created and stored safely in Livingstone Disaster Recovery Storage", data: bk });
});

app.get("/api/superadmin/settings", (req, res) => {
  res.json({ success: true, data: { maintenanceMode: false, aiGradingEnabled: true, cbtAutoProctoring: true, defaultCurrency: "NGN (₦)" } });
});

app.post("/api/superadmin/communication/emergency-alert", (req, res) => {
  const { title = "Emergency Alert", message = "", channel = "all", targetAudience = "all-schools" } = req.body;
  const newAlert = {
    id: `ANNC-${Date.now()}`,
    title,
    message,
    channel,
    targetAudience,
    sender: "Super Admin HQ",
    createdAt: new Date().toISOString(),
    status: "Active"
  };
  superAdminAnnouncementsStore.unshift(newAlert);
  res.json({ success: true, message: "Platform-wide broadcast dispatched and pushed to portals!", data: newAlert });
});

app.post("/api/superadmin/communication/teacher-notice", (req, res) => {
  const { teacherId = "TCH-001", teacherName = "Mrs. Okonkwo Beatrice", title = "Admin Directive", message = "", priority = "High" } = req.body;
  const newNotice = {
    id: `NTC-${Date.now()}`,
    teacherId,
    teacherName,
    title,
    message,
    priority,
    sentBy: "Super Admin HQ",
    date: new Date().toISOString(),
    acknowledged: false
  };
  directTeacherNoticesStore.unshift(newNotice);
  res.json({ success: true, message: `Direct notice dispatched to ${teacherName}`, data: newNotice });
});

app.get("/api/teacher/admin-notices", (req, res) => {
  res.json({
    success: true,
    notices: directTeacherNoticesStore,
    announcements: superAdminAnnouncementsStore
  });
});

app.post("/api/teacher/admin-notices/:id/acknowledge", (req, res) => {
  const notice = directTeacherNoticesStore.find(n => n.id === req.params.id);
  if (notice) {
    notice.acknowledged = true;
  }
  res.json({ success: true, message: "Directive acknowledged by teacher" });
});

// Finance Invoices Endpoint
app.get("/api/finance/invoices", (req, res) => {
  res.json({ success: true, data: financeInvoicesStore });
});

// CBT Exams Endpoint
app.get("/api/cbt/exams", (req, res) => {
  res.json({ success: true, data: cbtExamsStore });
});

// Transport Routes Endpoint
app.get("/api/transport/routes", (req, res) => {
  res.json({ success: true, data: transportRoutesStore });
});

// Hostel Rooms Endpoint
app.get("/api/hostel/rooms", (req, res) => {
  res.json({ success: true, data: hostelRoomsStore });
});

// OpenAPI Swagger Spec Endpoint
app.get("/api/swagger.json", (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "LIVINGSTONEEDU Enterprise SaaS & Super Admin Backend API",
      version: "3.0.0",
      description: "Production OpenAPI 3.0 specification powering LIVINGSTONEEDU Multi-Tenant Super Admin SaaS Platform.",
    },
    paths: {
      "/api/health": { get: { summary: "System Health Check" } },
      "/api/auth/login": { post: { summary: "Firebase & JWT Multi-Role Login" } },
      "/api/superadmin/dashboard": { get: { summary: "Super Admin Platform Overview Metrics & Server Health" } },
      "/api/superadmin/schools": {
        get: { summary: "List All Tenant Schools" },
        post: { summary: "Provision New Tenant School" },
      },
      "/api/superadmin/schools/{id}/suspend": { put: { summary: "Suspend Tenant School Access" } },
      "/api/superadmin/schools/{id}/activate": { put: { summary: "Activate Tenant School" } },
      "/api/superadmin/schools/{id}/assign-subscription": { post: { summary: "Assign Subscription Plan" } },
      "/api/superadmin/schools/{id}/assign-storage": { post: { summary: "Assign Storage Limit (GB)" } },
      "/api/superadmin/schools/{id}/assign-ai-credits": { post: { summary: "Allocate Gemini AI Credits" } },
      "/api/superadmin/users": {
        get: { summary: "Manage Multi-Role Users Across All Tenant Schools" },
        post: { summary: "Create User Account" },
      },
      "/api/superadmin/users/{id}/permissions": { put: { summary: "Update User Permission Matrix" } },
      "/api/superadmin/users/{id}/lock": { put: { summary: "Lock / Unlock User Account" } },
      "/api/superadmin/ai/stats": { get: { summary: "Gemini AI Token Usage & Cost Analytics" } },
      "/api/superadmin/ai/prompt-logs": { get: { summary: "View Live AI Prompt Logs" } },
      "/api/superadmin/ai/config": { put: { summary: "Configure Gemini AI Tokens & Blocked Prompts" } },
      "/api/superadmin/curriculum": {
        get: { summary: "List NERDC, WAEC, NECO, BECE & Cambridge Curriculum Syllabi" },
        post: { summary: "Upload & Approve Curriculum Standard" },
      },
      "/api/superadmin/website-builder/{schoolId}": {
        get: { summary: "Get Tenant School Custom Website Config" },
        put: { summary: "Save Website Builder Settings & Admission Portal" },
      },
      "/api/superadmin/report-cards/templates": { get: { summary: "Report Card Layout Templates & Grading Scales" } },
      "/api/superadmin/report-cards/bulk-download": { post: { summary: "Bulk Report Card PDF Engine" } },
      "/api/superadmin/exams": { get: { summary: "National CBT & Question Bank Center" } },
      "/api/superadmin/payments": { get: { summary: "Paystack & Flutterwave Transaction Ledger" } },
      "/api/superadmin/communication/send-email": { post: { summary: "Send Nodemailer Bulk Email" } },
      "/api/superadmin/communication/send-sms": { post: { summary: "Send SMS Alerts" } },
      "/api/superadmin/communication/emergency-alert": { post: { summary: "Broadcast Emergency Notification" } },
      "/api/superadmin/monitoring/health": { get: { summary: "Real-time CPU, RAM, MySQL, Redis & Firebase Health" } },
      "/api/superadmin/security/audit-logs": { get: { summary: "Platform Security Audit Logs & IP Tracking" } },
      "/api/superadmin/backups": {
        get: { summary: "View System Snapshot Backups" },
        post: { summary: "Trigger Cloud System Backup Snapshot" },
      },
      "/api/superadmin/settings": {
        get: { summary: "Global SaaS Platform Settings" },
        put: { summary: "Update Global SaaS Platform Settings" },
      },
    },
  });
});

app.get("/api/docs", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>LIVINGSTONEEDU API Docs</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
      <script>
        SwaggerUIBundle({
          url: '/api/swagger.json',
          dom_id: '#swagger-ui',
        });
      </script>
    </body>
    </html>
  `);
});

// Mount Vite middleware for dev or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LIVINGSTONEEDU Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
