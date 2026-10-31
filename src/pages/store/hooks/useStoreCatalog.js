import useRemoteData from "@/hooks/useRemoteData";
import publicService from "@/services/publicService";

export function usePublicCategories() {
  const { data, ...rest } = useRemoteData("public-categories", () =>
    publicService.getCategories()
  );

  return { categories: data ?? [], ...rest };
}

export function usePublicProducts(params) {
  const { data, ...rest } = useRemoteData(JSON.stringify(params), () =>
    publicService.getProducts(params)
  );

  return {
    products: data?.items ?? [],
    pagination: data?.pagination ?? { page: 1, total: 0, totalPages: 1 },
    ...rest,
  };
}

export function usePublicProduct(id) {
  const { data, ...rest } = useRemoteData(`public-product:${id}`, () =>
    publicService.getProductById(id)
  );

  return { product: data, ...rest };
}
