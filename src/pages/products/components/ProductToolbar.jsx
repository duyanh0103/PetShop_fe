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

const categoryOptions = [
  { label: "All Categories", value: "all" },
  { label: "Dog Food", value: "dog-food" },
  { label: "Cat Food", value: "cat-food" },
  { label: "Accessories", value: "accessories" },
];

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Out of Stock", value: "out-of-stock" },
];

export default function ProductToolbar({
  search = "",
  category = "all",
  status = "all",
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onAddProduct,
}) {
  return (
    <section className="rounded-xl border border-border/60 bg-background/95 p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Products
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage all products in your store
          </p>
        </div>

        <Button
          type="button"
          onClick={onAddProduct}
          className="h-10 gap-2 self-start lg:self-auto"
        >
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        <div className="w-full md:flex-1 md:min-w-[220px]">
          <Input
            type="search"
            value={search}
            onChange={onSearchChange}
            placeholder="Search product..."
            className="h-10 w-full"
          />
        </div>

        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="h-10 w-full md:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-10 w-full md:w-[180px]">
            <SelectValue placeholder="All Status" />
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
