"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteRecommendationFromFirestore } from "@/services/deleteRecommendation";

export function useDeleteRecommendation() {
  const {
    mutate: deleteRecommendation,
    isLoading,
    error,
  } = useMutation({
    mutationFn: async (id) => {
      await deleteRecommendationFromFirestore(id);
    },
    onSuccess: () => {
      alert("삭제되었습니다.");
    },
    onError: (err) => {
      console.error("추천 여행지 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    },
  });

  return { deleteRecommendation, isLoading, error };
}
