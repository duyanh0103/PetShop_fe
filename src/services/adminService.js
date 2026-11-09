import api from "./api";

const withoutEmpty = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  );

const toPage = (response) => ({
  items: response.data.data,
  pagination: response.data.pagination,
});

export const adminService = {
  // params: { page, limit, status, from, to, search }
  async getOrders(params = {}) {
    return toPage(await api.get("/admin/orders", { params: withoutEmpty(params) }));
  },

  async getOrder(id) {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data.data;
  },

  async updateOrderStatus(id, status) {
    const response = await api.patch(`/admin/orders/${id}/status`, { status });
    return response.data.data;
  },

  // params: { page, limit, search, isActive }
  async getCustomers(params = {}) {
    return toPage(await api.get("/admin/customers", { params: withoutEmpty(params) }));
  },

  async getCustomer(id) {
    const response = await api.get(`/admin/customers/${id}`);
    return response.data.data;
  },

  async updateCustomerStatus(id, isActive) {
    const response = await api.patch(`/admin/customers/${id}/status`, { isActive });
    return response.data.data;
  },

  async getDashboardSummary() {
    const response = await api.get("/admin/dashboard/summary");
    return response.data.data;
  },
};

export default adminService;
