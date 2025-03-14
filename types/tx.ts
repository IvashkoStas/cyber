export interface Tx {
  offset: number;
  limit: number;
  transactions: Transaction[];
  total: number;
  totalUSD: number;
}


export enum TransactionType {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  BUY_CARD = 'BUY_CARD',
  REF_BONUS = 'REF_BONUS',
  CHARGE = 'CHARGE',
  REFUND = 'REFUND',
  TOP_UP = 'TOP_UP',
  REPAY = 'REPAY',
  CASHBACK = 'CASHBACK',
  INTEREST = 'INTEREST',
  FEE = 'FEE',
  OTHER = 'OTHER',
  TO_WALLET = 'TO_WALLET'
}

export enum TransactionStatus {
  REQUESTED = 'REQUESTED',
  PROCESSING = 'PROCESSING',
  CONFIRMED = 'CONFIRMED',
  FAIL = 'FAIL',
  PENDING = 'PENDING',
  CANCELED = 'CANCELED'
}


export interface Transaction {
  id: number;
  hash: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  depth: number;
  amountUSD: number;
  fee: number;
  rate: number;
  percent: number;
  createdAt: string;
  updatedAt: string;
  executionDate: string;
  network: string;
  status: TransactionStatus;
  type: TransactionType;
  symbol: string;
  merchant?: Nullable<string>;
}

export type TransactionTime = 'today' | 'yesterday' | string;

export interface TransactionWithTime extends Transaction {
  time: TransactionTime;
}
