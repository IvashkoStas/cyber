import type { Card } from './card';
import type { Kyc } from './kyc';
import type { LanguageCode } from './language.code';
import type { Partner } from './partner';
import type { Wallet } from './wallet';

export interface User {
  id: number;
  telegramId: number;
  languageCode: LanguageCode;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  wallet: Wallet;
  kyc: Kyc;
  cards: Card[];
  role: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  bdate: string;
  partner: Partner;
  isOnboarded: boolean;
  autoReplenishCard: boolean;
  deviceTokens: string[];
}
