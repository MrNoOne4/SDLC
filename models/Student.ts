import prisma from "@/lib/prisma";
import type { SessionRole } from "@/lib/auth/jwt";
import { User, type UserProps } from "./User";
import { Enrollment } from "./Enrollment";
import { Course } from "./Course";
import { DocumentRequest, type DocumentRequestInput } from "./DocumentRequest";

type StudentRow = NonNullable<Awaited<ReturnType<typeof prisma.student.findUnique>>>;

export interface StudentProps extends UserProps {
  studentNo: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  yearLevel: number;
  program: string;
  status: string;
}

export class Student extends User {
  // ---- attributes ----
  readonly studentNo: string; // unique
  lastName: string;
  firstName: string;
  middleName: string;
  yearLevel: number;
  program: string;
  status: string;

  constructor(props: StudentProps) {
    super(props);
    this.studentNo = props.studentNo;
    this.lastName = props.lastName;
    this.firstName = props.firstName;
    this.middleName = props.middleName ?? "";
    this.yearLevel = props.yearLevel;
    this.program = props.program;
    this.status = props.status;
  }

  get sessionRole(): SessionRole {
    return "Student";
  }

  // ---- methods ----
  viewProfile(): Record<string, unknown> {
    return this.toPlain();
  }

  async viewGrades(): Promise<Enrollment[]> {
    return Enrollment.findByStudent(this.studentNo);
  }

  async viewSubjects(): Promise<Course[]> {
    const rows = await prisma.course.findMany({
      where: { enrollments: { some: { studentNo: this.studentNo } } },
      orderBy: { courseCode: "asc" },
    });
    return rows.map(Course.fromRecord);
  }

  async fileDocumentRequest(
    input: DocumentRequestInput,
  ): Promise<DocumentRequest> {
    const request = DocumentRequest.create(this.studentNo, input);
    await request.submit();
    return request;
  }

  // ---- persistence helpers ----
  static fromRecord(u: Record<string, unknown>, s: StudentRow): Student {
    return new Student({ ...u, ...s } as StudentProps);
  }

  static async findByStudentNo(studentNo: string): Promise<Student | null> {
    const s = await prisma.student.findUnique({
      where: { studentNo },
      include: { user: true },
    });
    return s ? Student.fromRecord(s.user, s) : null;
  }

  static async findByUserId(userId: string): Promise<Student | null> {
    const s = await prisma.student.findUnique({
      where: { userId },
      include: { user: true },
    });
    return s ? Student.fromRecord(s.user, s) : null;
  }
}
