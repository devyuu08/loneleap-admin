import AdminLayout from "@/components/layout/AdminLayout";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import "@/styles/globals.css";

export default function App({ Component, pageProps, router }) {
  const isAdminPage = router.pathname.startsWith("/admin");
  const isLoginPage = router.pathname === "/admin/login";

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

  return <Component {...pageProps} />;
}
