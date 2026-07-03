import Card from "@/components/ui/Card";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card title="Products">
        <div className="text-2xl font-bold">120</div>
      </Card>

      <Card title="Orders">
        <div className="text-2xl font-bold">45</div>
      </Card>

      <Card title="Revenue">
        <div className="text-2xl font-bold">$3,200</div>
      </Card>
    </div>
  );
}