import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

// CUID2-based ID field
const cuid = () =>
  text("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => createId());

// Users table
export const users = sqliteTable("users", {
  id: cuid(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .default(Math.floor(Date.now() / 1000)),
  updatedAt: integer("updated_at"),
});

// Password reset tokens
export const passwordResets = sqliteTable("password_resets", {
  id: cuid(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires").notNull(),
});
