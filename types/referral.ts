import type { Transaction } from './tx';

export interface PartnerReferral {
  offset: number
  limit: number
  transactions: Transaction[]
  total: number
  totalUSD: number
}


export interface ReferralLine {
  depth: number
  referralsNeed: number
  referrals: number
  cards: number
  turnover: number
  profit: number
  active: boolean
  percentBuy: number
  percentTopUp: number
}



export interface Referral {
  lines: ReferralLine[]
  balance: number
  url: string
  isPartner: boolean
}

