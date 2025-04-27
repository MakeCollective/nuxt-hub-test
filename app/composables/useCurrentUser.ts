import { currentUserSchema, type CurrentUser } from "~~/lib/validation/user";

export const useCurrentUser = async () => {
  const user = useState<CurrentUser | null>("current-user");
  // If our user is already set, return it
  if (user.value) return user;

  // On the server we can use the event context (this is set in /server/middleware/auth.global.ts)
  if (import.meta.server) {
    const event = useRequestEvent();
    const authUser = (event?.context.authUser as CurrentUser) || undefined;

    if (authUser) {
      user.value = authUser;
    }
  }

  // On the client we can refresh with our refershCurrentUser function (see below)
  if (import.meta.client && !user.value) {
    await refreshCurrentUser();
  }

  return user;
};

export function clearCurrentUser() {
  const user = useState<CurrentUser | null>("current-user");
  user.value = null;
}

export async function refreshCurrentUser() {
  const user = useState<CurrentUser | null>("current-user");
  try {
    const res = await $fetch<CurrentUser | null>("/api/auth/me", {
      credentials: "include",
    });
    const parsed = currentUserSchema.safeParse(res);
    if (parsed.success) {
      user.value = parsed.data;
    } else {
      user.value = null;
    }
  } catch {
    user.value = null;
  }
}
