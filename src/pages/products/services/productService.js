import api from "@/services/api";

function toQueryParams({ page, limit, search, categoryId, isActive, sortBy, sortDir }) {
  const params = { page, limit, sortBy, sortDir };

  if (search) {
    params.search = search;
  }

  if (categoryId && categoryId !== "all") {
    params.categoryId = categoryId;
  }

  if (isActive !== "all" && isActive !== undefined) {
    params.isActive = isActive;
  }

  return params;
}

export const productService = {
  async getProducts(query) {
    const response = await api.get("/products", {
      params: toQueryParams(query),
    });

    return {
      items: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  async createProduct(data) {
    const response = await api.post("/products", data);
    return response.data.data;
  },

  async updateProduct(id, data) {
    const response = await api.put(`/products/${id}`, data);
    return response.data.data;
  },

  async updateProductStatus(id, isActive) {
    const response = await api.patch(`/products/${id}/status`, { isActive });
    return response.data.data;
  },

  async deleteProduct(id) {
    await api.delete(`/products/${id}`);
    return id;
  },
};

export default productService;
