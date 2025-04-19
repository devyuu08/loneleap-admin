// loneleap-admin/pages/admin/spots.js
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";

export default function AdminSpotsPage() {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-full py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">추천 여행지 관리</h1>
          <p className="text-gray-500 max-w-md">
            이 페이지는{" "}
            <span className="font-semibold text-gray-700">v4.0</span> 버전에서
            도입될 예정입니다.
            <br /> 여행지 데이터 등록, 수정, 삭제 기능이 제공될 예정이에요.
          </p>
          <p className="text-gray-500 mt-2">예상 출시일: 2025년 6월</p>
          <div className="mt-6">
            <Link
              href="/admin/dashboard"
              className="text-blue-500 hover:underline mx-2"
            >
              대시보드로 돌아가기
            </Link>
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
