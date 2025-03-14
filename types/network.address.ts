import type { MainNetworks } from './network';

export interface NetworkAddress {
  network: MainNetworks;
  address: string;
}


export interface NetworkAddressWithSymbol extends NetworkAddress {
  symbol?: string;
}
