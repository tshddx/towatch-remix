import { DatabaseSync } from "node:sqlite";

import { createDatabase } from "remix/data-table";
import { createSqliteDatabaseAdapter } from "remix/data-table-sqlite";

const databasePath = process.env.DATABASE_PATH ?? "./db/app.db";

const sqlite = new DatabaseSync(databasePath);
sqlite.exec("PRAGMA foreign_keys = ON");
sqlite.exec("PRAGMA journal_mode = WAL");

export const adapter = createSqliteDatabaseAdapter(sqlite);
export const db = createDatabase(adapter);
