import prisma from "@/lib/prisma";
import type { SessionRole } from "@/lib/auth/jwt";
import { User, type UserProps } from "./User";
import { Enrollment } from "./Enrollment";
import { DocumentRequest } from "./DocumentRequest";
import { Payment, type PaymentInput } from "./Payment";
import { Clearance } from "./Clearance";

type AdminRow = NonNullable<
  Awaited<ReturnType<typeof prisma.adminUser.findUnique>>
>;
type UserRow = NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;

export type AdminRole =
  | "Registrar"
  | "Cashier"
  | "DepartmentStaff"
  | "SystemAdmin";

export interface AdminUserProps extends UserProps {
  employeeNo: string;
  office: string;
  position: string;
  role: AdminRole;
  deptId?: string | null;
}

export class AdminUser extends User {
  readonly employeeNo: string; // unique
  office: string;
  position: string;
  role: AdminRole; 
  deptId: string | null;

  constructor(props: AdminUserProps) {
    super(props);
    this.employeeNo = props.employeeNo;
    this.office = props.office;
    this.position = props.position;
    this.role = props.role;
    this.deptId = props.deptId ?? null;
  }

  get sessionRole(): SessionRole {
    return this.role;
  }

  /** SystemAdmin can do everything; otherwise the role must be listed. */
  private assertRole(...allowed: AdminRole[]): void {
    if (this.role !== "SystemAdmin" && !allowed.includes(this.role)) {
      throw new Error(
        `Role ${this.role} is not allowed to perform this action`,
      );
    }
  }

  async encodeGrades(enrollmentId: string, grade: number): Promise<Enrollment> {
    this.assertRole("Registrar", "DepartmentStaff");
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) throw new Error("Enrollment not found");
    await enrollment.encodeGrade(grade);
    return enrollment;
  }

  async approveRequest(requestId: string): Promise<DocumentRequest> {
    this.assertRole("Registrar");
    const request = await DocumentRequest.findById(requestId);
    if (!request) throw new Error("Request not found");
    await request.updateStatus("Approved");
    return request;
  }

  async postPayment(input: PaymentInput): Promise<Payment> {
    this.assertRole("Cashier");
    const payment = Payment.create(input, this.userId);
    await payment.post();
    return payment;
  }

  async signClearance(clearanceId: string): Promise<Clearance> {
    this.assertRole("Registrar", "DepartmentStaff");
    const clearance = await Clearance.findById(clearanceId);
    if (!clearance) throw new Error("Clearance not found");
    await clearance.sign(this.userId);
    return clearance;
  }

  async manageAccount(
    targetUserId: string,
    changes: { isActive: boolean },
  ): Promise<void> {
    if (this.role !== "SystemAdmin")
      throw new Error("Only SystemAdmin can manage accounts");
    await prisma.user.update({
      where: { userId: targetUserId },
      data: changes,
    });
  }

  static fromRecord(u: UserRow, a: AdminRow): AdminUser {
    return new AdminUser({ ...u, ...a });
  }

  static async findByUserId(userId: string): Promise<AdminUser | null> {
    const a = await prisma.adminUser.findUnique({
      where: { userId },
      include: { user: true },
    });
    return a ? AdminUser.fromRecord(a.user, a) : null;
  }
}
