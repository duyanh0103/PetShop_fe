import api from "./api";

const toItemsPayload = (items) =>
  items.map(({ productId, quantity }) => ({ productId, quantity }));

export const orderService = {
  // Server-side pricing for the cart; works without login.
  async quote(items) {
    const response = await api.post("/orders/quote", { items: toItemsPayload(items) });
    return response.data.data;
  },

  // payload: { shippingName, shippingPhone, shippingAddress, note, expectedTotal }
  async create(items, payload) {
    const response = await api.post("/orders", { ...payload, items: toItemsPayload(items) });
    return response.data.data;
  },

  async getMine(params = {}) {
    const response = await api.get("/orders/me", { params });

    return {
      items: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getMineById(id) {
    const response = await api.get(`/orders/me/${id}`);
    return response.data.data;
  },

  async cancelMine(id) {
    const response = await api.patch(`/orders/me/${id}/cancel`);
    return response.data.data;
  },
};

export default orderService;
