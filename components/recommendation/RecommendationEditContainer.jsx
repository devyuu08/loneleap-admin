import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useRecommendationDetail } from "@/hooks/recommendation/useRecommendationDetail";
import { useUpdateRecommendation } from "@/hooks/recommendation/useUpdateRecommendation";
import { useUploadImage } from "@/hooks/useUploadImage";
import RecommendationFormContainer from "@/components/recommendation/RecommendationFormContainer";
import LoadingSpinner from "@/components/common/loading/LoadingSpinner";
import EmptyState from "@/components/common/feedback/EmptyState";
import { AlertCircle } from "lucide-react";

/**
 * RecommendationEditContainer
 * - 추천 여행지 수정 페이지의 컨테이너 컴포넌트
 * - URL의 id를 기준으로 여행지 데이터를 조회하여 폼에 초기값으로 전달
 * - 이미지가 새로 업로드되면 스토리지에 업로드 후 해당 URL을 포함하여 수정 요청
 * - 로딩, 데이터 없음, 폼 표시의 조건부 렌더링 처리 포함
 */

export default function RecommendationEditContainer() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, notFound } = useRecommendationDetail(id);
  const { updateRecommendation, isLoading } = useUpdateRecommendation();
  const { uploadImage } = useUploadImage();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (data) {
      setInitialData({
        name: data.name || "",
        summary: data.summary || "",
        location: data.location || "",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        visible: data.visible ?? true,
        locationInfo: data.locationInfo || "",
        directions: data.directions || [],
        nearbyInfo: data.nearbyInfo || [],
      });
    }
  }, [data]);

  const handleUpdate = useCallback(
    async (formData) => {
      let imageUrl = initialData.imageUrl;
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile, "recommendations");
      }
      const { imageFile, ...rest } = formData;

      updateRecommendation({
        id,
        data: { ...rest, imageUrl },
      });
    },
    [initialData, id, uploadImage, updateRecommendation]
  );

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
    <div className="px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">추천 여행지 수정</h1>
      {initialData && (
        <RecommendationFormContainer
          initialValues={initialData}
          onSubmit={handleUpdate}
          loading={isLoading}
        />
      )}
    </div>
  );
}
