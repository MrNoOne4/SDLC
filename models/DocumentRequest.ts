import  prisma  from "@/lib/prisma";
import { RequestItem } from "./RequestItem";

type ItemRow = NonNullable<
  Awaited<ReturnType<typeof prisma.requestItem.findUnique>>
>;
type RequestRow = NonNullable<
  Awaited<ReturnType<typeof prisma.documentRequest.findUnique>>
>;

export type RequestStatus = RequestRow["status"];

export interface DocumentRequestInput {
  documentType: string;
  purpose: string;
  items: { documentType: string; copies: number }[];
}

export interface DocumentRequestProps {
  requestId?: string;
  studentNo: string;
  documentType: string;
  copies: number;
  purpose: string;
  status?: RequestStatus;
  dateFiled?: Date;
  dateReleased?: Date | null;
  items: RequestItem[];
}

// Allowed status transitions
const TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  Pending: ["Approved", "Cancelled"],
  Approved: ["Released", "Cancelled"],
  Released: [],
  Cancelled: [],
};

export class DocumentRequest {
  // ---- attributes ----
  readonly requestId: string; // PK
  studentNo: string; // FK -> Student
  documentType: string;
  copies: number;
  purpose: string;
  status: RequestStatus; // Pending | Approved | Released | Cancelled
  dateFiled: Date;
  dateReleased: Date | null; // [0..1]
  items: RequestItem[]; // composition 1 -> 1..*

  constructor(props: DocumentRequestProps) {
    this.requestId = props.requestId ?? crypto.randomUUID();
    this.studentNo = props.studentNo;
    this.documentType = props.documentType;
    this.copies = props.copies;
    this.purpose = props.purpose;
    this.status = props.status ?? "Pending";
    this.dateFiled = props.dateFiled ?? new Date();
    this.dateReleased = props.dateReleased ?? null;
    this.items = props.items;
    this.items.forEach((i) => (i.requestId = this.requestId));
  }

  /** Builds a not-yet-saved request from form input. Call submit() to persist. */
  static create(studentNo: string, input: DocumentRequestInput): DocumentRequest {
    const items = input.items.map((i) => new RequestItem(i));
    return new DocumentRequest({
      studentNo,
      documentType: input.documentType,
      copies: items.reduce((n, i) => n + i.copies, 0),
      purpose: input.purpose,
      items,
    });
  }

  get total(): number {
    return this.items.reduce((sum, i) => sum + i.fee, 0);
  }

  // ---- methods ----
  /** Computes fees and saves the request with its items in one transaction. */
  async submit(): Promise<void> {
    if (this.items.length < 1) throw new Error("A request needs at least one item");
    this.items.forEach((i) => i.computeFee());
    this.status = "Pending";

    await prisma.documentRequest.create({
      data: {
        requestId: this.requestId,
        studentNo: this.studentNo,
        documentType: this.documentType,
        copies: this.copies,
        purpose: this.purpose,
        status: this.status,
        dateFiled: this.dateFiled,
        items: {
          create: this.items.map((i) => ({
            itemId: i.itemId,
            documentType: i.documentType,
            copies: i.copies,
            fee: i.fee,
          })),
        },
      },
    });
  }

  async cancel(): Promise<void> {
    await this.updateStatus("Cancelled");
  }

  async updateStatus(next: RequestStatus): Promise<void> {
    if (!TRANSITIONS[this.status].includes(next)) {
      throw new Error(`Cannot change status from ${this.status} to ${next}`);
    }
    this.status = next;
    if (next === "Released") this.dateReleased = new Date();

    await prisma.documentRequest.update({
      where: { requestId: this.requestId },
      data: { status: this.status, dateReleased: this.dateReleased },
    });
  }

  // ---- persistence helpers ----
  static fromRecord(r: RequestRow & { items: ItemRow[] }): DocumentRequest {
    return new DocumentRequest({ ...r, items: r.items.map(RequestItem.fromRecord) });
  }

  static async findById(requestId: string): Promise<DocumentRequest | null> {
    const r = await prisma.documentRequest.findUnique({ where: { requestId }, include: { items: true } });
    return r ? DocumentRequest.fromRecord(r) : null;
  }

  static async findByStudent(studentNo: string): Promise<DocumentRequest[]> {
    const rows = await prisma.documentRequest.findMany({
      where: { studentNo },
      include: { items: true },
      orderBy: { dateFiled: "desc" },
    });
    return rows.map(DocumentRequest.fromRecord);
  }

  static async findPending(): Promise<DocumentRequest[]> {
    const rows = await prisma.documentRequest.findMany({
      where: { status: "Pending" },
      include: { items: true },
      orderBy: { dateFiled: "asc" },
    });
    return rows.map(DocumentRequest.fromRecord);
  }
}
