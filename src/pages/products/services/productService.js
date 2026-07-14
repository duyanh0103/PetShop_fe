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
    return Promise.resolve(Boolean(mockProducts.find((item) => item.id === Number(id))));
  },  
};

export default productService;
