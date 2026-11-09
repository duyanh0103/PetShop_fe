import { Link, useNavigate } from "react-router-dom";

import Pagination from "@/components/common/Pagination";
import { ErrorState } from "@/components/store/ProductGrid";
import OrderStatusBadge from "@/components/store/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import useListParams from "@/hooks/useListParams";
import useRemoteData from "@/hooks/useRemoteData";
import { formatDateTime, formatPrice } from "@/lib/format";
import { ORDER_STATUS_OPTIONS } from "@/lib/orderStatus";
import adminService from "@/services/adminService";

const FILTERS = ["status", "from", "to"];

export default function Orders() {
  const navigate = useNavigate();
  const list = useListParams(FILTERS);
  const { filters } = list;

  const { data, loading, error, refetch } = useRemoteData(
    JSON.stringify(list.query),
    () => adminService.getOrders(list.query),
    "Không tải được danh sách đơn hàng"
  );

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border/60 bg-background/95 p-4 shadow-sm sm:p-5">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Đơn hàng</h2>
          <p className="text-sm text-muted-foreground">Xác nhận, giao và theo dõi đơn của khách</p>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
          <div className="w-full md:min-w-[220px] md:flex-1">
            <Input
              type="search"
              value={list.search}
              onChange={(event) => list.setSearch(event.target.value)}
              placeholder="Mã đơn, SĐT hoặc tên người nhận..."
              aria-label="Tìm đơn hàng"
              className="h-10 w-full"
            />
          </div>

          <Select
            value={filters.status || "all"}
            onValueChange={(value) => list.setFilter("status", value === "all" ? "" : value)}
          >
            <SelectTrigger className="h-10 w-full md:w-[180px]" aria-label="Lọc theo trạng thái">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {ORDER_STATUS_OPTIONS.map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={filters.from}
              max={filters.to || undefined}
              onChange={(event) => list.setFilter("from", event.target.value)}
              aria-label="Từ ngày"
              className="h-10 w-full md:w-[150px]"
            />
            <span className="text-sm text-muted-foreground">–</span>
            <Input
              type="date"
              value={filters.to}
              min={filters.from || undefined}
              onChange={(event) => list.setFilter("to", event.target.value)}
              aria-label="Đến ngày"
              className="h-10 w-full md:w-[150px]"
            />
          </div>

          {list.hasFilters ? (
            <Button type="button" variant="ghost" className="h-10" onClick={list.clearFilters}>
              Xoá lọc
            </Button>
          ) : null}
        </div>
      </section>

      {error ? <ErrorState message={error.message} onRetry={refetch} /> : null}

      {loading ? (
        <div className="rounded-xl border border-border/60 bg-background/95 p-6 text-sm text-muted-foreground">
          Đang tải đơn hàng...
        </div>
      ) : null}

      {data ? (
        <>
          <div className="rounded-xl border border-border bg-background shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Người nhận</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-right">Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                      Không có đơn hàng phù hợp
                    </TableCell>
                  </TableRow>
                ) : (
                  data.items.map((order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      <TableCell>
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="font-semibold hover:underline"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {order.code}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{order.shippingName}</p>
                        <p className="text-sm text-muted-foreground">{order.shippingPhone}</p>
                      </TableCell>
                      <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                      <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                      <TableCell className="text-right font-medium">{formatPrice(order.total)}</TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {data.pagination.total > 0 ? (
            <Pagination {...list.paginationProps(data.pagination)} itemLabel="đơn hàng" />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
