type RequestItemRow = {
  itemId: string;
  requestId: string;
  documentType: string;
  copies: number;
  fee: unknown;
};

/** Fee per copy. Placeholder amounts: replace with your school's real schedule. */
export const FEE_SCHEDULE: Record<string, number> = {
  "Transcript of Records": 150,
  "Certificate of Enrollment": 50,
  "Certificate of Good Moral": 50,
  "Certificate of Grades": 75,
};

export interface RequestItemProps {
  itemId?: string;
  requestId?: string;
  documentType: string;
  copies: number;
  fee?: number;
}

export class RequestItem {
  // ---- attributes ----
  readonly itemId: string; // PK
  requestId: string; // FK -> DocumentRequest (set by the parent on create)
  documentType: string;
  copies: number;
  fee: number;

  constructor(props: RequestItemProps) {
    this.itemId = props.itemId ?? crypto.randomUUID();
    this.requestId = props.requestId ?? "";
    this.documentType = props.documentType;
    this.copies = props.copies;
    this.fee = props.fee ?? 0;
  }

  // ---- methods ----
  computeFee(): number {
    const perCopy = FEE_SCHEDULE[this.documentType];
    if (perCopy === undefined)
      throw new Error(`No fee defined for "${this.documentType}"`);
    if (this.copies < 1) throw new Error("Copies must be at least 1");
    this.fee = perCopy * this.copies;
    return this.fee;
  }

  static fromRecord(r: RequestItemRow): RequestItem {
    return new RequestItem({ ...r, fee: Number(r.fee) });
  }
}
