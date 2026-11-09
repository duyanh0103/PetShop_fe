import { Link } from "react-router-dom";

import OrderStatusBadge from "@/components/store/OrderStatusBadge";
import { ErrorState } from "@/components/store/ProductGrid";
import useRemoteData from "@/hooks/useRemoteData";
import { formatDateTime, formatPrice } from "@/lib/format";
import { ORDER_STATUS_OPTIONS } from "@/lib/orderStatus";
import adminService from "@/services/adminService";

import StatCard from "./components/StatCard";

function Panel({ title, children }) {
  return (
    <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function EmptyText({ children }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>;
}

function DashboardSkeleton() {
  return (
    <div className="grid animate-pulse gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map((key) => (
        <div key={key} className="h-36 rounded-xl bg-muted" />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { data: summary, loading, error, refetch } = useRemoteData(
    "admin-dashboard",
    () => adminService.getDashboardSummary(),
    "Không tải được số liệu tổng quan"
  );

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Doanh thu hôm nay"
          value={formatPrice(summary.revenueToday)}
          detail="Đơn hoàn thành trong hôm nay"
          tone="positive"
          icon="revenue"
        />
        <StatCard
          title="Doanh thu tháng này"
          value={formatPrice(summary.revenueThisMonth)}
          detail="Đơn hoàn thành trong tháng"
          tone="positive"
          icon="revenue"
        />
        <StatCard
          title="Đơn mới hôm nay"
          value={summary.ordersToday}
          detail={`${summary.newCustomersToday} khách mới đăng ký`}
          icon="orders"
        />
        <StatCard
          title="Sản phẩm sắp hết"
          value={summary.lowStockCount}
          detail="Đang bán, còn từ 5 trở xuống"
          tone={summary.lowStockCount > 0 ? "warning" : "neutral"}
          icon="inventory"
        />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.5fr_1fr]">
        <Panel title="Đơn theo trạng thái">
          <ul className="space-y-1">
            {ORDER_STATUS_OPTIONS.map(([status]) => (
              <li key={status}>
                <Link
                  to={`/admin/orders?status=${status}`}
                  className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-muted/50"
                >
                  <OrderStatusBadge status={status} />
                  <span className="font-semibold">{summary.ordersByStatus[status]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Đơn gần đây">
          {summary.recentOrders.length === 0 ? (
            <EmptyText>Chưa có đơn hàng nào</EmptyText>
          ) : (
            <ul className="space-y-1">
              {summary.recentOrders.map((order) => (
                <li key={order.id}>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg p-2 text-sm hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{order.code}</p>
                      <p className="truncate text-muted-foreground">
                        {order.shippingName} · {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="shrink-0 space-y-1 text-right">
                      <p className="font-medium">{formatPrice(order.total)}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Sản phẩm sắp hết">
          {summary.lowStockProducts.length === 0 ? (
            <EmptyText>Tồn kho đang ổn</EmptyText>
          ) : (
            <ul className="space-y-1">
              {summary.lowStockProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3 p-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="truncate text-muted-foreground">SKU {product.sku}</p>
                  </div>
                  <span className={product.quantity === 0 ? "shrink-0 font-semibold text-destructive" : "shrink-0 font-semibold"}>
                    {product.quantity === 0 ? "Hết hàng" : `Còn ${product.quantity}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
