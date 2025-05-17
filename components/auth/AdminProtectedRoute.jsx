import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { clearAuthCookie } from "@/lib/cookies";
import axios from "axios";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AdminProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/api/admin/auth");
        // 정상 인증 → 로딩 해제
        setLoading(false);
      } catch (error) {
        const errorCode = error.response?.data?.error;

        // 인증 실패 시 쿠키 제거
        clearAuthCookie();

        let errorQuery = "session-expired"; // 기본값
        if (errorCode === "unauthenticated") {
          errorQuery = "login-required";
        } else if (errorCode === "unauthorized") {
          errorQuery = "unauthorized";
        }

        router.replace(
          {
            pathname: "/admin/login",
            query: { error: errorQuery },
          },
          `/admin/login?error=${errorQuery}`
        );
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
