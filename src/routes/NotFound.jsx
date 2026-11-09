import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

// Shown inside the admin layout for unknown /admin/* paths.
export default function NotFound() {
  return (
    <section className="mx-auto mt-6 flex max-w-[560px] flex-col items-center gap-3.5 rounded-[32px] border-[1.5px] border-border bg-card px-7 py-10 text-center">
      <p className="font-heading text-[96px] leading-none font-extrabold text-foreground">404</p>
      <h1 className="text-[28px]">Không tìm thấy trang</h1>
      <p className="max-w-[360px] text-muted-foreground">Trang quản trị bạn tìm không tồn tại hoặc đã được chuyển.</p>
      <Button asChild className="bg-[#13306e] text-white hover:bg-[#0d1b36] dark:bg-primary dark:text-primary-foreground">
        <Link to="/admin/dashboard">Về trang quản trị</Link>
      </Button>
    </section>
  );
}
