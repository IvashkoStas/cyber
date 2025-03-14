import type { CardNetwork } from './card.network';
import type { CardStatus } from './card.status';
import type { Partner } from './partner';

export interface Card {
  id: number;
  status: CardStatus;
  applyStatus: string;
  encodedNumber: string;
  last4CardNumber: string;
  name: string;
  type: string;
  currency: string;
  level: number;
  balance: number;
  dailyLimit: number;
  expireAt: string;
  cvv: string;
  productId: string;
  network: CardNetwork;
  pin: string;
  txPercent: boolean;
  txNoPercent: boolean;
  partner: Partner;
}
