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
        if (error.response?.status === 401) {
          clearAuthCookie(); // 인증 실패 → 쿠키 삭제
          router.replace(
            {
              pathname: "/admin/login",
              query: { error: "session-expired" },
            },
            "/admin/login?error=session-expired"
          );
        } else {
          console.error("인증 체크 중 오류 발생:", error);
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
