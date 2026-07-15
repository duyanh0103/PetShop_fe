import { products as mockProducts } from "@/data/products";

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeProductPayload(data) {
  return {
    ...data,
    id: data.id ?? Date.now(),
  };
}

export const productService = {
  async getProducts() {
    await delay();
    return Promise.resolve(mockProducts);
  },

  async getProductById(id) {
    await delay();
    const product = mockProducts.find((item) => item.id === Number(id));

    return Promise.resolve(product ?? null);
  },

  async createProduct(data) {
    await delay();
    return Promise.resolve(data);
  },

  async updateProduct(id, data) {
    await delay();
    const existingProduct = mockProducts.find((item) => item.id === Number(id));

    if (!existingProduct) {
      return Promise.resolve(null);
    }

    const updatedProduct = {
      ...existingProduct,
      ...data,
      id: Number(id),
      createdAt: existingProduct.createdAt ?? null,
    };

    return Promise.resolve(updatedProduct);
  },

  async deleteProduct(id) {
    await delay();
    const idx = mockProducts.findIndex((item) => item.id === Number(id));

    if (idx === -1) {
      return Promise.resolve(null);
    }

    // remove the product from the in-memory list (mock)
    const [removed] = mockProducts.splice(idx, 1);

    // return removed id for confirmation
    return Promise.resolve(removed.id);
  },  
};

export default productService;
