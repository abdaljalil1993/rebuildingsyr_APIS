import type { AccountType } from "../constants/enums";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      accountType: AccountType;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
