"use client";

import { useFetchRecommendations } from "@/hooks/recommendation/useFetchRecommendations";
import RecommendationList from "@/components/recommendation/RecommendationList";
import Link from "next/link";

function AdminSpotsPage() {
  const { recommendations, loading } = useFetchRecommendations();

  return (
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

      <RecommendationList recommendations={recommendations} loading={loading} />
    </div>
  );
}

AdminSpotsPage.title = "LoneLeap Admin | 추천 여행지";

export default AdminSpotsPage;
