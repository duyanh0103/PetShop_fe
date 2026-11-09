import { Link, useNavigate } from "react-router-dom";

import Pagination from "@/components/common/Pagination";
import { ErrorState } from "@/components/store/ProductGrid";
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
import adminService from "@/services/adminService";

import CustomerStatusBadge from "./components/CustomerStatusBadge";

const FILTERS = ["isActive"];

export default function Customers() {
  const navigate = useNavigate();
  const list = useListParams(FILTERS);

  const { data, loading, error, refetch } = useRemoteData(
    JSON.stringify(list.query),
    () => adminService.getCustomers(list.query),
    "Không tải được danh sách khách hàng"
  );

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border/60 bg-background/95 p-4 shadow-sm sm:p-5">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Khách hàng</h2>
          <p className="text-sm text-muted-foreground">Tài khoản khách đã đăng ký trên cửa hàng</p>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="w-full md:flex-1">
            <Input
              type="search"
              value={list.search}
              onChange={(event) => list.setSearch(event.target.value)}
              placeholder="Tên, email, SĐT hoặc tên đăng nhập..."
              aria-label="Tìm khách hàng"
              className="h-10 w-full"
            />
          </div>

          <Select
            value={list.filters.isActive || "all"}
            onValueChange={(value) => list.setFilter("isActive", value === "all" ? "" : value)}
          >
            <SelectTrigger className="h-10 w-full md:w-[180px]" aria-label="Lọc theo trạng thái">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="true">Hoạt động</SelectItem>
              <SelectItem value="false">Đã khoá</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {error ? <ErrorState message={error.message} onRetry={refetch} /> : null}

      {loading ? (
        <div className="rounded-xl border border-border/60 bg-background/95 p-6 text-sm text-muted-foreground">
          Đang tải khách hàng...
        </div>
      ) : null}

      {data ? (
        <>
          <div className="rounded-xl border border-border bg-background shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>SĐT</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead className="text-right">Số đơn</TableHead>
                  <TableHead className="text-right">Đã mua</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                      Không có khách hàng phù hợp
                    </TableCell>
                  </TableRow>
                ) : (
                  data.items.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/admin/customers/${customer.id}`)}
                    >
                      <TableCell>
                        <Link
                          to={`/admin/customers/${customer.id}`}
                          className="font-semibold hover:underline"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {customer.fullName || customer.username}
                        </Link>
                        <p className="text-sm text-muted-foreground">{customer.email ?? customer.username}</p>
                      </TableCell>
                      <TableCell>{customer.phone ?? "—"}</TableCell>
                      <TableCell>{formatDateTime(customer.createdAt)}</TableCell>
                      <TableCell className="text-right">{customer.orderCount}</TableCell>
                      <TableCell className="text-right font-medium">{formatPrice(customer.totalSpent)}</TableCell>
                      <TableCell>
                        <CustomerStatusBadge isActive={customer.isActive} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {data.pagination.total > 0 ? (
            <Pagination {...list.paginationProps(data.pagination)} itemLabel="khách hàng" />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
