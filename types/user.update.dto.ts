import type { LanguageCode } from './language.code';

export interface UserUpdateDto {
  firstName?: string;
  lastName?: string;
  languageCode?: LanguageCode;
  isOnboarded?: boolean;
  autoReplenishCard?: boolean;
  phone?: string;
  deviceTokens?: string[];
}