"use client";

import { useRouter } from "next/router";
import { useRecommendationDetail } from "@/hooks/recommendation/useRecommendationDetail";
import { useDeleteRecommendation } from "@/hooks/recommendation/useDeleteRecommendation";
import RecommendationDetail from "@/components/recommendation/RecommendationDetail";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { AlertCircle } from "lucide-react";

export default function RecommendationDetailContainer() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, notFound } = useRecommendationDetail(id);
  const { deleteRecommendation, loading: deleting } = useDeleteRecommendation();

  const handleEdit = () => {
    router.push(`/admin/recommendation/${id}/edit`);
  };

  const handleDelete = async () => {
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;
    await deleteRecommendation(id);
    router.push("/admin/recommendation");
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner text="여행지 정보를 불러오는 중입니다..." />
      </div>
    );
  }

  if (notFound) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-10 h-10 text-gray-300 mb-3" />}
        message="존재하지 않는 여행지입니다."
        className="py-20"
      />
    );
  }

  return (
    <RecommendationDetail
      id={id}
      name={data.name}
      summary={data.summary}
      location={data.location}
      description={data.description}
      locationInfo={data.locationInfo}
      directions={data.directions}
      nearbyInfo={data.nearbyInfo}
      imageUrl={data.imageUrl}
      visible={data.visible}
      createdAt={data.createdAt}
      updatedAt={data.updatedAt}
      onEdit={handleEdit}
      onDelete={handleDelete}
      loading={deleting}
    />
  );
}
