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
  { label: "All Status", value: "all" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
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
            Categories
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage product categories in your store
          </p>
        </div>

        <Button
          type="button"
          onClick={onAddCategory}
          className="h-10 gap-2 self-start lg:self-auto"
        >
          <Plus className="size-4" />
          Add Category
        </Button>
      </div>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        <div className="w-full md:flex-1 md:min-w-[220px]">
          <Input
            type="search"
            value={search}
            onChange={onSearchChange}
            placeholder="Search category..."
            className="h-10 w-full"
          />
        </div>

        <Select value={isActive} onValueChange={onIsActiveChange}>
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
