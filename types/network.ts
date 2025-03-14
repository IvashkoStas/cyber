export enum Network {
  TON = 'ton',
  TRX = 'trx',
  ETH = 'eth',
  BNB = 'bnb',
  BASE = 'base',
  INTERNAL = 'internal',
  CARD = 'card',
}


export type MainNetworks = Network.BASE | Network.BNB | Network.ETH | Network.TRX | Network.TON;