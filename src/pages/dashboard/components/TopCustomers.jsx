import { Card } from "@/components/ui/Card";

function TopCustomers({ customers }) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Top Customers</h2>
        <p className="mt-2 text-sm text-slate-500">Customers with the highest spend this month.</p>
      </div>

      <div className="space-y-3">
        {customers.map((customer) => (
          <div key={customer.name} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
            <div>
              <p className="font-semibold text-slate-900">{customer.name}</p>
              <p className="text-sm text-slate-500">{customer.email}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">{customer.spent}</p>
              <p className="text-sm text-slate-500">{customer.orders} orders</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default TopCustomers;
