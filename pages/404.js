// pages/404.js
import { useRouter } from "next/router";
import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";

export default function Custom404() {
  const router = useRouter();
  const [isAdminPage, setIsAdminPage] = useState(false);

  useEffect(() => {
    setIsAdminPage(router.asPath.startsWith("/admin"));
  }, [router.asPath]);

  if (isAdminPage) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
          <p className="text-gray-500">존재하지 않는 관리자 경로입니다.</p>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </AdminLayout>
    );
  }

  // 일반 유저용 404
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
      <p className="text-gray-500">존재하지 않는 페이지입니다.</p>
      <button
        onClick={() => router.push("/")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
