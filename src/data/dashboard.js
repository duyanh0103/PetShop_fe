export const dashboardMetrics = [
  {
    title: "Revenue Today",
    value: "$24,580",
    detail: "42 orders completed",
    trend: "+12% vs yesterday",
    tone: "positive",
    icon: "revenue",
  },
  {
    title: "Orders Today",
    value: "128",
    detail: "18 pending shipment",
    trend: "+8%",
    tone: "neutral",
    icon: "orders",
  },
  {
    title: "New Customers",
    value: "34",
    detail: "9 signed up this morning",
    trend: "+5",
    tone: "positive",
    icon: "customers",
  },
  {
    title: "Low Stock Products",
    value: "12",
    detail: "3 need urgent restock",
    trend: "Needs attention",
    tone: "warning",
    icon: "inventory",
  },
];

export const salesData = [
  { month: "Jan", revenue: 18200, orders: 92 },
  { month: "Feb", revenue: 21450, orders: 104 },
  { month: "Mar", revenue: 23680, orders: 118 },
  { month: "Apr", revenue: 24820, orders: 126 },
  { month: "May", revenue: 27240, orders: 134 },
  { month: "Jun", revenue: 29560, orders: 141 },
];

export const recentOrders = [
  { id: "#10482", customer: "Alicia Nguyen", time: "10:25 AM", total: "$142.00", status: "Paid" },
  { id: "#10481", customer: "Michael Tran", time: "09:50 AM", total: "$89.50", status: "Packed" },
  { id: "#10480", customer: "Emma Do", time: "08:40 AM", total: "$216.30", status: "Processing" },
];

export const topProducts = [
  { name: "Purina Pro Plan", sku: "DOG-001", sold: 124, stock: "18 left" },
  { name: "Greenies Dental Chews", sku: "DOG-022", sold: 98, stock: "32 left" },
  { name: "Kong Classic", sku: "TOY-011", sold: 87, stock: "9 left" },
];

export const topCustomers = [
  { name: "Sarah Jenkins", email: "sarah@example.com", spent: "$2,340", orders: 24 },
  { name: "Minh Hoang", email: "minh@example.com", spent: "$1,980", orders: 18 },
  { name: "Linh Tran", email: "linh@example.com", spent: "$1,760", orders: 15 },
];

export const latestReviews = [
  { id: 1, customer: "Daniel Kim", rating: 5, comment: "Fast delivery and the product quality is excellent." },
  { id: 2, customer: "Nina Pham", rating: 4, comment: "Very satisfied with the customer support and shipping." },
  { id: 3, customer: "Chris Brown", rating: 5, comment: "Great value for premium pet food." },
];
