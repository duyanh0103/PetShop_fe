import api from "./api";

// Storefront catalog endpoints (no auth required, only active records).
export const publicService = {
  async getCategories() {
    const response = await api.get("/public/categories");
    return response.data.data;
  },

  // params: { categorySlug, search, sort, page, limit }
  async getProducts(params = {}) {
    const query = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
    );
    const response = await api.get("/public/products", { params: query });

    return {
      items: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getProductById(id) {
    const response = await api.get(`/public/products/${id}`);
    return response.data.data;
  },
};

export default publicService;
