import { Card } from "@/components/ui/Card";

function RecentOrders({ orders }) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Recent Orders</h2>
          <p className="mt-2 text-sm text-slate-500">Latest customer purchases and payment status.</p>
        </div>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="font-semibold text-slate-900">{order.customer}</p>
              <p className="text-sm text-slate-500">{order.id} • {order.time}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">{order.total}</p>
              <span className="text-xs font-semibold text-slate-600">{order.status}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RecentOrders;
