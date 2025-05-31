"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import "@/styles/globals.css";

export default function App({ Component, pageProps, router }) {
  const [queryClient] = useState(() => new QueryClient());

  const isAdminPage = router.pathname.startsWith("/admin");
  const isLoginPage = router.pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    );
  }

  if (isAdminPage) {
    return (
      <QueryClientProvider client={queryClient}>
        <AdminLayout>
          <AdminProtectedRoute>
            <Component {...pageProps} />
          </AdminProtectedRoute>
        </AdminLayout>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
