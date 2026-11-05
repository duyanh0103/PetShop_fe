import { formatPrice } from "@/lib/format";

function Row({ label, value, strong = false }) {
  return (
    <div className={strong ? "flex justify-between text-base font-semibold" : "flex justify-between text-sm"}>
      <dt className={strong ? undefined : "text-muted-foreground"}>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

// Subtotal / shipping / total block shared by the cart, checkout and order detail.
export default function OrderSummary({ subtotal, shippingFee, total }) {
  return (
    <dl className="space-y-2">
      <Row label="Tạm tính" value={formatPrice(subtotal)} />
      <Row label="Phí vận chuyển" value={shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)} />
      <div className="border-t border-border pt-2">
        <Row label="Tổng cộng" value={formatPrice(total)} strong />
      </div>
    </dl>
  );
}
