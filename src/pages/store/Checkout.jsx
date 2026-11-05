import { useState } from "react";
import { Banknote } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";

import OrderSummary from "@/components/store/OrderSummary";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { zodResolver } from "@/lib/zodResolver";
import orderService from "@/services/orderService";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";

import { FormField, ServerError } from "./auth/AuthCard";
import checkoutSchema from "./checkoutSchema";
import useCartQuote from "./hooks/useCartQuote";

const FORM_FIELDS = new Set(["shippingName", "shippingPhone", "shippingAddress", "note"]);

export default function Checkout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const { quote, updating, error, refetch } = useCartQuote(items);
  const [serverError, setServerError] = useState("");
  // Emptying the cart on success must not trigger the empty-cart redirect below.
  const [placed, setPlaced] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingName: user?.fullName ?? "",
      shippingPhone: user?.phone ?? "",
      shippingAddress: "",
      note: "",
    },
    mode: "onTouched",
  });

  if (items.length === 0 && !placed) {
    return <Navigate to="/cart" replace />;
  }

  const canSubmit = Boolean(quote?.canCheckout) && !updating && !error && !isSubmitting && !placed;

  const onSubmit = async (values) => {
    setServerError("");

    try {
      const order = await orderService.create(items, { ...values, expectedTotal: quote.total });
      setPlaced(true);
      clearCart();
      navigate(`/orders/${order.id}`, { replace: true, state: { justPlaced: true } });
    } catch (submitError) {
      const data = submitError.response?.data;

      if (data?.errors) {
        Object.entries(data.errors).forEach(([field, messages]) => {
          if (FORM_FIELDS.has(field)) setError(field, { message: messages[0] });
        });
      }

      setServerError(data?.message ?? "Đặt hàng thất bại. Vui lòng thử lại.");

      // Price or stock moved under the customer: show them the current numbers.
      if (submitError.response?.status === 409) refetch();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <h1 className="text-2xl font-semibold">Thanh toán</h1>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section className="space-y-4 rounded-xl border border-border p-4 sm:p-6">
            <h2 className="font-semibold">Thông tin giao hàng</h2>
            <FormField
              id="shippingName"
              label="Họ tên người nhận"
              autoComplete="name"
              error={errors.shippingName}
              registration={register("shippingName")}
            />
            <FormField
              id="shippingPhone"
              label="Số điện thoại"
              type="tel"
              autoComplete="tel"
              error={errors.shippingPhone}
              registration={register("shippingPhone")}
            />
            <FormField
              id="shippingAddress"
              label="Địa chỉ giao hàng"
              autoComplete="street-address"
              error={errors.shippingAddress}
              registration={register("shippingAddress")}
            />
            <FormField
              id="note"
              label="Ghi chú (không bắt buộc)"
              error={errors.note}
              registration={register("note")}
            />
          </section>

          <section className="flex items-center gap-3 rounded-xl border border-border p-4 sm:p-6">
            <Banknote className="size-5 shrink-0 text-muted-foreground" />
            <div>
              <h2 className="text-sm font-semibold">Thanh toán khi nhận hàng (COD)</h2>
              <p className="text-sm text-muted-foreground">Bạn trả tiền mặt cho nhân viên giao hàng.</p>
            </div>
          </section>
        </div>

        <aside className="space-y-4 rounded-xl border border-border p-4 lg:sticky lg:top-20">
          <h2 className="font-semibold">Đơn hàng</h2>

          {quote ? (
            <>
              <ul className="space-y-2 text-sm">
                {quote.items.map((line) => (
                  <li key={line.productId} className="flex justify-between gap-3">
                    <span className="min-w-0 text-muted-foreground">
                      {line.name ?? "Sản phẩm không còn bán"} × {line.quantity}
                    </span>
                    <span className="shrink-0">{formatPrice(line.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border pt-3">
                <OrderSummary subtotal={quote.subtotal} shippingFee={quote.shippingFee} total={quote.total} />
              </div>
            </>
          ) : (
            <div className="h-32 animate-pulse rounded-lg bg-muted" />
          )}

          {error ? (
            <div className="space-y-2">
              <ServerError message={error.message} />
              <Button type="button" variant="outline" className="w-full" onClick={refetch}>
                Thử lại
              </Button>
            </div>
          ) : null}

          {quote && !quote.canCheckout && !updating ? (
            <p className="text-sm text-destructive">
              Một số sản phẩm không đủ hàng.{" "}
              <Link to="/cart" className="font-medium underline underline-offset-4">
                Quay lại giỏ hàng
              </Link>
            </p>
          ) : null}

          <ServerError message={serverError} />

          <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
            {isSubmitting
              ? "Đang đặt hàng..."
              : `Xác nhận đặt hàng${quote && canSubmit ? ` · ${formatPrice(quote.total)}` : ""}`}
          </Button>
        </aside>
      </div>
    </form>
  );
}
