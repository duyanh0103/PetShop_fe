import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Hoạt động", value: "true" },
  { label: "Ngừng hoạt động", value: "false" },
];

export default function CategoryToolbar({
  search = "",
  isActive = "all",
  onSearchChange,
  onIsActiveChange,
  onAddCategory,
}) {
  return (
    <section className="rounded-xl border border-border/60 bg-background/95 p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Danh mục
          </h2>
          <p className="text-sm text-muted-foreground">
            Quản lý danh mục sản phẩm trong cửa hàng của bạn
          </p>
        </div>

        <Button
          type="button"
          onClick={onAddCategory}
          className="h-10 gap-2 self-start lg:self-auto"
        >
          <Plus className="size-4" />
          Thêm danh mục
        </Button>
      </div>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        <div className="w-full md:flex-1 md:min-w-[220px]">
          <Input
            type="search"
            value={search}
            onChange={onSearchChange}
            placeholder="Tìm kiếm danh mục..."
            className="h-10 w-full"
          />
        </div>

        <Select value={isActive} onValueChange={onIsActiveChange}>
          <SelectTrigger className="h-10 w-full md:w-[180px]">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
