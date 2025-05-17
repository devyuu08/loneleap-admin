import { useRouter } from "next/router";
import AdminLayout from "@/components/layout/AdminLayout";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const isAdminPage =
    router.pathname.startsWith("/admin") && router.pathname !== "/admin/login";

  if (isAdminPage) {
    return (
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    );
  }

  // 일반 사용자 페이지
  return <Component {...pageProps} />;
}
