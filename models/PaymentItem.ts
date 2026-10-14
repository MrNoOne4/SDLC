type PaymentItemRow = {
  itemId: string;
  paymentId: string;
  description: string;
  amount: number | string | { toString(): string };
};

export interface PaymentItemProps {
  itemId?: string;
  paymentId?: string;
  description: string;
  amount: number;
}

export class PaymentItem {
  // ---- attributes ----
  readonly itemId: string; // PK
  paymentId: string; // FK -> Payment (set by the parent)
  description: string;
  amount: number;

  constructor(props: PaymentItemProps) {
    this.itemId = props.itemId ?? crypto.randomUUID();
    this.paymentId = props.paymentId ?? "";
    this.description = props.description;
    this.amount = props.amount;
  }

  static fromRecord(r: PaymentItemRow): PaymentItem {
    return new PaymentItem({ ...r, amount: Number(r.amount) });
  }
}
