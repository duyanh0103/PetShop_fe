import api from "./api";

export const authService = {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data.data; // { user, token }
  },

  async getCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data.data; // { id, username, role, createdAt }
  },
};

export default authService;
