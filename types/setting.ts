import type { Network } from './network';

export interface Setting {
  ENABLE_KYC_PREMODERATION: boolean;
  WITHDRAW_TAX_PERCENT: number;
  CARD_PRICE_USD: number;
  CARD_MIN_REPLENUSH_USD: number;
  CARD_REPLENISH_MIN_TAX_USD: number;
  CARD_REPLENISH_TAX_PERCENT: number;
  REFERRAL_UP_NEEDS: [number, number];
  REFERRAL_PERCENTS: [number, number];
  TELEGRAM_BOT_USERNAME: string;
  REFERRAL_PERCENTS_BUY: [number, number];
  REFERRAL_PERCENTS_TOPUP: [number, number];
  WITHDRAW_NETWORKS: Network[];
  UNSUPPORTED_COUNTRIES: string[];
}
