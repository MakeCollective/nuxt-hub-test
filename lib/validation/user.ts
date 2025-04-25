import { createInsertSchema } from "drizzle-zod";
import { users } from "../../server/database/schema";
import { z } from "zod";

// Shared registration schema (server + client safe)
export const registerSchema = createInsertSchema(users, {
  email: z.string().email(),
  passwordHash: z.string().min(8),
})
  .extend({ password: z.string().min(8) }) // plain-text password
  .omit({ passwordHash: true });

export type RegisterInput = z.infer<typeof registerSchema>;
