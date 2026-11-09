import { formatPrice } from "@/lib/format";

// Subtotal / shipping / total block shared by the cart, checkout and order detail.
export default function OrderSummary({ subtotal, shippingFee, total, totalLabel = "Tổng cộng" }) {
  return (
    <dl className="flex flex-col gap-2">
      <div className="flex justify-between gap-3">
        <dt className="text-muted-foreground">Tạm tính</dt>
        <dd className="font-bold">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-muted-foreground">Phí vận chuyển</dt>
        <dd className="font-bold">{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</dd>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-3 border-t-[1.5px] border-dashed border-input pt-3">
        <dt className="font-bold">{totalLabel}</dt>
        <dd className="font-heading text-[26px] font-extrabold text-primary">{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}
