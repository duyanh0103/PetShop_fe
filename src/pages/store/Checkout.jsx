import { useState } from "react";
import { Banknote } from "lucide-react";
import PawIcon from "@/components/brand/PawIcon";
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
  // A 409 means price or stock moved; the design shows that as a yellow notice up top.
  const [quoteChanged, setQuoteChanged] = useState(false);
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
    setQuoteChanged(false);

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

      // Price or stock moved under the customer: show them the current numbers.
      if (submitError.response?.status === 409) {
        setQuoteChanged(true);
        refetch();
      } else {
        setServerError(data?.message ?? "Đặt hàng thất bại. Vui lòng thử lại.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" noValidate>
      <Link to="/cart" className="text-sm font-bold text-primary hover:underline">
        ‹ Quay lại giỏ hàng
      </Link>
      <h1 className="mt-2 mb-5 text-[34px]">Thanh toán</h1>

      {quoteChanged ? (
        <div
          role="alert"
          className="mb-5 rounded-2xl border-[1.5px] border-warning-border bg-warning-soft px-4 py-3.5 leading-normal font-bold text-warning-text"
        >
          Giá hoặc tồn kho vừa thay đổi. Shop đã cập nhật số mới bên dưới — bạn kiểm tra lại rồi xác nhận nhé.
        </div>
      ) : null}

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-5">
          <section className="flex flex-col gap-3.5 rounded-3xl border-[1.5px] border-border bg-card p-5">
            <h2 className="text-[22px]">Thông tin giao hàng</h2>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <FormField
                id="shippingName"
                label="Họ tên"
                autoComplete="name"
                error={errors.shippingName}
                registration={register("shippingName")}
              />
              <FormField
                id="shippingPhone"
                label="Số điện thoại"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                error={errors.shippingPhone}
                registration={register("shippingPhone")}
              />
            </div>
            <FormField
              id="shippingAddress"
              label="Địa chỉ nhận hàng"
              autoComplete="street-address"
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              error={errors.shippingAddress}
              registration={register("shippingAddress")}
            />
            <FormField
              id="note"
              label="Ghi chú"
              hint="(không bắt buộc)"
              multiline
              placeholder="Ví dụ: gọi trước khi giao"
              error={errors.note}
              registration={register("note")}
            />
          </section>

          <section className="flex items-center gap-3.5 rounded-3xl bg-pastel p-5">
            <span className="flex size-[52px] shrink-0 items-center justify-center rounded-2xl bg-card text-primary">
              <Banknote className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-sans text-[17px] font-bold">Thanh toán khi nhận hàng (COD)</h2>
              <p className="mt-1 text-body">Bạn trả tiền mặt cho shipper khi nhận được hàng. Không cần nhập thẻ.</p>
            </div>
          </section>
        </div>

        <aside className="flex flex-[1_1_340px] flex-col gap-3 rounded-3xl border-[1.5px] border-border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="text-[22px]">Tóm tắt đơn</h2>

          {quote ? (
            <>
              <ul className="flex flex-col gap-3 text-sm">
                {quote.items.map((line) => {
                  const cartItem = items.find((item) => item.productId === line.productId);

                  return (
                    <li key={line.productId} className="flex items-start gap-3">
                      <span className="relative size-12 shrink-0 rounded-xl bg-tile">
                        {cartItem?.imageUrl ? (
                          <img src={cartItem.imageUrl} alt="" className="h-full w-full rounded-xl object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-tile-icon">
                            <PawIcon size={20} />
                          </span>
                        )}
                        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-[#13306e] px-1.5 text-[11px] leading-4 font-extrabold text-white">
                          {line.quantity}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1 leading-snug">{line.name ?? "Sản phẩm không còn bán"}</span>
                      <b className="whitespace-nowrap">{formatPrice(line.lineTotal)}</b>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t-[1.5px] border-border pt-3">
                <OrderSummary subtotal={quote.subtotal} shippingFee={quote.shippingFee} total={quote.total} />
              </div>
            </>
          ) : (
            <div className="skeleton h-40" />
          )}

          {error ? (
            <div className="flex flex-col gap-2">
              <ServerError message={error.message} />
              <Button type="button" variant="outline" className="w-full" onClick={refetch}>
                Thử lại
              </Button>
            </div>
          ) : null}

          {quote && !quote.canCheckout && !updating ? (
            <p className="text-sm font-bold text-danger-text">
              Một số sản phẩm không đủ hàng.{" "}
              <Link to="/cart" className="underline underline-offset-4">
                Quay lại giỏ hàng
              </Link>
            </p>
          ) : null}

          <ServerError message={serverError} />

          <Button type="submit" size="lg" className="h-14 w-full text-[17px] whitespace-normal" disabled={!canSubmit}>
            {isSubmitting
              ? "Đang đặt hàng..."
              : `Xác nhận đặt hàng${quote && canSubmit ? ` · ${formatPrice(quote.total)}` : ""}`}
          </Button>
        </aside>
      </div>
    </form>
  );
}
