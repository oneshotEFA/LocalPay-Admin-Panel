import { GatewayClient } from "../types";

export const mockClientProfile: GatewayClient & {
  stats: {
    totalCheckoutsMonth: number;
    totalDepositsMonth: number;
    totalFundedMonth: number;
    pendingAttention: number;
  };
} = {
  id: "client-1234-5678",
  name: "PayerOne Ethiopia",
  slug: "payerone",
  logoUrl: "https://ui-avatars.com/api/?name=Payer+One&background=random",
  webhookUrl: "https://api.localbankpv.com/v1/webhook",
  isActive: true,
  createdAt: "2023-01-15T10:00:00Z",
  updatedAt: "2024-03-29T10:00:00Z",
  stats: {
    totalCheckoutsMonth: 12450,
    totalDepositsMonth: 9320,
    totalFundedMonth: 45000000,
    pendingAttention: 14,
  },
};
