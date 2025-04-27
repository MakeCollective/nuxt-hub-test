import { clearCurrentUser, refreshCurrentUser } from "./useCurrentUser.js";
export const useAuth = () => {
  const login = async (email: string, password: string) => {
    try {
      await $fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        body: { email, password },
      });
      await refreshCurrentUser();
      await navigateTo("/dashboard");
    } catch (err) {
      console.error("Login request failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await $fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      clearCurrentUser();
      await navigateTo("/login");
    }
  };

  return {
    login,
    logout,
  };
};
