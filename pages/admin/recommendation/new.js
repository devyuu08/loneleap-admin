import { useAddRecommendation } from "@/hooks/recommendation/useAddRecommendation";
import RecommendationFormContainer from "@/components/recommendation/RecommendationFormContainer";

/**
 * NewRecommendationPage
 * - 추천 여행지 등록 폼 페이지
 * - 여행지 정보 입력 후 등록 처리
 */

export default function NewRecommendationPage() {
  const { addRecommendation, loading } = useAddRecommendation();

  const handleSubmit = (formData) => {
    addRecommendation(formData);
  };

  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">추천 여행지 등록</h1>
      <RecommendationFormContainer onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
