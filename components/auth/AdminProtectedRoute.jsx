import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { clearAuthCookie } from "@/lib/server/cookies";
import axios from "axios";
import LoadingSpinner from "@/components/common/loading/LoadingSpinner";

/**
 * AdminProtectedRoute
 * - LoneLeap 관리자 전용 페이지 보호 컴포넌트
 * - Firebase 인증 토큰 검증 → 서버에서 관리자 권한 확인
 * - 미인증 or 권한 없음 상태 시 로그인 페이지로 리다이렉트
 */

export default function AdminProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 서버에 인증 상태 요청 (Firebase ID 토큰 검사)
        await axios.get("/api/admin/auth/check");

        // 인증 통과 → 관리자 권한 있음
        setAuthorized(true);
      } catch (error) {
        const errorCode = error.response?.data?.error;

        // 인증 쿠키 제거
        clearAuthCookie();

        // 인증 실패 시 로그인 페이지로 리다이렉트
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
      {/* 인증 확인 중에는 전체 화면 스피너 표시 */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner text="관리자 인증 중..." />
        </div>
      ) : authorized ? (
        // 인증 완료 → 자식 컴포넌트 렌더링
        children
      ) : null}
    </>
  );
}
