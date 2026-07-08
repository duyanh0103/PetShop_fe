import { ArrowDownRight, ArrowUpRight, AlertTriangle, DollarSign, PackageOpen, ShoppingBag, Users } from "lucide-react";

import { Card } from "@/components/ui/Card";

const iconMap = {
  revenue: DollarSign,
  orders: ShoppingBag,
  customers: Users,
  inventory: PackageOpen,
};

function StatCard({ title, value, detail, trend, tone = "neutral", icon }) {
  const Icon = iconMap[icon] ?? DollarSign;
  const toneClasses = {
    positive: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    neutral: "bg-slate-100 text-slate-700",
  };

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-2xl p-2.5 ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{detail}</p>
        {trend ? (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
            {tone === "warning" ? <AlertTriangle className="h-3.5 w-3.5" /> : tone === "positive" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {trend}
          </span>
        ) : null}
      </div>
    </Card>
  );
}

export default StatCard;
