import axios from "axios";

import useAuthStore from "@/store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Attach the JWT (if any) to every outgoing request.
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// A 401 means the token is missing/expired/invalid — clear local auth state
// and send the user to the login page of the area they are in. A 401 from the
// login call itself is just wrong credentials and is left to the form.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url === "/auth/login";

    if (error.response?.status === 401 && !isLoginRequest) {
      useAuthStore.getState().logout();

      if (typeof window !== "undefined") {
        const loginPath = window.location.pathname.startsWith("/admin")
          ? "/admin/login"
          : "/login";

        if (window.location.pathname !== loginPath) {
          window.location.href = loginPath;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
