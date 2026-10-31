import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function StoreNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Không tìm thấy trang</p>
      <Button asChild variant="outline">
        <Link to="/">Về trang chủ</Link>
      </Button>
    </div>
  );
}
