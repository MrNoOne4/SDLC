import  prisma  from "@/lib/prisma";
import { PaymentItem } from "./PaymentItem";

export interface PaymentInput {
  studentNo: string;
  orNumber: string;
  method: string;
  items: { description: string; amount: number }[];
}

export interface PaymentProps {
  paymentId?: string;
  orNumber: string;
  studentNo: string;
  postedBy?: string | null;
  amount: number;
  method: string;
  paidAt?: Date;
  isVoid?: boolean;
  items: PaymentItem[];
}

export class Payment {
  // ---- attributes ----
  readonly paymentId: string; // PK
  orNumber: string; // unique
  studentNo: string; // FK -> Student
  postedBy: string | null; // FK -> AdminUser (cashier)
  amount: number;
  method: string;
  paidAt: Date;
  isVoid: boolean;
  items: PaymentItem[]; // composition 1 -> 0..*

  constructor(props: PaymentProps) {
    this.paymentId = props.paymentId ?? crypto.randomUUID();
    this.orNumber = props.orNumber;
    this.studentNo = props.studentNo;
    this.postedBy = props.postedBy ?? null;
    this.amount = props.amount;
    this.method = props.method;
    this.paidAt = props.paidAt ?? new Date();
    this.isVoid = props.isVoid ?? false;
    this.items = props.items;
    this.items.forEach((i) => (i.paymentId = this.paymentId));
  }

  /** Builds an unsaved payment; amount is the sum of the items. Call post() to persist. */
  static create(input: PaymentInput, cashierUserId: string): Payment {
    const items = input.items.map((i) => new PaymentItem(i));
    return new Payment({
      orNumber: input.orNumber,
      studentNo: input.studentNo,
      postedBy: cashierUserId,
      method: input.method,
      amount: items.reduce((s, i) => s + i.amount, 0),
      items,
    });
  }

  // ---- methods ----
  /** Saves the payment and its items in one transaction. */
  async post(): Promise<void> {
    if (this.items.length < 1) throw new Error("A payment needs at least one item");
    const itemsTotal = this.items.reduce((s, i) => s + i.amount, 0);
    if (Math.abs(itemsTotal - this.amount) > 0.005) {
      throw new Error("Payment amount does not match the sum of its items");
    }

    await prisma.payment.create({
      data: {
        paymentId: this.paymentId,
        orNumber: this.orNumber,
        studentNo: this.studentNo,
        postedBy: this.postedBy,
        amount: this.amount,
        method: this.method,
        paidAt: this.paidAt,
        items: {
          create: this.items.map((i) => ({
            itemId: i.itemId,
            description: i.description,
            amount: i.amount,
          })),
        },
      },
    });
  }

  /** Marks the payment void and keeps the row for audit. */
  async voidPayment(): Promise<void> {
    if (this.isVoid) throw new Error("Payment is already void");
    this.isVoid = true;
    await prisma.payment.update({ where: { paymentId: this.paymentId }, data: { isVoid: true } });
  }

  // ---- persistence helpers ----
  static fromRecord(r: {
    paymentId: string;
    orNumber: string;
    studentNo: string;
    postedBy: string | null;
    amount: unknown;
    method: string;
    paidAt: Date;
    isVoid: boolean;
    items: Parameters<typeof PaymentItem.fromRecord>[0][];
  }): Payment {
    return new Payment({
      ...r,
      amount: Number(r.amount),
      items: r.items.map(PaymentItem.fromRecord),
    });
  }

  static async findById(paymentId: string): Promise<Payment | null> {
    const r = await prisma.payment.findUnique({ where: { paymentId }, include: { items: true } });
    return r ? Payment.fromRecord(r) : null;
  }

  static async findByStudent(studentNo: string): Promise<Payment[]> {
    const rows = await prisma.payment.findMany({
      where: { studentNo },
      include: { items: true },
      orderBy: { paidAt: "desc" },
    });
    return rows.map(Payment.fromRecord);
  }
}
