import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { clearAuthCookie } from "@/lib/server/cookies";
import axios from "axios";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AdminProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/api/admin/auth/check");
        setLoading(false);
      } catch (error) {
        const errorCode = error.response?.data?.error;
        clearAuthCookie();

        if (
          errorCode === "unauthenticated" &&
          router.pathname !== "/admin/login"
        ) {
          router.replace({
            pathname: "/admin/login",
            query: { error: "login-required" },
          });
        } else if (
          errorCode === "unauthorized" &&
          router.pathname !== "/admin/login"
        ) {
          router.replace({
            pathname: "/admin/login",
            query: { error: "unauthorized" },
          });
        }
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner text="관리자 인증 중..." />
      </div>
    );
  }

  return <>{children}</>;
}
