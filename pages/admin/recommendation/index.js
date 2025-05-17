import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import { useFetchRecommendations } from "@/hooks/useFetchRecommendations";
import RecommendationList from "@/components/recommendation/RecommendationList";
import Link from "next/link";

export default function AdminSpotsPage() {
  const { recommendations, loading } = useFetchRecommendations();

  return (
    <AdminProtectedRoute>
      <div className="px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">추천 여행지 목록</h1>
          <Link
            href="/admin/recommendation/new"
            className="text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            + 새 여행지 등록
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">불러오는 중...</p>
        ) : (
          <RecommendationList recommendations={recommendations} />
        )}
      </div>
    </AdminProtectedRoute>
  );
}
