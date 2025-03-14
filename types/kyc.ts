import type { KycStatus } from './kys.status';

export interface Kyc {
  id: number;
  musePayUserId: number;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  status: KycStatus;
  repeats: number;
  moderatorComment: Nullable<string>;
  bdate: Nullable<string>;
  email: Nullable<Nullable<string>>;
  phone: Nullable<Nullable<string>>;
  documentType: Nullable<string>;
  documentNumber: Nullable<string>;
  documentExpireDate: Nullable<string>;
  documentCountry: Nullable<string>;
  updatedAt: string;
  createdAt: string;
}

