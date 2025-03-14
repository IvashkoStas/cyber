import type { BalanceSymbol } from './balance';
import type { MainNetworks } from './network';

export interface WithdrawDto {
  amount: number;
  toAddress: string;
  memo?: string;
  network: MainNetworks;
  symbol: BalanceSymbol;
}