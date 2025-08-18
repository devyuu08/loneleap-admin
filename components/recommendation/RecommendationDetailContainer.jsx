import { useCallback } from "react";
import { useRouter } from "next/router";
import { useRecommendationDetail } from "@/hooks/recommendation/useRecommendationDetail";
import { useDeleteRecommendation } from "@/hooks/recommendation/useDeleteRecommendation";
import RecommendationDetail from "@/components/recommendation/RecommendationDetail";
import LoadingSpinner from "@/components/common/loading/LoadingSpinner";
import EmptyState from "@/components/common/feedback/EmptyState";
import { AlertCircle } from "lucide-react";

/**
 * RecommendationDetailContainer
 * - 추천 여행지 상세 정보를 가져와 <RecommendationDetail />에 전달하는 컨테이너 컴포넌트
 * - id 쿼리 파라미터를 기준으로 여행지 데이터 fetch
 * - 로딩/에러/삭제 핸들링 처리 포함
 * - 수정 및 삭제 핸들러 정의 및 전달
 */

export default function RecommendationDetailContainer() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, notFound } = useRecommendationDetail(id);
  const { deleteRecommendation, loading: deleting } = useDeleteRecommendation();

  const handleEdit = useCallback(() => {
    router.push(`/admin/recommendation/${id}/edit`);
  }, [id, router]);

  const handleDelete = useCallback(async () => {
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;
    deleteRecommendation(id);
  }, [id, deleteRecommendation]);

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
