import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { clearAuthCookie } from "@/lib/server/cookies";
import axios from "axios";
import LoadingSpinner from "@/components/common/loading/LoadingSpinner";

export default function AdminProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/api/admin/auth/check");
        setAuthorized(true);
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
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <>
      {/* title이 정의된 페이지에서는 여기까지 항상 렌더됨 */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner text="관리자 인증 중..." />
        </div>
      ) : authorized ? (
        children
      ) : null}
    </>
  );
}
