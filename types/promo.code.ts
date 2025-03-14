export interface PromoCode {
  id: number;
  name: string;
  code: string;
  discountPercent: number;
  createdAt: Date | string;
  expireAt: Date | string;
  useAt: Date | string;
  user: number;
  inviter: number;
}