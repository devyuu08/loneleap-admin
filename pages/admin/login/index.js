import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminLoginFormContainer from "@/components/auth/AdminLoginFormContainer";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const queryError = router.query.error;

    if (queryError === "not-admin") {
      setError("관리자 계정이 아닙니다.");
    } else if (queryError === "unauthenticated") {
      setError("관리자 계정 로그인이 필요합니다.");
    } else if (queryError === "session-expired") {
      setError("세션이 만료되었습니다. 다시 로그인해주세요.");
    } else {
      setError("");
    }
  }, [router.query.error]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* key 부여로 query 바뀔 때마다 리렌더링 강제 */}
      <AdminLoginFormContainer key={router.asPath} errorMessage={error} />
    </main>
  );
}
