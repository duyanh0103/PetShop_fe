import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  return (
    <Button variant="ghost" size="icon">
      <Moon className="h-5 w-5" />
    </Button>
  );
}