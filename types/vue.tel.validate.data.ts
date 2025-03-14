export interface VueTelInputValidateData {
  country: string;
  countryCallingCode: string;
  nationalNumber: string;
  number: string;
  __countryCallingCodeSource: string;
  countryCode: string;
  valid: boolean;
  formatted: string;
  getMetadata: () => object;
}