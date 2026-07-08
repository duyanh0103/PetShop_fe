import { products } from "@/data/products";

import ProductToolbar from "./components/ProductToolbar";
import ProductTable from "./components/ProductTable";
import ProductPagination from "./components/ProductPagination";

export default function Products() {
  return (
    <div className="space-y-6">

      <ProductToolbar />

      <ProductTable products={products} />

      <ProductPagination />

    </div>
  );
}