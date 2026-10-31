import api from "./api";

export const authService = {
  // credentials: { identifier (email or username), password }
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data.data; // { user, token }
  },

  // payload: { fullName, email, username, phone?, password }
  async register(payload) {
    const response = await api.post("/auth/register", payload);
    return response.data.data; // { user, token }
  },

  async getCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data.data; // { id, username, email, fullName, phone, role, createdAt }
  },
};

export default authService;
