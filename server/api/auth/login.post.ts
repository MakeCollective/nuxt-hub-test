import { z } from "zod";
import { users } from "../../database/schema";
import { eq } from "drizzle-orm";
import { createSession } from "../../utils/session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid input",
      data: parsed.error.flatten(),
    });
  }

  const { email, password } = parsed.data;
  const db = useDrizzle();

  const user = await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase()),
  });

  if (!user) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "No user" }),
    );
  }
  const isValid = await verifyPassword(user.passwordHash, password);
  if (!isValid) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Invalid credentials" }),
    );
  }

  // Generate a secure session ID and store it in KV
  await createSession(event, user.id);

  return { success: true };
});
