import api from "@/services/api";

function toQueryParams({ page, limit, search, isActive, sortBy, sortDir }) {
  const params = { page, limit, sortBy, sortDir };

  if (search) {
    params.search = search;
  }

  if (isActive !== "all" && isActive !== undefined) {
    params.isActive = isActive;
  }

  return params;
}

export const categoryService = {
  async getCategories(query) {
    const response = await api.get("/categories", {
      params: toQueryParams(query),
    });

    return {
      items: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getCategoryById(id) {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  async createCategory(data) {
    const response = await api.post("/categories", data);
    return response.data.data;
  },

  async updateCategory(id, data) {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  },

  async updateCategoryStatus(id, isActive) {
    const response = await api.patch(`/categories/${id}/status`, { isActive });
    return response.data.data;
  },

  async deleteCategory(id) {
    await api.delete(`/categories/${id}`);
    return id;
  },
};

export default categoryService;
