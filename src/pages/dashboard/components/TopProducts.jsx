import { Card } from "@/components/ui/Card";

function TopProducts({ products }) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Top Selling Products</h2>
        <p className="mt-2 text-sm text-slate-500">Fastest moving items this week.</p>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.name} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
            <div>
              <p className="font-semibold text-slate-900">{product.name}</p>
              <p className="text-sm text-slate-500">{product.sku}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">{product.sold} sold</p>
              <p className="text-sm text-slate-500">Stock {product.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default TopProducts;
