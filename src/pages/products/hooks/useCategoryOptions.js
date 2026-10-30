import { useEffect, useState } from "react";

import categoryService from "@/pages/categories/services/categoryService";

/**
 * Fetches the category list once for use in Product's category <Select>
 * (form + toolbar filter). Reuses the Category module's own service instead
 * of duplicating fetch logic here.
 */
export default function useCategoryOptions() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    categoryService
      .getCategories({ page: 1, limit: 100, isActive: "true", sortBy: "sortOrder", sortDir: "asc" })
      .then((result) => {
        if (isMounted) {
          setCategories(result.items);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, loading };
}
