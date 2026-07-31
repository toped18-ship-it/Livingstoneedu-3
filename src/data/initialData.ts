import { StudentRecord, TeacherRecord, LibraryBook, FinanceInvoice, Announcement } from "../types";

export const initialStudents: StudentRecord[] = [
  { id: "STD-2026-001", name: "Adeyemi Chinedu", admissionNo: "LIV/2026/089", class: "SS2 Gold", gender: "Male", parentName: "Dr. Adeyemi Olumide", parentPhone: "+234 803 456 7890", status: "Active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  { id: "STD-2026-002", name: "Fatima Abubakar", admissionNo: "LIV/2026/112", class: "JSS3 Diamond", gender: "Female", parentName: "Alhaji Bello Abubakar", parentPhone: "+234 802 345 6789", status: "Active", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" },
  { id: "STD-2026-003", name: "Eze Chukwuemeka", admissionNo: "LIV/2026/045", class: "SS1 Silver", gender: "Male", parentName: "Chief Eze Nnamdi", parentPhone: "+234 805 123 4567", status: "Active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  { id: "STD-2026-004", name: "Zainab Danjuma", admissionNo: "LIV/2026/167", class: "SS3 Emerald", gender: "Female", parentName: "Engr. Danjuma Usman", parentPhone: "+234 809 876 5432", status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
  { id: "STD-2026-005", name: "Okafor Ifeoma", admissionNo: "LIV/2026/201", class: "JSS1 Ruby", gender: "Female", parentName: "Mrs. Okafor Grace", parentPhone: "+234 807 999 1122", status: "Active", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" },
  { id: "STD-2026-006", name: "Kalu Samuel", admissionNo: "LIV/2026/301", class: "Primary 1 Gold", gender: "Male", parentName: "Mr. Kalu Obinna", parentPhone: "+234 802 111 4455", status: "Active", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80" },
  { id: "STD-2026-007", name: "Amina Yusuf", admissionNo: "LIV/2026/302", class: "Primary 2 Silver", gender: "Female", parentName: "Hajiya Yusuf Mariam", parentPhone: "+234 803 222 5566", status: "Active", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80" },
  { id: "STD-2026-008", name: "Babalola Tobi", admissionNo: "LIV/2026/303", class: "Primary 3 Bronze", gender: "Male", parentName: "Pastor Babalola Segun", parentPhone: "+234 805 333 6677", status: "Active", avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80" },
  { id: "STD-2026-009", name: "David Chiamaka", admissionNo: "LIV/2026/304", class: "Primary 4 Gold", gender: "Female", parentName: "Mrs. David Blessing", parentPhone: "+234 806 444 7788", status: "Active", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" },
  { id: "STD-2026-010", name: "Mohammed Tarik", admissionNo: "LIV/2026/305", class: "Primary 5 Silver", gender: "Male", parentName: "Mallam Mohammed Kabir", parentPhone: "+234 807 555 8899", status: "Active", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" },
  { id: "STD-2026-011", name: "Okoro Janet", admissionNo: "LIV/2026/306", class: "Primary 6 Diamond", gender: "Female", parentName: "Barrister Okoro Paul", parentPhone: "+234 808 666 9900", status: "Active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  { id: "STD-2026-012", name: "Sani Ibrahim", admissionNo: "LIV/2026/307", class: "JSS2 Sapphire", gender: "Male", parentName: "Dr. Sani Farouk", parentPhone: "+234 809 777 0011", status: "Active", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
];

export const initialTeachers: TeacherRecord[] = [
  { id: "TCH-001", name: "Mrs. Okonkwo Chioma", staffId: "STF-LIV-012", subjectSpecialization: "Mathematics & Further Math", assignedClass: "SS2 Gold", email: "chioma.okonkwo@livingstone.edu", phone: "+234 801 111 2233", status: "Active", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
  { id: "TCH-002", name: "Mr. David Alabi", staffId: "STF-LIV-034", subjectSpecialization: "Physics & Basic Science", assignedClass: "SS3 Emerald", email: "david.alabi@livingstone.edu", phone: "+234 802 222 3344", status: "Active", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
  { id: "TCH-003", name: "Dr. Mrs. Blessing Egwu", staffId: "STF-LIV-056", subjectSpecialization: "English Language & Literature", assignedClass: "JSS3 Diamond", email: "blessing.egwu@livingstone.edu", phone: "+234 803 333 4455", status: "Active", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" },
  { id: "TCH-004", name: "Mr. Ibrahim Hassan", staffId: "STF-LIV-078", subjectSpecialization: "Chemistry & Agricultural Science", assignedClass: "SS1 Silver", email: "ibrahim.hassan@livingstone.edu", phone: "+234 804 444 5566", status: "Active", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" },
  { id: "TCH-005", name: "Mrs. Adebayo Funke", staffId: "STF-LIV-090", subjectSpecialization: "Primary Education & Phonics", assignedClass: "Primary 1 Gold", email: "funke.adebayo@livingstone.edu", phone: "+234 805 555 6677", status: "Active", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" },
  { id: "TCH-006", name: "Mr. Nnamdi Joseph", staffId: "STF-LIV-102", subjectSpecialization: "Primary Elementary Science & Art", assignedClass: "Primary 4 Gold", email: "joseph.nnamdi@livingstone.edu", phone: "+234 806 666 7788", status: "Active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
];

export const initialBooks: LibraryBook[] = [
  { id: "b-1", title: "New General Mathematics for Senior Secondary Schools 3", author: "M.F. Macrae et al.", category: "Mathematics", isbn: "978-978-023-112-4", status: "Available", copies: 45, shelf: "M3-A" },
  { id: "b-2", title: "Senior Secondary Physics", author: "P.N. Okeke", category: "Physics", isbn: "978-978-142-005-1", status: "Available", copies: 30, shelf: "P2-B" },
  { id: "b-3", title: "Invisible Teacher (English Literature)", author: "Gabriel Okara", category: "Literature", isbn: "978-978-800-441-2", status: "Available", copies: 25, shelf: "L1-C" },
  { id: "b-4", title: "Modern Chemistry for Schools", author: "Osei Yaw Ababio", category: "Chemistry", isbn: "978-978-009-881-9", status: "Available", copies: 18, shelf: "C4-A" },
  { id: "b-5", title: "Essential Biology for Senior Secondary", author: "M.C. Michael", category: "Biology", isbn: "978-978-056-221-9", status: "Available", copies: 35, shelf: "B1-D" },
];

export const initialInvoices: FinanceInvoice[] = [
  { id: "INV-2026-901", studentId: "STD-2026-001", studentName: "Adeyemi Chinedu", class: "SS2 Gold", term: "First Term 2026/2027", totalAmount: 185000, paidAmount: 120000, status: "Partial", dueDate: "2026-08-15" },
  { id: "INV-2026-902", studentId: "STD-2026-002", studentName: "Fatima Abubakar", class: "JSS3 Diamond", term: "First Term 2026/2027", totalAmount: 165000, paidAmount: 165000, status: "Paid", dueDate: "2026-08-01" },
  { id: "INV-2026-903", studentId: "STD-2026-003", studentName: "Eze Chukwuemeka", class: "SS1 Silver", term: "First Term 2026/2027", totalAmount: 185000, paidAmount: 0, status: "Unpaid", dueDate: "2026-08-20" },
  { id: "INV-2026-904", studentId: "STD-2026-004", studentName: "Zainab Danjuma", class: "SS3 Emerald", term: "First Term 2026/2027", totalAmount: 210000, paidAmount: 210000, status: "Paid", dueDate: "2026-08-01" },
];

export const initialAnnouncements: Announcement[] = [
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
  {
    id: "ann-3",
    title: "New AI Lesson Note Generator & Digital Portal Upgrade",
    category: "Technology",
    sender: "IT Administrator",
    date: "2026-07-28",
    content: "We have officially integrated Google Gemini AI into the teacher dashboard for auto-generating NERDC curriculum-aligned lesson plans and question banks.",
    targetRoles: ["Teacher", "School Administrator", "Super Admin"],
  },
];
