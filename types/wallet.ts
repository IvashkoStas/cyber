import type { Balance } from './balance';
import type { NetworkAddress } from './network.address';

export interface Wallet {
  id: number;
  address: string;
  balances: Balance[];
  supportedSymbols: string[];
  assets: NetworkAddress[];
}
