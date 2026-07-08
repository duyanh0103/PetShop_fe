import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { Card } from "@/components/ui/Card";

function SalesChart({ data }) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Sales Overview</h2>
          <p className="mt-2 text-sm text-slate-500">Revenue and order volume across the last months.</p>
        </div>
        <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-600" />
          <span className="whitespace-nowrap">Revenue</span>
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-slate-400" />
          <span className="whitespace-nowrap">Orders</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 0, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" name="Revenue" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
          <Bar dataKey="orders" name="Orders" fill="#94a3b8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default SalesChart;
