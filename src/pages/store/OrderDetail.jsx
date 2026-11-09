import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import logoSmall from "@/assets/brand/logo-128.webp";
import PawIcon from "@/components/brand/PawIcon";
import OrderStatusBadge from "@/components/store/OrderStatusBadge";
import OrderSummary from "@/components/store/OrderSummary";
import { EmptyState, ErrorState } from "@/components/store/ProductGrid";
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
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import { cn } from "@/lib/utils";
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
          <DialogTitle>Huỷ đơn {order.code}?</DialogTitle>
          <DialogDescription>
            Đơn sẽ dừng xử lý và không thể khôi phục. Bạn có thể đặt lại bất cứ lúc nào.
          </DialogDescription>
        </DialogHeader>
        <ServerError message={errorMessage} />
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={submitting}>
            Giữ đơn
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={submitting}>
            {submitting ? "Đang huỷ..." : "Huỷ đơn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const STEPS = ["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED"];

// Four bars filled up to the current status; a cancelled order greys the first.
function StatusSteps({ status }) {
  const cancelled = status === "CANCELLED";
  const current = STEPS.indexOf(status);

  return (
    <ol className="flex flex-wrap gap-2 rounded-3xl border-[1.5px] border-border bg-card p-5" aria-label="Tiến trình đơn hàng">
      {STEPS.map((step, index) => {
        const reached = !cancelled && index <= current;
        const isCurrent = cancelled ? index === 0 : index === current;

        return (
          <li
            key={step}
            className="flex flex-[1_1_140px] flex-col gap-2"
            aria-current={isCurrent ? "step" : undefined}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-2 rounded-full",
                cancelled && index === 0 ? "bg-[#9aa6b8]" : reached ? "bg-primary" : "bg-pastel"
              )}
            />
            <span className={cn("text-sm", isCurrent ? "font-extrabold text-foreground" : "font-semibold text-muted-foreground")}>
              {cancelled && index === 0 ? ORDER_STATUS_LABELS.CANCELLED : ORDER_STATUS_LABELS[step]}
            </span>
          </li>
        );
      })}
    </ol>
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
    return <div className="skeleton mx-auto h-96 max-w-[1000px] rounded-3xl" />;
  }

  if (error?.status === 404) {
    return (
      <EmptyState
        title="Không tìm thấy đơn hàng"
        action={
          <Button asChild variant="outline">
            <Link to="/orders">Về danh sách đơn hàng</Link>
          </Button>
        }
      />
    );
  }

  if (error) return <ErrorState title="Không tải được đơn hàng" message={error.message} onRetry={refetch} />;

  return (
    <div className="mx-auto flex max-w-[1000px] flex-col gap-[18px]">
      {location.state?.justPlaced && order.status === "PENDING" ? (
        <div role="status" className="flex flex-wrap items-center gap-[18px] rounded-[28px] bg-pastel px-6 py-[22px]">
          <img src={logoSmall} alt="" width={92} height={92} className="object-contain" />
          <div className="flex-[1_1_300px]">
            <h1 className="text-[30px]">Đặt hàng thành công!</h1>
            <p className="mt-1 text-body">Cục Meow sẽ gọi xác nhận sớm. Bạn chuẩn bị tiền mặt khi nhận hàng nhé.</p>
          </div>
          <Button asChild>
            <Link to="/products">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      ) : null}

      <Link to="/orders" className="text-sm font-bold text-primary hover:underline">
        ‹ Đơn của tôi
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[28px]">Đơn {order.code}</h2>
          <p className="mt-0.5 text-muted-foreground">Đặt lúc {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <OrderStatusBadge status={order.status} />
          {order.status === "PENDING" ? (
            <Button variant="outline-destructive" onClick={() => setCancelOpen(true)}>
              Huỷ đơn
            </Button>
          ) : null}
        </div>
      </div>

      <StatusSteps status={order.status} />

      <div className="flex flex-wrap items-start gap-[18px]">
        <section className="flex min-w-0 flex-[999_1_460px] flex-col gap-3.5 rounded-3xl border-[1.5px] border-border bg-card p-5">
          <h3 className="text-xl">Sản phẩm</h3>
          <ul className="flex flex-col gap-3.5">
            {order.items.map((item) => {
              const gone = !item.productId;
              const detail = (
                <>
                  {item.productName}
                  <br />
                  <span className="text-sm font-semibold text-muted-foreground">
                    {formatPrice(item.unitPrice)} × {item.quantity}
                    {gone ? " · Sản phẩm đã ngừng bán" : ""}
                  </span>
                </>
              );

              return (
                <li key={item.id} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-14 shrink-0 items-center justify-center rounded-xl",
                      gone ? "bg-status-cancelled text-status-cancelled-foreground" : "bg-tile text-tile-icon"
                    )}
                  >
                    <PawIcon size={22} />
                  </span>
                  {gone ? (
                    <span className="min-w-0 flex-1 leading-snug font-bold text-status-cancelled-foreground">{detail}</span>
                  ) : (
                    <Link to={`/products/${item.productId}`} className="min-w-0 flex-1 leading-snug font-bold text-foreground hover:underline">
                      {detail}
                    </Link>
                  )}
                  <b className="whitespace-nowrap">{formatPrice(item.lineTotal)}</b>
                </li>
              );
            })}
          </ul>
          <OrderSummary
            subtotal={order.subtotal}
            shippingFee={order.shippingFee}
            total={order.total}
            totalLabel="Tổng cộng (COD)"
          />
        </section>

        <section className="flex flex-[1_1_280px] flex-col gap-2.5 rounded-3xl border-[1.5px] border-border bg-card p-5">
          <h3 className="text-xl">Giao hàng</h3>
          <p className="leading-relaxed">
            <b>{order.shippingName}</b>
            <br />
            {order.shippingPhone}
            <br />
            {order.shippingAddress}
          </p>
          {order.note ? (
            <p className="rounded-xl bg-muted px-3 py-2.5 text-sm">
              <b>Ghi chú:</b> {order.note}
            </p>
          ) : null}
          <p className="text-sm text-muted-foreground">Thanh toán khi nhận hàng</p>
        </section>
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
