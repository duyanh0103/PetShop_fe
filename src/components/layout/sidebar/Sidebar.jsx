import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sidebarMenu } from "@/data/menu";
import { cn } from "@/lib/utils";

// giả lập user role (sau này lấy từ store/JWT)
const currentUserRole = "ADMIN";

export default function Sidebar({ isCollapsed = false, onToggleCollapse }) {
  const filteredMenu = sidebarMenu.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(currentUserRole);
  });

  const groupedMenu = filteredMenu.reduce((acc, item) => {
    const group = item.group || "OTHER";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden bg-white">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className={cn("flex min-w-0 items-center gap-3", isCollapsed && "justify-center")}> 
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
            P
          </div>

          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">PetShop</p>
              <p className="truncate text-xs text-slate-500">Admin</p>
            </div>
          )}
        </div>

        {/* <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="shrink-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </Button> */}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 custom-scroll">
        <div className="space-y-6">
          {Object.entries(groupedMenu).map(([group, items]) => (
            <div key={group}>
              {!isCollapsed && (
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {group}
                </p>
              )}

              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const linkContent = (
                    <div className="flex items-center gap-3">
                      {Icon && <Icon size={18} className="shrink-0" />}
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </div>
                  );

                  const baseClassName =
                    "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200";

                  const content = isCollapsed ? (
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/dashboard"}
                            className={({ isActive }) =>
                              cn(
                                baseClassName,
                                "justify-center",
                                isActive
                                  ? "bg-blue-100 text-blue-600"
                                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                              )
                            }
                          >
                            {linkContent}
                          </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.title}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/dashboard"}
                      className={({ isActive }) =>
                        cn(
                          baseClassName,
                          "justify-start",
                          isActive
                            ? "bg-blue-100 text-blue-600"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )
                      }
                    >
                      {linkContent}
                    </NavLink>
                  );

                  return <div key={item.path}>{content}</div>;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}