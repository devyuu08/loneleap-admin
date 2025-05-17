import AdminLayout from "@/components/layout/AdminLayout";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import "@/styles/globals.css";

export default function App({ Component, pageProps, router }) {
  const isAdminPage = router.pathname.startsWith("/admin");
  const isLoginPage = router.pathname === "/admin/login";

  // 로그인 페이지는 보호/레이아웃 제외
  if (isLoginPage) return <Component {...pageProps} />;

  if (isAdminPage) {
    return (
      <AdminLayout>
        <AdminProtectedRoute>
          <Component {...pageProps} />
        </AdminProtectedRoute>
      </AdminLayout>
    );
  }

  // 일반 사용자용 페이지 (현재는 없음)
  return (
    <div className="h-screen flex items-center justify-center text-gray-500 text-sm">
      이 페이지는 존재하지 않습니다.
    </div>
  );
}
