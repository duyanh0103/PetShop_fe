import { ReceiptText } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import OrderStatusBadge from "@/components/store/OrderStatusBadge";
import { ErrorState } from "@/components/store/ProductGrid";
import SimplePagination from "@/components/store/SimplePagination";
import { Button } from "@/components/ui/button";
import useRemoteData from "@/hooks/useRemoteData";
import { formatDateTime, formatPrice } from "@/lib/format";
import orderService from "@/services/orderService";

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const { data, loading, error, refetch } = useRemoteData(
    `my-orders:${page}`,
    () => orderService.getMine({ page }),
    "Không tải được danh sách đơn hàng"
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Đơn hàng của tôi</h1>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((key) => (
            <div key={key} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : data.items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <ReceiptText className="size-12 text-muted-foreground" />
          <p className="text-muted-foreground">Bạn chưa có đơn hàng nào</p>
          <Button asChild>
            <Link to="/products">Mua sắm ngay</Link>
          </Button>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {data.items.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/orders/${order.id}`}
                  className="block space-y-2 rounded-xl border border-border p-4 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{order.code}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {order.items.map((item) => `${item.productName} × ${item.quantity}`).join(", ")}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{formatDateTime(order.createdAt)}</span>
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <SimplePagination
            page={page}
            totalPages={data.pagination.totalPages}
            onPageChange={(nextPage) => setSearchParams(nextPage > 1 ? { page: String(nextPage) } : {})}
          />
        </>
      )}
    </div>
  );
}
