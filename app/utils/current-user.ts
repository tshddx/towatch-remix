import type { Database } from "remix/data-table";
import type { Session } from "remix/session";

import { users } from "../data/schema.ts";

export interface CurrentUser {
  id: number;
  username: string;
}

export async function loadCurrentUser(db: Database, session: Session): Promise<CurrentUser | null> {
  let userIdValue = session.get("userId");
  if (typeof userIdValue !== "number") return null;

  let user = await db.find(users, userIdValue);
  if (!user) return null;

  return { id: user.id, username: user.username };
}
