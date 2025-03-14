import type { Balance } from './balance';

export interface UserWallet {
  id: number;
  address: string;
  addresses: string[];
  supportedSymbols: string[];
  createdAt: string;
  updatedAt: string;
  balances: Balance[];
  balanceUSDT: string;
  user: string;
}
