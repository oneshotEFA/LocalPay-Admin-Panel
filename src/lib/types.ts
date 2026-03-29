// src/lib/types.ts

export enum PaymentMethod {
  CBE = "CBE",
  TELEBIRR = "TELEBIRR",
  EBIRR = "EBIRR",
  ABYSSINIA = "ABYSSINIA",
  NIB = "NIB"
}

export enum ReceiptType {
  SCREENSHOT = "SCREENSHOT",
  SMS = "SMS",
  LINK = "LINK"
}

export enum CrawlResponseType {
  PDF = "PDF",
  HTML = "HTML",
  JSON = "JSON"
}

export enum DepositStatus {
  PENDING_RECEIPT = "PENDING_RECEIPT",
  VERIFYING = "VERIFYING",
  VERIFIED = "VERIFIED",
  FUNDED = "FUNDED",
  REJECTED_RETRYABLE = "REJECTED_RETRYABLE",
  REJECTED_HARD = "REJECTED_HARD",
  REJECTED_MAX_RETRIES = "REJECTED_MAX_RETRIES",
  PENDING_MANUAL_REVIEW = "PENDING_MANUAL_REVIEW",
  MANUALLY_APPROVED = "MANUALLY_APPROVED",
  MANUALLY_REJECTED = "MANUALLY_REJECTED",
  VERIFIED_NOT_FUNDED = "VERIFIED_NOT_FUNDED"
}

export enum VerificationCheck {
  AMOUNT_MATCH = "AMOUNT_MATCH",
  TIMESTAMP_FRESHNESS = "TIMESTAMP_FRESHNESS",
  TRANSACTION_ID_FORMAT = "TRANSACTION_ID_FORMAT",
  DUPLICATE_CHECK = "DUPLICATE_CHECK",
  RECEIVER_ACCOUNT_MATCH = "RECEIVER_ACCOUNT_MATCH"
}

export enum CheckoutStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED"
}

export interface GatewayClient {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  webhookUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GatewayApiKey {
  id: string;
  clientId: string;
  apiKey: string;
  apiSecret: string;
  label: string | null;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
  revokedAt: string | null;
}

export interface ClientReceivingAccount {
  id: string;
  clientId: string;
  paymentMethod: PaymentMethod;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
  updatedAt: string;
}

export interface GatewayCheckout {
  id: string;
  clientId: string;
  invoiceId: string;
  amount: number;
  productName: string;
  customerName: string;
  customerEmail: string;
  userId: string | null;

  webhookUrl: string;
  successUrl: string;
  cancelUrl: string;
  failedUrl: string;

  status: CheckoutStatus;
  transactionId: string | null;

  webhookFiredAt: string | null;
  webhookResponse: string | null;

  expiresAt: string;
  createdAt: string;
  updatedAt: string;

  // We can include relations if needed for UI mapping
  depositRequest?: DepositRequest;
}

export interface DepositRequest {
  id: string;
  userId: string;
  clientId: string | null;
  checkoutId: string | null;
  amount: number;
  paymentMethod: PaymentMethod;
  status: DepositStatus;

  retryCount: number;
  maxRetries: number;

  rejectionReason: string | null;
  reasonCode: string | null;
  adminNote: string | null;

  createdAt: string;
  updatedAt: string;

  receipt?: Receipt;
  verifications?: Verification[];
  crawlResult?: CrawlResult;
  checkout?: GatewayCheckout;
}

export interface Receipt {
  id: string;
  depositRequestId: string;
  type: ReceiptType;
  rawLinkUrl: string | null;
  rawSmsText: string | null;
  screenshotPath: string | null;
  telegramFileId: string | null;
  extractedTransactionId: string | null;

  submittedAt: string;
}

export interface CrawlResult {
  id: string;
  depositRequestId: string;
  transactionId: string;
  paymentMethod: PaymentMethod;
  responseType: CrawlResponseType;

  confirmedAmount: number | null;
  confirmedReceiverName: string | null;
  confirmedReceiverAccount: string | null;
  confirmedTimestamp: string | null;
  confirmedStatus: string | null;

  crawledAt: string;
}

export interface Verification {
  id: string;
  depositRequestId: string;
  check: VerificationCheck;
  passed: boolean;
  reasonCode: string | null;
  detail: string | null;
  ranAt: string;
}

export interface Transaction {
  id: string;
  depositRequestId: string;
  clientId: string | null;
  fundedAmount: number;
  platformUserId: string;
  platformResponse: Record<string, unknown>; // json object
  fundedAt: string;
}

export interface AdminConfig {
  id: string;
  key: string;
  value: string;
  label: string | null;
  group: string | null;
  updatedAt: string;
}

export interface ReceivingAccount {
  id: string;
  paymentMethod: PaymentMethod;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
  updatedAt: string;
}

export interface BankParserConfig {
  id: string;
  paymentMethod: PaymentMethod;

  smsPattern: string | null;
  screenshotHints: Record<string, unknown> | null;
  linkPattern: string | null;

  crawlUrlTemplate: string;
  crawlResponseType: CrawlResponseType;
  crawlFieldMappings: Record<string, unknown>;

  isActive: boolean;
  updatedAt: string;
}
