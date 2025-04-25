// Define the User type
export interface CurrentUser {
  id: string;
  email: string;
}

// 2. Main composable
export const useCurrentUser = () => {
  // Explicitly type the useState
  const user = useState<CurrentUser | null>("current-user", () => null);

  if (import.meta.server) {
    const event = useRequestEvent();
    const userId = event?.context.userId;

    if (userId) {
      // Optionally, fetch the full user here from your db
      // For now, we set a placeholder (could enhance later)
      user.value = { id: userId, email: "" };
    }
  }

  if (import.meta.client && !user.value) {
    useFetch<CurrentUser | null>("/api/auth/me", {
      credentials: "include",
      key: "current-user", // important for client cache
      onResponse({ response }) {
        user.value = response._data;
      },
      onRequestError() {
        user.value = null;
      },
      onResponseError() {
        user.value = null;
      },
    });
  }

  return user;
};
