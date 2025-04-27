import { z } from "zod";
import { users } from "../../database/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { hubKV } from "#imports"; // NuxtHub's KV composable

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
  const kv = hubKV(); // Access the KV storage

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
  const sid = createId();
  const sessionTTL = 60 * 60 * 24 * 30; // 30 days

  await kv.set(
    `sess:${sid}`,
    {
      userId: user.id,
      createdAt: Date.now(),
    },
    { ttl: sessionTTL },
  );

  // Set session cookie
  setSessionCookie(event, sid, sessionTTL);

  return { success: true };
});
