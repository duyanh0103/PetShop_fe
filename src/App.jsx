import AppRouter from "@/routes/AppRouter";
import { ToastProvider, Toaster } from "@/components/ui/toast";

export default function App() {
  return (
    <ToastProvider>
      <AppRouter />
      <Toaster />
    </ToastProvider>
  );
}