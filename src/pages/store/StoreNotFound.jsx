import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function StoreNotFound() {
  return (
    <section className="mx-auto flex max-w-[560px] flex-col items-center gap-3.5 rounded-[32px] bg-pastel px-7 py-10 text-center">
      <p className="font-heading text-[96px] leading-none font-extrabold text-primary">404</p>
      <h1 className="text-[28px]">Ơ, trang này chạy đâu mất rồi</h1>
      <p className="max-w-[360px] text-body">Có thể đường dẫn đã cũ hoặc gõ nhầm. Mình quay về xem pate tiếp nhé.</p>
      <Button asChild>
        <Link to="/">Về trang chủ</Link>
      </Button>
    </section>
  );
}
