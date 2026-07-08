import {
  dashboardMetrics,
  salesData,
  recentOrders,
  topProducts,
  topCustomers,
  latestReviews,
} from "@/data/dashboard";

import StatCard from "./components/StatCard";
import SalesChart from "./components/SalesChart";
import RecentOrders from "./components/RecentOrders";
import TopProducts from "./components/TopProducts";
import TopCustomers from "./components/TopCustomers";
import LatestReviews from "./components/LatestReviews";

function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">PetShop Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Welcome back, Ben!</h1>
        <p className="mt-2 text-sm text-slate-500">Here is your overview for today’s store performance.</p>
      </div>
      <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
        Export Report
      </button>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <DashboardHeader />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <StatCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <SalesChart data={salesData} />
        <RecentOrders orders={recentOrders} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr_0.95fr]">
        <TopProducts products={topProducts} />
        <TopCustomers customers={topCustomers} />
        <LatestReviews reviews={latestReviews} />
      </div>
    </div>
  );
}
