import prisma from "@/lib/prisma";
import { Student } from "./Student";
import { Clearance } from "./Clearance";

export interface DepartmentProps {
  deptId?: string;
  deptName: string;
  college: string;
}

type DepartmentRow = Pick<DepartmentProps, "deptId" | "deptName" | "college">;

export class Department {
  // ---- attributes ----
  readonly deptId: string; // PK
  deptName: string;
  college: string;

  constructor(props: DepartmentProps) {
    this.deptId = props.deptId ?? crypto.randomUUID();
    this.deptName = props.deptName;
    this.college = props.college;
  }

  // ---- methods ----
  async listStudents(): Promise<Student[]> {
    const rows = await prisma.student.findMany({
      where: { enrollments: { some: { course: { deptId: this.deptId } } } },
      include: { user: true },
      orderBy: { lastName: "asc" },
    });
    return rows.map((r: Awaited<typeof rows>[number]) => Student.fromRecord(r.user, r));
  }

  /** Uncleared clearances of this department's students. */
  async listPendingClearance(): Promise<Clearance[]> {
    const rows = await prisma.clearance.findMany({
      where: {
        isCleared: false,
        student: { enrollments: { some: { course: { deptId: this.deptId } } } },
      },
    });
    return rows.map((r: Awaited<typeof rows>[number]) => Clearance.fromRecord(r));
  }

  // ---- persistence helpers ----
  static fromRecord(r: DepartmentRow): Department {
    return new Department(r);
  }

  static async findById(deptId: string): Promise<Department | null> {
    const r = await prisma.department.findUnique({ where: { deptId } });
    return r ? Department.fromRecord(r) : null;
  }
}
