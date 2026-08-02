// NERDC & WAEC Curriculum Database for LIVINGSTONEEDU

export interface CurriculumTopic {
  className: string;
  subject: string;
  term: string;
  week: string;
  topic: string;
  subTopic: string;
  objectives: string[];
  nerdcReference: string;
  previousKnowledge: string;
  instructionalMaterials: string[];
  keyVocabulary: string[];
  moralLesson: string;
  inclusiveStrategy: string;
}

export const CURRICULUM_DATABASE: CurriculumTopic[] = [
  // --- MATHEMATICS: SS 2 ---
  {
    className: "SS 2",
    subject: "Mathematics",
    term: "First Term",
    week: "Week 1",
    topic: "Logarithms of Numbers",
    subTopic: "Logarithms of numbers greater than 1, multiplication and division using log tables",
    objectives: [
      "Express numbers in standard form (A × 10^n)",
      "Determine characteristics and mantissa of logarithms",
      "Perform multiplication and division of numbers using standard logarithm tables"
    ],
    nerdcReference: "NERDC Senior Secondary Math Curriculum SS2, Sec 1.1",
    previousKnowledge: "Students are familiar with powers of ten and standard forms from SS 1.",
    instructionalMaterials: ["Four-figure logarithm tables", "Scientific calculators", "Chalkboard/Whiteboard charts"],
    keyVocabulary: ["Logarithm", "Characteristic", "Mantissa", "Standard Form", "Antilogarithm"],
    moralLesson: "Accuracy and meticulous detail in calculations reflect honesty and precision in life.",
    inclusiveStrategy: "Provide large-print four-figure tables and step-by-step visual templates for visually impaired learners."
  },
  {
    className: "SS 2",
    subject: "Mathematics",
    term: "First Term",
    week: "Week 2",
    topic: "Logarithms of Numbers Less Than 1",
    subTopic: "Negative characteristics (Bar notation), roots and powers of numbers less than 1",
    objectives: [
      "Read logarithms of decimal numbers less than 1",
      "Apply negative characteristics (bar notation e.g., bar 1, bar 2)",
      "Evaluate powers and roots using log tables"
    ],
    nerdcReference: "NERDC Senior Secondary Math Curriculum SS2, Sec 1.2",
    previousKnowledge: "Students understand standard log operations from Week 1.",
    instructionalMaterials: ["Logarithm worksheets", "Interactive smartboard diagrams"],
    keyVocabulary: ["Bar Notation", "Decimal Fraction", "Reciprocal", "Index Law"],
    moralLesson: "Small fractions of effort, when multiplied consistently, yield significant positive results.",
    inclusiveStrategy: "Pair students for peer-assisted calculation checks."
  },
  {
    className: "SS 2",
    subject: "Mathematics",
    term: "First Term",
    week: "Week 3",
    topic: "Sequence and Series (Arithmetic Progression - AP)",
    subTopic: "Definition of AP, first term (a), common difference (d), nth term formula",
    objectives: [
      "Identify an Arithmetic Progression",
      "Calculate the nth term of an AP using Un = a + (n-1)d",
      "Solve practical word problems involving AP"
    ],
    nerdcReference: "NERDC Senior Secondary Math Curriculum SS2, Sec 2.1",
    previousKnowledge: "Basic algebraic substitution and linear equations.",
    instructionalMaterials: ["Number pattern charts", "Counters/blocks for sequence demonstration"],
    keyVocabulary: ["Sequence", "Arithmetic Progression", "Common Difference", "Nth Term"],
    moralLesson: "Consistency in growth step-by-step builds solid character over time.",
    inclusiveStrategy: "Use tactile blocks for hands-on sequence building."
  },
  {
    className: "SS 2",
    subject: "Mathematics",
    term: "First Term",
    week: "Week 4",
    topic: "Quadratic Equations & Roots Analysis",
    subTopic: "Factorization, Completing the Square, & Graphical Solution",
    objectives: [
      "Identify standard quadratic form ax² + bx + c = 0",
      "Solve quadratic equations using completing the square method",
      "Construct tables of values and plot quadratic curves to determine roots"
    ],
    nerdcReference: "NERDC Senior Secondary Math Curriculum SS2, Sec 3.1",
    previousKnowledge: "Factorization of simple quadratic expressions.",
    instructionalMaterials: ["Graph books", "Grid board", "Rulers", "Quadratic formula charts"],
    keyVocabulary: ["Quadratic", "Parabola", "Roots", "Discriminant", "Completing the Square"],
    moralLesson: "Every complex problem has multiple analytical pathways to a solution.",
    inclusiveStrategy: "Use tactile graph paper for kinesthetic learners."
  },
  {
    className: "SS 2",
    subject: "Mathematics",
    term: "First Term",
    week: "Week 5",
    topic: "Simultaneous Linear & Quadratic Equations",
    subTopic: "Analytical and graphical methods for solving simultaneous linear and quadratic equations",
    objectives: [
      "Solve simultaneous equations with one linear and one quadratic equation",
      "Apply elimination and substitution methods correctly",
      "Find intersection points on a coordinate graph"
    ],
    nerdcReference: "NERDC Senior Secondary Math Curriculum SS2, Sec 3.3",
    previousKnowledge: "Solving quadratic equations and linear simultaneous equations.",
    instructionalMaterials: ["Graph sheets", "Desmos / Geogebra digital graph tools"],
    keyVocabulary: ["Simultaneous", "Intersection", "Substitution", "Coordinates"],
    moralLesson: "Collaboration between different ideas leads to common points of agreement.",
    inclusiveStrategy: "Step-by-step color-coded algebraic substitution guides."
  },
  {
    className: "SS 2",
    subject: "Mathematics",
    term: "First Term",
    week: "Week 6 (Mid-Term)",
    topic: "Mid-Term Assessment & Revision",
    subTopic: "Review of Weeks 1-5 topics and Mid-Term examination",
    objectives: [
      "Evaluate student mastery of Logarithms, AP, and Quadratic equations",
      "Identify learning gaps and provide remedial guidance"
    ],
    nerdcReference: "NERDC Senior Secondary Math Curriculum SS2, Sec 3.4",
    previousKnowledge: "Topics covered in Weeks 1 to 5.",
    instructionalMaterials: ["CBT portal", "Printed test papers"],
    keyVocabulary: ["Assessment", "Evaluation", "Revision"],
    moralLesson: "Self-reflection and periodic evaluation are vital for continuous growth.",
    inclusiveStrategy: "Provide extra time for students requiring accommodations."
  },
  {
    className: "SS 2",
    subject: "Mathematics",
    term: "First Term",
    week: "Week 7",
    topic: "Geometric Progression (GP)",
    subTopic: "Definition of GP, first term (a), common ratio (r), nth term and sum of GP",
    objectives: [
      "Identify Geometric Progressions",
      "Calculate the nth term using Un = a·r^(n-1)",
      "Find the sum of the first n terms of a GP"
    ],
    nerdcReference: "NERDC Senior Secondary Math Curriculum SS2, Sec 2.2",
    previousKnowledge: "Knowledge of Arithmetic Progression from Week 3.",
    instructionalMaterials: ["Exponential growth charts", "Calculators"],
    keyVocabulary: ["Geometric Progression", "Common Ratio", "Exponential Growth", "Sum to Infinity"],
    moralLesson: "Compounding positive habits leads to exponential personal progress.",
    inclusiveStrategy: "Visual tree diagrams illustrating exponential growth."
  },
  {
    className: "SS 2",
    subject: "Mathematics",
    term: "First Term",
    week: "Week 8",
    topic: "Trigonomety: Sine and Cosine Rules",
    subTopic: "Derivation and application of Sine Rule (a/sinA = b/sinB = c/sinC) and Cosine Rule",
    objectives: [
      "State and derive the Sine and Cosine rules",
      "Apply Sine rule to non-right-angled triangles",
      "Apply Cosine rule to calculate unknown sides and angles"
    ],
    nerdcReference: "NERDC Senior Secondary Math Curriculum SS2, Sec 4.1",
    previousKnowledge: "Pythagoras theorem and trigonometric ratios in right-angled triangles.",
    instructionalMaterials: ["Protractors", "3D triangle cutouts", "Calculators"],
    keyVocabulary: ["Sine Rule", "Cosine Rule", "Non-right Triangle", "Subtended Angle"],
    moralLesson: "Understanding different perspectives allows us to solve complex non-standard challenges.",
    inclusiveStrategy: "Use 3D physical models of triangles to assist spatial reasoning."
  },
  {
    className: "SS 2",
    subject: "Mathematics",
    term: "First Term",
    week: "Week 9",
    topic: "Angles of Elevation and Depression",
    subTopic: "Practical applications in surveying, heights, and distances",
    objectives: [
      "Distinguish between angle of elevation and angle of depression",
      "Draw accurate scale diagrams representing real-life scenario word problems",
      "Calculate heights of objects and distances between points"
    ],
    nerdcReference: "NERDC Senior Secondary Math Curriculum SS2, Sec 4.2",
    previousKnowledge: "Trigonometric ratios (SOH CAH TOA).",
    instructionalMaterials: ["Clinometer (homemade or school-made)", "Measuring tape", "Rulers"],
    keyVocabulary: ["Elevation", "Depression", "Horizontal Line of Sight", "Clinometer"],
    moralLesson: "Maintaining an elevated moral outlook helps navigate life's temporary depressions.",
    inclusiveStrategy: "Outdoor practical demonstration using clinometers."
  },

  // --- PHYSICS: SS 2 ---
  {
    className: "SS 2",
    subject: "Physics",
    term: "First Term",
    week: "Week 4",
    topic: "Wave Motion & Sound Wave Properties",
    subTopic: "Production, propagation, speed of sound, echo, and reflection of waves",
    objectives: [
      "Define wave motion and classify mechanical vs electromagnetic waves",
      "State the wave equation V = fλ and solve numerical problems",
      "Explain the phenomenon of echo and its applications in SONAR and acoustics"
    ],
    nerdcReference: "NERDC Senior Secondary Physics Curriculum SS2, Sec 2.1",
    previousKnowledge: "Simple harmonic motion and basic kinetic theory.",
    instructionalMaterials: ["Ripple tank", "Tuning forks", "Slinky spring", "Oscilloscope app"],
    keyVocabulary: ["Transverse Wave", "Longitudinal Wave", "Frequency", "Wavelength", "Echo", "SONAR"],
    moralLesson: "Our words and actions create ripples that reverberate in our community.",
    inclusiveStrategy: "Tactile vibration demonstration with tuning forks in water for hearing-impaired students."
  },

  // --- ENGLISH LANGUAGE: SS 2 ---
  {
    className: "SS 2",
    subject: "English Language",
    term: "First Term",
    week: "Week 4",
    topic: "Argumentative Essay Writing & Grammatical Concord",
    subTopic: "Structuring persuasive arguments, thesis statements, and subject-verb agreement rules",
    objectives: [
      "Outline a standard 5-paragraph argumentative essay",
      "Formulate logical points supporting or opposing a given motion",
      "Apply strict rules of grammatical concord in complex sentences"
    ],
    nerdcReference: "NERDC Senior Secondary English Syllabus SS2, Sec 1.4",
    previousKnowledge: "Expository essay writing and simple concord rules.",
    instructionalMaterials: ["Sample WAEC high-scoring essays", "Concord rule flashcards"],
    keyVocabulary: ["Thesis Statement", "Refutation", "Concord", "Plurality", "Proponent", "Opponent"],
    moralLesson: "Respectful debate fosters intellectual maturity and harmony.",
    inclusiveStrategy: "Sentence frames and guided graphic organizers for essay structuring."
  },

  // --- CHEMISTRY: SS 2 ---
  {
    className: "SS 2",
    subject: "Chemistry",
    term: "First Term",
    week: "Week 4",
    topic: "Periodic Table & Periodic Trends",
    subTopic: "Groups, periods, electronic configuration, atomic radius, ionization energy, electronegativity",
    objectives: [
      "State the Periodic Law and arrange elements by atomic number",
      "Identify groups (alkali, halogens, noble gases) and period trends",
      "Explain variations in atomic radius, ionization energy, and electronegativity across periods"
    ],
    nerdcReference: "NERDC Senior Secondary Chemistry Syllabus SS2, Sec 2.3",
    previousKnowledge: "Atomic structure, subatomic particles (protons, neutrons, electrons).",
    instructionalMaterials: ["Large periodic table wall chart", "3D atom building kits"],
    keyVocabulary: ["Periodic Table", "Electronegativity", "Ionization Energy", "Atomic Radius", "Valence"],
    moralLesson: "Order and periodicity in nature showcase the divine harmony of creation.",
    inclusiveStrategy: "Color-coded tactile periodic tables."
  },

  // --- BIOLOGY: SS 2 ---
  {
    className: "SS 2",
    subject: "Biology",
    term: "First Term",
    week: "Week 4",
    topic: "Digestive System & Enzyme Action",
    subTopic: "Alimentary canal structure, mechanical digestion, chemical breakdown by enzymes",
    objectives: [
      "Label organs of the human alimentary canal",
      "Explain the lock-and-key hypothesis of enzymatic activity",
      "Investigate the effect of pH and temperature on salivary amylase activity"
    ],
    nerdcReference: "NERDC Senior Secondary Biology Syllabus SS2, Sec 3.1",
    previousKnowledge: "Classes of food and basic nutrition.",
    instructionalMaterials: ["Human torso anatomical model", "Test tubes, starch, iodine solution, amylase"],
    keyVocabulary: ["Alimentary Canal", "Enzyme", "Substrate", "Peristalsis", "Salivary Amylase"],
    moralLesson: "Proper nutrition and self-care sustain bodily health and mental sharpness.",
    inclusiveStrategy: "Hands-on digestion experiment observation."
  },

  // --- COMPUTER STUDIES / ICT: SS 2 ---
  {
    className: "SS 2",
    subject: "Computer Studies / ICT",
    term: "First Term",
    week: "Week 4",
    topic: "Database Management Systems (DBMS) & SQL",
    subTopic: "Introduction to relational databases, primary keys, tables, and basic SQL SELECT queries",
    objectives: [
      "Define DBMS, Database, Table, Record, and Field",
      "Distinguish primary key and foreign key relationships",
      "Write basic SQL queries to retrieve filtered records from a database"
    ],
    nerdcReference: "NERDC Senior Secondary Computer Studies Syllabus SS2, Sec 4.2",
    previousKnowledge: "Spreadsheet fundamentals and file management.",
    instructionalMaterials: ["Computer lab PCs with SQLite / MS Access", "Projector display"],
    keyVocabulary: ["Database", "Relational Model", "Primary Key", "SQL", "Table", "Query"],
    moralLesson: "Organized data management ensures truthfulness and prevents loss of critical information.",
    inclusiveStrategy: "Provide step-by-step digital cheat sheets for keyboard shortcuts and query syntax."
  },

  // --- BASIC SCIENCE: JSS 2 ---
  {
    className: "JSS 2",
    subject: "Basic Science",
    term: "First Term",
    week: "Week 4",
    topic: "Kinetic Theory of Matter & Thermal Energy",
    subTopic: "States of matter, arrangement of particles, expansion and contraction in solids, liquids, gases",
    objectives: [
      "State the basic postulates of the Kinetic Theory of Matter",
      "Demonstrate particle movement in solids, liquids, and gases",
      "Explain thermal expansion and its applications in bimetallic strips and thermometers"
    ],
    nerdcReference: "NERDC Junior Secondary Basic Science Syllabus JSS2, Sec 1.3",
    previousKnowledge: "States of matter from JSS 1.",
    instructionalMaterials: ["Ball and ring apparatus", "Bimetallic strip", "Burner"],
    keyVocabulary: ["Kinetic Theory", "Molecules", "Thermal Expansion", "Bimetallic Strip"],
    moralLesson: "Energy, when disciplined and focused, leads to constructive transformation.",
    inclusiveStrategy: "Role-play activity where students act as tightly packed solid particles vs moving gas particles."
  },

  // --- AGRICULTURAL SCIENCE: SS 1 ---
  {
    className: "SS 1",
    subject: "Agricultural Science",
    term: "First Term",
    week: "Week 4",
    topic: "Soil Formation & Soil Composition",
    subTopic: "Weathering of rocks (physical, chemical, biological), soil profile, components of fertile soil",
    objectives: [
      "Define soil and explain physical, chemical, and biological weathering process",
      "Draw and label a typical soil profile horizon",
      "Identify components of soil (mineral matter, organic matter, soil air, soil water, microorganisms)"
    ],
    nerdcReference: "NERDC Senior Secondary Agric Syllabus SS1, Sec 2.1",
    previousKnowledge: "Basic geography of rocks and environment.",
    instructionalMaterials: ["Soil samples (sandy, clay, loamy)", "Glass jars for soil settling experiment"],
    keyVocabulary: ["Weathering", "Horizon", "Humus", "Soil Profile", "Leaching"],
    moralLesson: "Nurturing the soil ensures food security and environmental sustainability for future generations.",
    inclusiveStrategy: "Tactile feel test of wet sand, clay, and loam soil samples."
  }
];

// Helper to look up or dynamically derive standard curriculum topic
export function lookupCurriculumTopic(
  className: string,
  subject: string,
  term: string,
  week: string
): CurriculumTopic {
  // 1. Check exact match
  const exact = CURRICULUM_DATABASE.find(
    (item) =>
      item.className.toLowerCase().trim() === className.toLowerCase().trim() &&
      item.subject.toLowerCase().trim() === subject.toLowerCase().trim() &&
      item.term.toLowerCase().trim() === term.toLowerCase().trim() &&
      item.week.toLowerCase().trim() === week.toLowerCase().trim()
  );

  if (exact) {
    return exact;
  }

  // 2. Check subject + class match to inherit topic structure for the week
  const subjectMatch = CURRICULUM_DATABASE.find(
    (item) =>
      item.subject.toLowerCase().trim() === subject.toLowerCase().trim() &&
      item.week.toLowerCase().trim() === week.toLowerCase().trim()
  );

  if (subjectMatch) {
    return {
      ...subjectMatch,
      className,
      term,
    };
  }

  // 3. Fallback NERDC Curriculum Derivation Generator based on NERDC standards
  const weekNumMatch = week.match(/\d+/);
  const weekNum = weekNumMatch ? parseInt(weekNumMatch[0], 10) : 4;

  const generatedTopics: Record<string, { topic: string; subTopic: string; objectives: string[] }> = {
    Mathematics: {
      topic: weekNum <= 3 ? "Number Bases & Indices Systems" : weekNum <= 6 ? "Algebraic Processes & Equations" : weekNum <= 9 ? "Trigonometric Principles & Geometry" : "Statistics, Probability, & Data Analysis",
      subTopic: `NERDC ${className} ${subject} Unit ${weekNum}: Detailed study of foundational principles, worked problems, and WAEC practice exercises.`,
      objectives: [
        `Master foundational principles of ${subject} for ${className}`,
        `Solve 5 standard examination level practice questions`,
        `Apply mathematical reasoning to real-world problem scenarios`
      ]
    },
    Physics: {
      topic: weekNum <= 3 ? "Units, Measurements, & Kinematics" : weekNum <= 6 ? "Force, Work, Energy, & Power" : weekNum <= 9 ? "Waves, Optics, & Acoustics" : "Fields, Atomic & Modern Physics",
      subTopic: `NERDC ${className} Physics Syllabus Module ${weekNum}`,
      objectives: [
        "Explain fundamental physical principles and law formulations",
        "Derive standard formulas and solve quantitative problems",
        "Conduct laboratory demonstrations and experimental error analysis"
      ]
    },
    Chemistry: {
      topic: weekNum <= 3 ? "Atomic Structure & Chemical Bonding" : weekNum <= 6 ? "Stoichiometry & Chemical Reactions" : weekNum <= 9 ? "Periodic Table & Inorganic Chemistry" : "Organic Chemistry & Environmental Pollution",
      subTopic: `NERDC ${className} Chemistry Experimental & Theoretical Unit ${weekNum}`,
      objectives: [
        "Identify atomic properties and reaction mechanisms",
        "Perform volumetric analysis and qualitative chemical tests",
        "State industrial applications and safety precautions"
      ]
    },
    Biology: {
      topic: weekNum <= 3 ? "Cell Structure & Organization of Life" : weekNum <= 6 ? "Plant & Animal Nutrition Systems" : weekNum <= 9 ? "Transport, Respiration, & Excretion" : "Ecology, Heredity, & Genetics",
      subTopic: `NERDC ${className} Biology Practical & Theoretical Syllabus ${weekNum}`,
      objectives: [
        "Draw and label biological specimens with scientific accuracy",
        "Explain physiological processes in living organisms",
        "Analyze ecological relationships and human environmental impact"
      ]
    },
    "English Language": {
      topic: weekNum <= 3 ? "Comprehension & Summary Skills" : weekNum <= 6 ? "Essay Writing: Narrative, Expository, & Argumentative" : weekNum <= 9 ? "Grammatical Concord & Lexis and Structure" : "Oracy, Phonetics, & Spoken English",
      subTopic: `NERDC ${className} English Language WAEC/NECO Standard Module ${weekNum}`,
      objectives: [
        "Extract main ideas and implicit meanings from comprehension passages",
        "Write well-structured essays with appropriate register and mechanics",
        "Identify correct phonetic transcriptions and stress patterns"
      ]
    }
  };

  const defaultTopicInfo = generatedTopics[subject] || {
    topic: `${subject} Core Curriculum Unit ${weekNum}`,
    subTopic: `NERDC & WAEC Standard Syllabus for ${className} ${subject} - ${term} ${week}`,
    objectives: [
      `Understand key concepts and definitions of ${subject} Topic ${weekNum}`,
      `Analyze practical examples and solve curriculum exercises`,
      `Demonstrate mastery through evaluation questions and assignments`
    ]
  };

  return {
    className,
    subject,
    term,
    week,
    topic: defaultTopicInfo.topic,
    subTopic: defaultTopicInfo.subTopic,
    objectives: defaultTopicInfo.objectives,
    nerdcReference: `NERDC Standard Syllabus (${className} - ${subject})`,
    previousKnowledge: `Basic foundational knowledge from previous lessons in ${subject}.`,
    instructionalMaterials: ["Standard NERDC Textbook", "Whiteboard", "Chart Models", "Interactive AI Companion"],
    keyVocabulary: ["Concept", "Application", "Evaluation", "Formula", "Standard"],
    moralLesson: "Diligence, consistency, and critical thinking empower students for academic excellence.",
    inclusiveStrategy: "Differentiated learning tasks catered to auditory, visual, and kinesthetic learners."
  };
}
