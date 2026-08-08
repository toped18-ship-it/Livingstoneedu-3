export type UserRole =
  | "Super Admin"
  | "School Owner"
  | "Proprietor"
  | "Proprietress"
  | "Head Teacher"
  | "Assistant Head Teacher"
  | "Principal"
  | "Vice Principal"
  | "School Administrator"
  | "ICT Administrator"
  | "Registrar"
  | "Admission Officer"
  | "Bursar"
  | "Accountant"
  | "Teacher"
  | "Class Teacher"
  | "Subject Teacher"
  | "Student"
  | "Parent"
  | "Account Officer"
  | "Exam Officer"
  | "Librarian"
  | "Receptionist";

export type ActiveTab =
  | "auth"
  | "dashboard"
  | "superadmin"
  | "school-portal"
  | "teacher-portal"
  | "student-parent-portal"
  | "academic-curriculum"
  | "academic-lesson-notes"
  | "academic-ai-lesson-notes"
  | "academic-assignments"
  | "academic-scheme-of-work"
  | "academic-exams"
  | "academic-ai-exam-generator"
  | "academic-question-bank"
  | "academic-report-cards"
  | "academic-attendance"
  | "attendance"
  | "students"
  | "teachers"
  | "finance"
  | "library"
  | "communication"
  | "parents"
  | "transport"
  | "hostel"
  | "settings"
  | "support"
  | "website-builder"
  | "subscription"
  | "id-cards"
  | "entrance-exams"
  | "timetable"
  | "payroll"
  | "chat"
  | "gamified-learning"
  | "job-marketplace";

export const ALL_CLASSES = [
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SS 1",
  "SS 2",
  "SS 3",
] as const;

export const PRIMARY_SUBJECTS = [
  "Mathematics",
  "English Language",
  "Basic Science & Technology",
  "Social Studies",
  "Civic Education",
  "Agricultural Science",
  "Computer Studies / ICT",
  "Cultural & Creative Arts (CCA)",
  "Physical & Health Education (PHE)",
  "Home Economics",
  "Christian Religious Studies (CRS)",
  "Islamic Religious Studies (IRS)",
  "Verbal Reasoning",
  "Quantitative Reasoning",
  "Yoruba Language",
  "Igbo Language",
  "Hausa Language",
] as const;

export const JSS_SUBJECTS = [
  "Mathematics",
  "English Language",
  "Basic Science",
  "Basic Technology",
  "Social Studies",
  "Civic Education",
  "Agricultural Science",
  "Business Studies",
  "Computer Studies / ICT",
  "Home Economics",
  "Physical & Health Education (PHE)",
  "Cultural & Creative Arts (CCA)",
  "Christian Religious Studies (CRS)",
  "Islamic Religious Studies (IRS)",
  "French Language",
  "Yoruba Language",
  "Igbo Language",
  "Hausa Language",
] as const;

export const SS_SUBJECTS = [
  "Mathematics",
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Further Mathematics",
  "Agricultural Science",
  "Computer Studies / ICT",
  "Economics",
  "Financial Accounting",
  "Commerce",
  "Government",
  "Literature in English",
  "Geography",
  "Civic Education",
  "Christian Religious Studies (CRS)",
  "Islamic Religious Studies (IRS)",
  "History",
  "Technical Drawing",
  "Food & Nutrition",
  "French Language",
  "Yoruba Language",
  "Igbo Language",
  "Hausa Language",
] as const;

export const ALL_SUBJECTS = Array.from(
  new Set([...PRIMARY_SUBJECTS, ...JSS_SUBJECTS, ...SS_SUBJECTS])
);

export function getSubjectsForClass(className: string): string[] {
  const norm = className.toUpperCase().trim();
  if (norm.includes("PRIMARY") || norm.startsWith("PRI")) {
    return [...PRIMARY_SUBJECTS];
  }
  if (norm.includes("JSS") || norm.includes("JUNIOR")) {
    return [...JSS_SUBJECTS];
  }
  if (norm.includes("SS") || norm.includes("SENIOR")) {
    return [...SS_SUBJECTS];
  }
  return [...ALL_SUBJECTS];
}

export const ALL_WEEKS = [
  "Week 1",
  "Week 2",
  "Week 3",
  "Week 4",
  "Week 5",
  "Week 6 (Mid-Term)",
  "Week 7",
  "Week 8",
  "Week 9",
  "Week 10",
  "Week 11 (Revision)",
  "Week 12 (Examination)",
] as const;

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  studentLimit: number;
  aiCreditsMonthly: number;
  badge?: string;
  isPopular?: boolean;
  features: string[];
}

export interface SubscriptionStatus {
  currentPlanId: string;
  planName: string;
  billingCycle: "Monthly" | "Annual";
  status: "Active" | "Trial" | "Expired" | "Pending Payment";
  activeStudentsUsed: number;
  maxStudentsLimit: number;
  aiCreditsUsed: number;
  maxAiCreditsLimit: number;
  renewalDate: string;
  autoRenew: boolean;
  amountPaid: number;
  lastPaymentDate: string;
}

export interface WebsiteSectionItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  statValue?: string;
  price?: string;
  role?: string;
  department?: string;
  date?: string;
}

export interface WebsiteSection {
  id: string;
  type:
    | "hero"
    | "welcome"
    | "features"
    | "news"
    | "gallery"
    | "stats"
    | "testimonials"
    | "contact"
    | "custom_text"
    | "teachers"
    | "courses"
    | "pricing"
    | "faq"
    | "timeline"
    | "partners"
    | "map"
    | "form"
    | "newsletter"
    | "whatsapp";
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  items?: WebsiteSectionItem[];
}

export interface WebsitePage {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  isSystemDefault?: boolean;
  metaDescription: string;
  keywords?: string[];
  sections: WebsiteSection[];
}

export interface WebsiteThemeConfig {
  schoolName: string;
  tagline: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor?: string;
  fontFamily: string;
  headerStyle: "standard" | "centered" | "topbar";
  showAnnouncementBanner: boolean;
  announcementText: string;
  customDomain: string;
  subdomain?: string;
  isLive: boolean;
  maintenanceMode?: boolean;
  lastPublishedAt: string;
  themePreset?: string;
  whatsappNumber?: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  admissionNo: string;
  class: string;
  gender: "Male" | "Female";
  parentName: string;
  parentPhone: string;
  status: "Active" | "Graduated" | "Suspended";
  avatar: string;
}

export interface TeacherRecord {
  id: string;
  name: string;
  staffId: string;
  subjectSpecialization: string;
  assignedClass: string;
  email: string;
  phone: string;
  status: "Active" | "On Leave";
  avatar: string;
}

export interface LessonNote {
  topic: string;
  subject: string;
  className: string;
  week: string;
  curriculumRef: string;
  durationMinutes: number;
  behavioralObjectives: string[];
  instructionalMaterials: string[];
  previousKnowledge: string;
  introduction: string;
  coreContent: {
    subheading: string;
    explanation: string;
    keyTerms: string[];
  }[];
  teacherDemonstration: string;
  studentActivities: string[];
  evaluationQuestions: string[];
  summaryWrapUp: string;
  assignment: string;
}

export interface ObjectiveQuestion {
  id: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: string;
  correctOptionIndex: number;
  explanation?: string;
  bloomTaxonomy?: string;
}

export interface TheoryQuestion {
  id: string;
  questionNumber: number;
  question: string;
  marks: number;
  markingScheme: string;
  bloomTaxonomy?: string;
}

export interface ExamPaper {
  title: string;
  subject: string;
  className: string;
  term: string;
  timeAllowed: string;
  instructions: string;
  objectives: ObjectiveQuestion[];
  theoryQuestions: TheoryQuestion[];
}

export interface ReportCardSubject {
  name: string;
  ca1: number;
  ca2: number;
  exam: number;
  total: number;
  grade: string;
  remark: string;
}

export interface ReportCard {
  reportId: string;
  studentName: string;
  studentId: string;
  class: string;
  term: string;
  subjects: ReportCardSubject[];
  overallTotal: number;
  average: number;
  positionInClass: string;
  attendance: string;
  psychomotor: Record<string, number>;
  affectiveDomain: Record<string, number>;
  teacherComment: string;
  principalComment: string;
  promotionStatus: string;
  qrVerificationToken: string;
}

export interface FinanceInvoice {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  term: string;
  totalAmount: number;
  paidAmount: number;
  status: "Paid" | "Partial" | "Unpaid";
  dueDate: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  status: "Available" | "Borrowed";
  copies: number;
  shelf: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  sender: string;
  date: string;
  content: string;
  targetRoles: string[];
}
