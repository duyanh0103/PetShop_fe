import { ReceiptText } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import OrderStatusBadge from "@/components/store/OrderStatusBadge";
import { EmptyState, ErrorState } from "@/components/store/ProductGrid";
import SimplePagination from "@/components/store/SimplePagination";
import { Button } from "@/components/ui/button";
import useRemoteData from "@/hooks/useRemoteData";
import { formatDateTime, formatPrice } from "@/lib/format";
import orderService from "@/services/orderService";

// "Pate … ×4 và 2 sản phẩm khác": the first line, then how many more.
function itemsSummary(items) {
  if (items.length === 0) return "";
  const [first, ...rest] = items;
  const head = `${first.productName} ×${first.quantity}`;
  return rest.length ? `${head} và ${rest.length} sản phẩm khác` : head;
}

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const { data, loading, error, refetch } = useRemoteData(
    `my-orders:${page}`,
    () => orderService.getMine({ page }),
    "Không tải được danh sách đơn hàng"
  );

  return (
    <div className="mx-auto flex max-w-[880px] flex-col gap-3.5">
      <h1 className="mb-1.5 text-[34px]">Đơn của tôi</h1>

      {loading ? (
        [0, 1, 2].map((key) => <div key={key} className="skeleton h-[120px] rounded-[20px]" />)
      ) : error ? (
        <ErrorState title="Không tải được đơn hàng" message={error.message} onRetry={refetch} />
      ) : data.items.length === 0 ? (
        <EmptyState
          icon={<ReceiptText className="size-7" />}
          title="Bạn chưa có đơn hàng nào"
          message="Chọn vài món ngon cho bé rồi quay lại đây xem đơn nhé."
          action={
            <Button asChild>
              <Link to="/products">Mua sắm ngay</Link>
            </Button>
          }
        />
      ) : (
        <>
          <ul className="flex flex-col gap-3.5">
            {data.items.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/orders/${order.id}`}
                  className="flex flex-col gap-2.5 rounded-[20px] border-[1.5px] border-border bg-card px-[18px] py-4 text-foreground transition-colors hover:border-[#8cc2fa] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <b>{order.code}</b>
                      <span className="text-sm text-muted-foreground"> · {formatDateTime(order.createdAt)}</span>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t-[1.5px] border-dashed border-border pt-2.5">
                    <span className="min-w-0 flex-[1_1_280px] text-sm text-body">{itemsSummary(order.items)}</span>
                    <b className="text-[17px] text-primary">{formatPrice(order.total)}</b>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <SimplePagination
            className="mt-2"
            page={page}
            totalPages={data.pagination.totalPages}
            onPageChange={(nextPage) => setSearchParams(nextPage > 1 ? { page: String(nextPage) } : {})}
          />
        </>
      )}
    </div>
  );
}
