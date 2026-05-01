import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";

const path = ".env.development.local";

try {
  const secret = randomBytes(48).toString("hex");
  writeFileSync(path, `SESSION_SECRET=${secret}\n`, { flag: "wx" });
  console.log(`[dev] Generated ${path} with a random SESSION_SECRET`);
} catch (error) {
  if (error.code !== "EEXIST") throw error;
}
