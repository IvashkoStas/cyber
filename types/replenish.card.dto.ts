import type { BalanceSymbol } from './balance';

export interface ReplenishCardDto {
  amount: number;
  symbol?: BalanceSymbol;
  balanceId?: number;
}