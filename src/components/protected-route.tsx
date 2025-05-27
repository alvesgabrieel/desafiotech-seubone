import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/store/authStore";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
