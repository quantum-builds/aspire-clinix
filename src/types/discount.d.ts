export interface CreateDiscount {
  type: DiscountType;
  value: number;
  expiresAt: Date;
}

export interface UpdateDiscount {
  id: string;
  type?: DiscountType;
  value?: number;
  expiresAt?: Date;
}

enum DiscountType {
  PERCENTAGE,
  FIXED_AMOUNT,
}
