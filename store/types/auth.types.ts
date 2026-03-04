export interface ICreateUser {
  password: string;
  uniqueId: string;
  username: string;
}
export interface ILogin {
  password: string;
  email: string;
}
export interface ISignupFormdata {
  fullName: string;
  email: string;
  companyName: string;
  address: string;
  phoneNumber: string;
  password: string;
}
export type IStatus =
  | "unverified"
  | "verified"
  | "PENDING"
  | "PENDING_APPROVAL"
  | "APPROVED";

export interface LoginData {
  sessionId: string;
  validityInMinutes: number;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
}
export interface AuthResponse {
  message: string;
  data: AuthData;
}

export interface IDocumentUploadResponse {
  message: string;
  data: IStatus;
}
export interface ILogoResponse {
  message: string;
  data: unknown;
}

export interface DashboardResponse {
  message: string;
  data: {
    totalRecords: number;
    totalPages: number;
    totalAmount: number;
    totalAmountPaid: number;
    totalOutstandingBalance: number;
    records: unknown[]; // You can replace `any` with a more specific type if records have a defined structure
  };
}
export interface PaymentReportResponse {
  message: string;
  data: [];
}

export interface AuthData {
  userToken: UserToken;
  userModel: UserModel;
}

export interface UserToken {
  accessToken: TokenDetails;
  refreshToken: TokenDetails;
}

export interface TokenDetails {
  token: string;
  expiryTimeInMinutes: number;
}

export interface UserModel {
  tradeCode: string;
  firstName: string;
  lastName: string;
  accessStatus: string;
  email: string;
  phoneNumber: string | null;
  userRole: UserRole;
  createdBy: string;
  dateCreated: string;
  tradeZone: string | null;
  passwordUpdatedRequired: boolean;
  corporateBNPLModel: CorporateBNPLModel;
}

export interface UserRole {
  code: string;
  name: string;
  privileges: string[];
}

export interface CorporateBNPLModel {
  companyName: string;
  businessType: string;
  companyEmail: string;
  logo: string;
  phoneNumber: string | null;
  address: string;
  contactName: string;
  contactEmail: string;
  businessCertificateStatus: IStatus;
  tinStatus: IStatus;
  cacStatus: IStatus;
}

export interface ISignup {
  address: string;
  businessType: string;
  companyName: string;
  contactPersonEmail: string;
  contactPersonName: string;
  email: string;
  maximumSalaryDay: string;
  password: string;
  phoneNumber: string;
}

export interface IEmployeeApprovalRequestBody {
  approved: boolean;
  orderId: string[];
}

export interface LoginOtpResponse {
  message: string;
  data: LoginOtpData;
}

export interface LoginOtpData {
  userToken: UserToken;
  user: User;
}

export interface UserToken {
  accessToken: Token;
  refreshToken: Token;
}

export interface Token {
  token: string;
  expiryTimeInMinutes: number;
}

export interface User {
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

export interface Account {
  id: number;
  name: string;
  verificationStatus: string;
  verificationStage:
    | "PENDING"
    | "PERSONAL_INFORMATION"
    | "ID_CARD_UPLOAD"
    | "SELFIE_UPLOAD"
    | "PENDING_VERIFICATION"
    | "VERIFIED";
  cryptoWallets: CryptoWallet[];
  country: Country;
  currency: Currency;
}

export interface CryptoWallet {
  walletId: string;
  walletBalance: number;
  currency: CryptoCurrency;
  walletAddress: string;
  fiatBalance: number;
}

export interface CryptoCurrency {
  displayName: string;
  symbol: string;
  code: string;
  logoUrl: string;
  crypto: boolean;
}

export interface Country {
  id: number;
  code: string;
  name: string;
  dialingCode: string;
  flagUrl: string;
}

export interface Currency {
  name: string;
  symbol: string;
  code: string;
  logoUrl: string;
}
