export type BetterAuthUser = {
  id: string;
  name: string | null;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
  twoFactorEnabled?: boolean;
  role?: string;
  clientId?: string | null;
};

export type BetterAuthSignInResponse = {
  redirect: boolean;
  token: string;
  user: BetterAuthUser;
};

export type BetterAuthSessionResponse =
  | {
      user: BetterAuthUser;
      token?: string;
    }
  | {
      session: {
        user: BetterAuthUser;
        token?: string;
      } | null;
    };

