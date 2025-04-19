import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { adminEmails } from "@/lib/constants";
import LoadingSpinner from "../common/LoadingSpinner";

export default function AdminProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // 로그인 X
      if (!user) {
        router.replace(
          {
            pathname: "/admin/login",
            query: { error: "unauthenticated" },
          },
          "/admin/login?error=unauthenticated"
        );
        return;
      }

      // 관리자 X
      if (!adminEmails.includes(user.email)) {
        router.replace(
          {
            pathname: "/admin/login",
            query: { error: "not-admin" },
          },
          "/admin/login?error=not-admin"
        );
        return;
      }

      // 관리자 인증 통과
      setLoading(false);
    });

    return () => unsubscribe();
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
