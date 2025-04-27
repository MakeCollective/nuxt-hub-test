import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "../../server/database/schema";
import { z } from "zod";

// Shared registration schema (server + client safe)
export const registerSchema = createInsertSchema(users, {
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  passwordHash: z.string().min(8),
})
  .extend({ password: z.string().min(8) }) // plain-text password
  .omit({ passwordHash: true });

export const currentUserSchema = createSelectSchema(users, {}).pick({
  id: true,
  firstName: true,
  lastName: true,
  email: true,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type CurrentUser = z.infer<typeof currentUserSchema>;
