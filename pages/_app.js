"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import "@/styles/globals.css";
import { AdminAuthProvider } from "@/context/auth/useAdminAuth";

export default function App({ Component, pageProps, router }) {
  const [queryClient] = useState(() => new QueryClient());

  const isAdminPage = router.pathname.startsWith("/admin");
  const isLoginPage = router.pathname === "/admin/login";
  const title = Component.title || "LoneLeap Admin";

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
      </Head>

      {isLoginPage ? (
        <AdminAuthProvider>
          <Component {...pageProps} />
        </AdminAuthProvider>
      ) : isAdminPage ? (
        <AdminAuthProvider>
          <AdminLayout>
            <AdminProtectedRoute>
              <Component {...pageProps} />
            </AdminProtectedRoute>
          </AdminLayout>
        </AdminAuthProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </QueryClientProvider>
  );
}
