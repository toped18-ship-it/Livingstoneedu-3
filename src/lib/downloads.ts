export function downloadTextFile(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function buildReportCardHtml(opts: {
  schoolName: string;
  studentName: string;
  className: string;
  term: string;
  positionInClass?: string | number;
  overallTotal?: string | number;
  maximumPossible?: string | number;
  average?: string | number;
  subjects?: Array<{
    subject: string;
    ca1?: string | number;
    ca2?: string | number;
    exam?: string | number;
    total?: string | number;
    grade?: string;
    positionInSubject?: string | number;
    remark?: string;
  }>;
}) {
  const {
    schoolName,
    studentName,
    className,
    term,
    positionInClass,
    overallTotal,
    maximumPossible,
    average,
    subjects = [],
  } = opts;

  const rows = subjects
    .map(
      (s) => `<tr>
        <td>${s.subject}</td>
        <td>${s.ca1 ?? "-"}</td>
        <td>${s.ca2 ?? "-"}</td>
        <td>${s.exam ?? "-"}</td>
        <td>${s.total ?? "-"}</td>
        <td>${s.grade ?? "-"}</td>
        <td>${s.positionInSubject ?? "-"}</td>
        <td>${s.remark ?? "-"}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Report Card - ${studentName}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #f1f5f9; padding: 24px; }
  .card { max-width: 800px; margin: 0 auto; background: #fff; border: 2px solid #0f766e; border-radius: 12px; overflow: hidden; }
  .header { background: #0f766e; color: #fff; text-align: center; padding: 24px 16px; }
  .header h1 { font-size: 22px; letter-spacing: 1px; margin-bottom: 4px; }
  .header .sub { font-size: 12px; opacity: 0.9; }
  .banner { text-align: center; padding: 10px; background: #fef3c7; border-bottom: 1px solid #fcd34d; font-size: 13px; font-weight: bold; color: #92400e; letter-spacing: 1px; }
  .info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; padding: 18px 20px; border-bottom: 2px solid #0f766e; font-size: 13px; }
  .info .row { display: flex; justify-content: space-between; gap: 12px; }
  .info .label { color: #64748b; }
  .info .value { font-weight: bold; color: #0f172a; text-transform: capitalize; }
  table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
  th { background: #0f766e; color: #fff; font-size: 11px; letter-spacing: 0.5px; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  .summary { display: flex; flex-wrap: wrap; gap: 12px; padding: 14px 20px; font-size: 13px; background: #f0fdfa; border-top: 2px solid #0f766e; }
  .summary span { background: #fff; border: 1px solid #99f6e4; border-radius: 8px; padding: 6px 10px; font-weight: bold; color: #134e4a; }
  .signatures { display: flex; justify-content: space-between; gap: 16px; padding: 26px 20px 10px; font-size: 12px; color: #475569; }
  .signatures div { text-align: center; flex: 1; }
  .signatures .line { border-top: 1px solid #94a3b8; margin-top: 36px; padding-top: 6px; }
  .footer { text-align: center; padding: 10px; font-size: 10.5px; color: #94a3b8; }
  @media print {
    body { background: #fff; padding: 0; }
    .card { border: none; border-radius: 0; max-width: none; }
  }
</style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>${schoolName}</h1>
      <div class="sub">Excellence in Learning & Character</div>
    </div>
    <div class="banner">OFFICIAL REPORT CARD — ${term.toUpperCase()}</div>
    <div class="info">
      <div class="row"><span class="label">Student:</span><span class="value">${studentName}</span></div>
      <div class="row"><span class="label">Class:</span><span class="value">${className}</span></div>
      <div class="row"><span class="label">Position in Class:</span><span class="value">${positionInClass ?? "-"}</span></div>
      <div class="row"><span class="label">Overall Total:</span><span class="value">${overallTotal ?? "-"} / ${maximumPossible ?? "-"}</span></div>
      <div class="row"><span class="label">Average:</span><span class="value">${average ?? "-"}%</span></div>
      <div class="row"><span class="label">Date Issued:</span><span class="value">${new Date().toLocaleDateString()}</span></div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Subject</th><th>CA1 (20)</th><th>CA2 (20)</th><th>Exam (60)</th><th>Total (100)</th><th>Grade</th><th>Position</th><th>Remark</th>
        </tr>
      </thead>
      <tbody>
        ${rows || '<tr><td colspan="8" style="text-align:center">No results available.</td></tr>'}
      </tbody>
    </table>
    <div class="summary">
      <span>Total: ${overallTotal ?? "-"} / ${maximumPossible ?? "-"}</span>
      <span>Average: ${average ?? "-"}%</span>
      <span>Position: ${positionInClass ?? "-"}</span>
    </div>
    <div class="signatures">
      <div><div class="line">Class Teacher</div></div>
      <div><div class="line">Head of School</div></div>
      <div><div class="line">Parent / Guardian</div></div>
    </div>
    <div class="footer">Generated by LIVINGSTONEEDU School Management Suite</div>
  </div>
</body>
</html>`;
}

export function buildLessonNoteFile(note: any): string {
  const lines: string[] = [];
  lines.push(`${note.subject} — Lesson Note`);
  lines.push(`Topic: ${note.topic}`);
  lines.push(`Class: ${note.className}  |  Week: ${note.week}`);
  lines.push(`Teacher: ${note.teacher}  |  Duration: ${note.durationMinutes} minutes`);
  lines.push("");
  lines.push("INTRODUCTION");
  lines.push(note.introduction || "");
  lines.push("");
  if (Array.isArray(note.behavioralObjectives)) {
    lines.push("BEHAVIORAL OBJECTIVES");
    note.behavioralObjectives.forEach((o: string, i: number) => lines.push(`${i + 1}. ${o}`));
    lines.push("");
  }
  if (Array.isArray(note.instructionalMaterials)) {
    lines.push("INSTRUCTIONAL MATERIALS");
    lines.push(note.instructionalMaterials.join(", "));
    lines.push("");
  }
  if (Array.isArray(note.coreContent)) {
    lines.push("CORE CONTENT");
    note.coreContent.forEach((block: any) => {
      lines.push(`[${block.heading}]`);
      lines.push(block.content || block.body || "");
      lines.push("");
    });
  }
  lines.push("TEACHER DEMONSTRATION");
  lines.push(note.teacherDemonstration || "");
  lines.push("");
  if (Array.isArray(note.studentActivities)) {
    lines.push("STUDENT ACTIVITIES");
    note.studentActivities.forEach((a: string, i: number) => lines.push(`${i + 1}. ${a}`));
    lines.push("");
  }
  if (Array.isArray(note.evaluationQuestions)) {
    lines.push("EVALUATION QUESTIONS");
    note.evaluationQuestions.forEach((q: string, i: number) => lines.push(`${i + 1}. ${q}`));
    lines.push("");
  }
  lines.push("SUMMARY / WRAP-UP");
  lines.push(note.summaryWrapUp || "");
  lines.push("");
  lines.push("ASSIGNMENT");
  lines.push(note.assignment || "");
  lines.push("");
  lines.push("— Generated by LIVINGSTONEEDU School Management Suite —");
  return lines.join("\n");
}

export function buildBroadsheetCsv(rows: any[]): string {
  const header = "Student,Subject,CA (30%),Exam (70%),Total (100%),Grade";
  const body = rows
    .map((c) =>
      [
        `"${String(c.studentName || "").replace(/"/g, '""')}"`,
        `"${String(c.subject || "").replace(/"/g, '""')}"`,
        c.totalCaScore ?? "",
        c.examScore ?? "",
        c.finalTotal != null ? `${c.finalTotal}%` : "",
        c.grade ?? "",
      ].join(",")
    )
    .join("\n");
  return `${header}\n${body}`;
}
