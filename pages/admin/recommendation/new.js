import React from "react";
import RecommendationForm from "@/components/recommendation/RecommendationForm";
import { useAddRecommendation } from "@/hooks/useAddRecommendation";

export default function NewRecommendationPage() {
  const { addRecommendation, loading } = useAddRecommendation();

  const handleSubmit = async (formData) => {
    await addRecommendation(formData);
    // 성공 후 이동 또는 알림
  };

  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">추천 여행지 등록</h1>
      <RecommendationForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
