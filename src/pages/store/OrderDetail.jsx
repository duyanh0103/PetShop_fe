import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

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
import useRemoteData from "@/hooks/useRemoteData";
import { formatDateTime, formatPrice } from "@/lib/format";
import orderService from "@/services/orderService";

import { ServerError } from "./auth/AuthCard";

function CancelOrderDialog({ order, open, onOpenChange, onCancelled }) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleConfirm = async () => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      await orderService.cancelMine(order.id);
      onOpenChange(false);
      onCancelled();
    } catch (error) {
      setErrorMessage(error.response?.data?.message ?? "Không huỷ được đơn hàng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Huỷ đơn hàng</DialogTitle>
          <DialogDescription>Bạn có chắc muốn huỷ đơn {order.code}? Không thể hoàn tác thao tác này.</DialogDescription>
        </DialogHeader>
        <ServerError message={errorMessage} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Giữ đơn hàng
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={submitting}>
            {submitting ? "Đang huỷ..." : "Huỷ đơn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [cancelOpen, setCancelOpen] = useState(false);

  const { data: order, loading, error, refetch } = useRemoteData(
    `my-order:${id}`,
    () => orderService.getMineById(id),
    "Không tải được đơn hàng"
  );

  if (loading) {
    return <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-xl bg-muted" />;
  }

  if (error?.status === 404) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">Không tìm thấy đơn hàng</p>
        <Button asChild variant="outline">
          <Link to="/orders">Về danh sách đơn hàng</Link>
        </Button>
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {location.state?.justPlaced && order.status === "PENDING" ? (
        <p role="status" className="flex items-center gap-2 rounded-xl bg-green-100 p-4 text-sm font-medium text-green-800 dark:bg-green-950 dark:text-green-300">
          <CheckCircle2 className="size-5 shrink-0" />
          Đặt hàng thành công! Shop sẽ liên hệ để xác nhận đơn.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Đơn {order.code}</h1>
          <p className="text-sm text-muted-foreground">Đặt lúc {formatDateTime(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <section className="space-y-1 rounded-xl border border-border p-4 text-sm">
        <h2 className="mb-2 font-semibold">Thông tin giao hàng</h2>
        <p>{order.shippingName} · {order.shippingPhone}</p>
        <p className="text-muted-foreground">{order.shippingAddress}</p>
        {order.note ? <p className="text-muted-foreground">Ghi chú: {order.note}</p> : null}
        <p className="pt-2 text-muted-foreground">Thanh toán khi nhận hàng (COD)</p>
      </section>

      <section className="rounded-xl border border-border">
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 p-4 text-sm">
              <div className="min-w-0">
                {item.productId ? (
                  <Link to={`/products/${item.productId}`} className="font-medium hover:underline">
                    {item.productName}
                  </Link>
                ) : (
                  <span className="font-medium">{item.productName}</span>
                )}
                <p className="text-muted-foreground">
                  {formatPrice(item.unitPrice)} × {item.quantity}
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

      <div className="flex flex-wrap justify-between gap-3">
        <Button asChild variant="outline">
          <Link to="/orders">Về danh sách đơn hàng</Link>
        </Button>
        {order.status === "PENDING" ? (
          <Button variant="destructive" onClick={() => setCancelOpen(true)}>
            Huỷ đơn
          </Button>
        ) : null}
      </div>

      <CancelOrderDialog
        order={order}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onCancelled={refetch}
      />
    </div>
  );
}
