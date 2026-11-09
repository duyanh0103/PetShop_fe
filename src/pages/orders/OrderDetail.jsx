import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import OrderStatusBadge from "@/components/store/OrderStatusBadge";
import OrderSummary from "@/components/store/OrderSummary";
import { ErrorState } from "@/components/store/ProductGrid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import useRemoteData from "@/hooks/useRemoteData";
import { formatDateTime, formatPrice } from "@/lib/format";
import useAuthStore from "@/store/authStore";
import adminService from "@/services/adminService";

// Which statuses are reachable comes from the API (allowedStatuses); this only says how to show them.
const ACTIONS = {
  CONFIRMED: { label: "Xác nhận đơn" },
  SHIPPING: { label: "Bắt đầu giao" },
  COMPLETED: {
    label: "Hoàn thành",
    confirm: {
      title: "Hoàn thành đơn hàng",
      description: "Xác nhận khách đã nhận hàng và đã thanh toán. Đơn sẽ được tính vào doanh thu và không đổi được nữa.",
    },
  },
  CANCELLED: {
    label: "Huỷ đơn",
    variant: "destructive",
    confirm: {
      title: "Huỷ đơn hàng",
      description: "Tồn kho sẽ được cộng lại và không thể hoàn tác thao tác này.",
    },
  },
};

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const canSeeCustomers = useAuthStore((state) => state.user?.role !== "STAFF");
  const [updating, setUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const { data: order, loading, error, refetch } = useRemoteData(
    `admin-order:${id}`,
    () => adminService.getOrder(id),
    "Không tải được đơn hàng"
  );

  const changeStatus = async (status) => {
    setUpdating(true);

    try {
      await adminService.updateOrderStatus(id, status);
      toast({ title: "Đã cập nhật đơn hàng.", description: ACTIONS[status].label });
    } catch (err) {
      toast({
        title: "Không cập nhật được đơn hàng.",
        description: err.response?.data?.message ?? "Vui lòng thử lại.",
      });
    } finally {
      setUpdating(false);
      setPendingStatus(null);
      // Also after a 409: someone else changed the order, so show its real state.
      refetch();
    }
  };

  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl bg-muted" />;
  }

  if (error?.status === 404) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">Không tìm thấy đơn hàng</p>
        <Button asChild variant="outline">
          <Link to="/admin/orders">Về danh sách đơn hàng</Link>
        </Button>
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const pendingAction = pendingStatus ? ACTIONS[pendingStatus] : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          {/* history -1 keeps the list's filters, which live in its URL. */}
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft data-icon="inline-start" />
            Quay lại
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold">{order.code}</h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-muted-foreground">Đặt lúc {formatDateTime(order.createdAt)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {order.allowedStatuses.map((status) => {
            const action = ACTIONS[status];

            return (
              <Button
                key={status}
                size="lg"
                variant={action.variant ?? "default"}
                disabled={updating}
                onClick={() => (action.confirm ? setPendingStatus(status) : changeStatus(status))}
              >
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <section className="rounded-xl border border-border bg-background">
          <ul className="divide-y divide-border">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 p-4 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-muted-foreground">
                    SKU {item.sku} · {formatPrice(item.unitPrice)} × {item.quantity}
                  </p>
                </div>
                <span className="shrink-0 font-medium">{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border p-4">
            <OrderSummary subtotal={order.subtotal} shippingFee={order.shippingFee} total={order.total} />
          </div>
        </section>

        <div className="space-y-4">
          <section className="space-y-1 rounded-xl border border-border bg-background p-4 text-sm">
            <h3 className="mb-2 font-semibold">Giao hàng</h3>
            <p>{order.shippingName}</p>
            <a href={`tel:${order.shippingPhone}`} className="block hover:underline">
              {order.shippingPhone}
            </a>
            <p className="text-muted-foreground">{order.shippingAddress}</p>
            {order.note ? <p className="pt-2">Ghi chú: {order.note}</p> : null}
            <p className="pt-2 text-muted-foreground">Thanh toán khi nhận hàng (COD)</p>
          </section>

          <section className="space-y-1 rounded-xl border border-border bg-background p-4 text-sm">
            <h3 className="mb-2 font-semibold">Tài khoản đặt hàng</h3>
            {canSeeCustomers ? (
              <Link to={`/admin/customers/${order.customer.id}`} className="font-medium hover:underline">
                {order.customer.fullName || order.customer.username}
              </Link>
            ) : (
              <p className="font-medium">{order.customer.fullName || order.customer.username}</p>
            )}
            {order.customer.email ? <p className="text-muted-foreground">{order.customer.email}</p> : null}
          </section>
        </div>
      </div>

      <Dialog open={Boolean(pendingAction)} onOpenChange={(open) => !open && setPendingStatus(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pendingAction?.confirm?.title}</DialogTitle>
            <DialogDescription>
              Đơn {order.code}. {pendingAction?.confirm?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={updating} onClick={() => setPendingStatus(null)}>
              Quay lại
            </Button>
            <Button
              variant={pendingAction?.variant ?? "default"}
              disabled={updating}
              onClick={() => changeStatus(pendingStatus)}
            >
              {updating ? "Đang cập nhật..." : pendingAction?.label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
