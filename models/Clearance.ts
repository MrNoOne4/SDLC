import prisma from "@/lib/prisma";

type ClearanceRow = Awaited<
  ReturnType<typeof prisma.clearance.findMany>
>[number];

export interface ClearanceProps {
  clearanceId?: string;
  studentNo: string;
  signedBy?: string | null;
  schoolYear: string;
  term: string;
  isCleared?: boolean;
  remarks?: string;
}

export class Clearance {
  // ---- attributes ----
  readonly clearanceId: string; // PK
  studentNo: string; // FK -> Student
  signedBy: string | null; // FK -> AdminUser
  schoolYear: string;
  term: string;
  isCleared: boolean;
  remarks: string;

  constructor(props: ClearanceProps) {
    this.clearanceId = props.clearanceId ?? crypto.randomUUID();
    this.studentNo = props.studentNo;
    this.signedBy = props.signedBy ?? null;
    this.schoolYear = props.schoolYear;
    this.term = props.term;
    this.isCleared = props.isCleared ?? false;
    this.remarks = props.remarks ?? "";
  }

  // ---- methods ----
  async sign(adminUserId: string, remarks?: string): Promise<void> {
    this.isCleared = true;
    this.signedBy = adminUserId;
    if (remarks !== undefined) this.remarks = remarks;
    await this.save();
  }

  async revoke(remarks?: string): Promise<void> {
    this.isCleared = false;
    this.signedBy = null;
    if (remarks !== undefined) this.remarks = remarks;
    await this.save();
  }

  private async save(): Promise<void> {
    await prisma.clearance.update({
      where: { clearanceId: this.clearanceId },
      data: {
        isCleared: this.isCleared,
        signedBy: this.signedBy,
        remarks: this.remarks,
      },
    });
  }

  // ---- persistence helpers ----
  static fromRecord(r: ClearanceRow): Clearance {
    return new Clearance(r);
  }

  static async findById(clearanceId: string): Promise<Clearance | null> {
    const r = await prisma.clearance.findUnique({ where: { clearanceId } });
    return r ? Clearance.fromRecord(r) : null;
  }

  static async findByStudent(studentNo: string): Promise<Clearance[]> {
    const rows = await prisma.clearance.findMany({ where: { studentNo } });
    return rows.map(Clearance.fromRecord);
  }
}
