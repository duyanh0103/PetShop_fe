import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import OrderStatusBadge from "@/components/store/OrderStatusBadge";
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
import adminService from "@/services/adminService";

import CustomerStatusBadge from "./components/CustomerStatusBadge";

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { data: customer, loading, error, refetch } = useRemoteData(
    `admin-customer:${id}`,
    () => adminService.getCustomer(id),
    "Không tải được thông tin khách hàng"
  );

  const handleToggle = async () => {
    setUpdating(true);

    try {
      await adminService.updateCustomerStatus(id, !customer.isActive);
      toast({ title: customer.isActive ? "Đã khoá tài khoản." : "Đã mở khoá tài khoản." });
      refetch();
    } catch (err) {
      toast({
        title: "Không cập nhật được tài khoản.",
        description: err.response?.data?.message ?? "Vui lòng thử lại.",
      });
    } finally {
      setUpdating(false);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl bg-muted" />;
  }

  if (error?.status === 404) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">Không tìm thấy khách hàng</p>
        <Button asChild variant="outline">
          <Link to="/admin/customers">Về danh sách khách hàng</Link>
        </Button>
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const displayName = customer.fullName || customer.username;
  const hiddenOrders = customer.orderCount - customer.orders.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft data-icon="inline-start" />
            Quay lại
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold">{displayName}</h2>
            <CustomerStatusBadge isActive={customer.isActive} />
          </div>
          <p className="text-sm text-muted-foreground">
            @{customer.username}
            {customer.email ? ` · ${customer.email}` : ""}
            {customer.phone ? ` · ${customer.phone}` : ""}
          </p>
        </div>

        <Button
          size="lg"
          variant={customer.isActive ? "destructive" : "outline"}
          onClick={() => setConfirmOpen(true)}
        >
          {customer.isActive ? "Khoá tài khoản" : "Mở khoá"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Số đơn" value={customer.orderCount} />
        <Stat label="Đã mua (đơn hoàn thành)" value={formatPrice(customer.totalSpent)} />
        <Stat label="Ngày đăng ký" value={formatDateTime(customer.createdAt)} />
      </div>

      <section className="rounded-xl border border-border bg-background">
        <h3 className="border-b border-border p-4 font-semibold">Đơn hàng gần đây</h3>

        {customer.orders.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">Khách chưa có đơn hàng nào</p>
        ) : (
          <ul className="divide-y divide-border">
            {customer.orders.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/admin/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{order.code}</p>
                    <p className="text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span className="font-medium">{formatPrice(order.total)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {hiddenOrders > 0 ? (
          <p className="border-t border-border p-4 text-sm text-muted-foreground">
            Còn {hiddenOrders} đơn cũ hơn không hiển thị ở đây.
          </p>
        ) : null}
      </section>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{customer.isActive ? "Khoá tài khoản" : "Mở khoá tài khoản"}</DialogTitle>
            <DialogDescription>
              {customer.isActive
                ? `${displayName} sẽ bị đăng xuất ngay và không thể đăng nhập hay đặt hàng. Đơn đang xử lý không bị ảnh hưởng.`
                : `${displayName} sẽ đăng nhập và đặt hàng lại được.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={updating} onClick={() => setConfirmOpen(false)}>
              Quay lại
            </Button>
            <Button
              variant={customer.isActive ? "destructive" : "default"}
              disabled={updating}
              onClick={handleToggle}
            >
              {updating ? "Đang cập nhật..." : customer.isActive ? "Khoá tài khoản" : "Mở khoá"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
