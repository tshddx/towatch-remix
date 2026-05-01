import { Database } from "remix/data-table";
import type { Middleware } from "remix/fetch-router";

import { db } from "../data/database.ts";

export function loadDatabase(): Middleware {
  return async (context, next) => {
    context.set(Database, db);
    return next();
  };
}
