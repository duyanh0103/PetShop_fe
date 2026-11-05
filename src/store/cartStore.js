import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_LINE_QUANTITY = 999;

/**
 * Cart store, persisted so it survives a refresh and works before login.
 * Prices are deliberately not kept here: the cart and checkout always show
 * what the server quotes (see useCartQuote).
 */
const useCartStore = create(
  persist(
    (set) => ({
      // [{ productId, name, imageUrl, quantity }]
      items: [],

      addItem: (product, quantity = 1) =>
        set(({ items }) => {
          const limit = Math.min(product.quantity, MAX_LINE_QUANTITY);
          const existing = items.find((item) => item.productId === product.id);

          if (existing) {
            return {
              items: items.map((item) =>
                item === existing
                  ? { ...item, quantity: Math.min(item.quantity + quantity, limit) }
                  : item
              ),
            };
          }

          return {
            items: [
              ...items,
              {
                productId: product.id,
                name: product.name,
                imageUrl: product.imageUrl,
                quantity: Math.min(quantity, limit),
              },
            ],
          };
        }),

      setQuantity: (productId, quantity) =>
        set(({ items }) => ({
          items: items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(Math.max(quantity, 1), MAX_LINE_QUANTITY) }
              : item
          ),
        })),

      removeItem: (productId) =>
        set(({ items }) => ({
          items: items.filter((item) => item.productId !== productId),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: "petshop-cart" }
  )
);

export const selectCartCount = (state) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export default useCartStore;
