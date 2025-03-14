import type { Network } from './network';

export enum BalanceSymbol {
  USDT = 'USDT',
  USD_REF = 'USDREF',
}


export interface Balance {
  id: number;
  symbol: BalanceSymbol | string;
  amount: number;
  amountUSD: number;
  network: Network;
}


