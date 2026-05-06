import type { UserRole } from "../constants/enums";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      role: UserRole;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
