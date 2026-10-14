import  prisma  from "@/lib/prisma";

type EnrollmentRow = NonNullable<Awaited<ReturnType<typeof prisma.enrollment.findUnique>>>;

export interface EnrollmentProps {
  enrollmentId?: string;
  studentNo: string;
  courseCode: string;
  schoolYear: string;
  term: string;
  grade?: number | null;
  remarks?: string;
}

export class Enrollment {
  // ---- attributes ----
  readonly enrollmentId: string; // PK
  studentNo: string;
  courseCode: string;
  schoolYear: string;
  term: string;
  grade: number | null; // decimal [0..1]
  remarks: string;

  constructor(props: EnrollmentProps) {
    this.enrollmentId = props.enrollmentId ?? crypto.randomUUID();
    this.studentNo = props.studentNo;
    this.courseCode = props.courseCode;
    this.schoolYear = props.schoolYear;
    this.term = props.term;
    this.grade = props.grade ?? null;
    this.remarks = props.remarks ?? "";
  }

  // ---- methods ----
  async encodeGrade(grade: number, remarks?: string): Promise<void> {
    if (grade < 1 || grade > 5) throw new Error("Grade must be between 1.00 and 5.00"); // adjust to your grading scale
    this.grade = grade;
    if (remarks !== undefined) this.remarks = remarks;
    await prisma.enrollment.update({
      where: { enrollmentId: this.enrollmentId },
      data: { grade: this.grade, remarks: this.remarks },
    });
  }

  viewGrade(): number | null {
    return this.grade;
  }

  // ---- persistence helpers ----
  static fromRecord(r: EnrollmentRow): Enrollment {
    return new Enrollment({ ...r, grade: r.grade === null ? null : Number(r.grade) });
  }

  static async findById(enrollmentId: string): Promise<Enrollment | null> {
    const r = await prisma.enrollment.findUnique({ where: { enrollmentId } });
    return r ? Enrollment.fromRecord(r) : null;
  }

  static async findByStudent(studentNo: string): Promise<Enrollment[]> {
    const rows = await prisma.enrollment.findMany({
      where: { studentNo },
      orderBy: [{ schoolYear: "asc" }, { term: "asc" }],
    });
    return rows.map(Enrollment.fromRecord);
  }
}
