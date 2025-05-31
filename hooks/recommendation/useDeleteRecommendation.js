"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteRecommendationFromFirestore } from "@/services/deleteRecommendation";
import { useFeedback } from "@/hooks/common/useFeedback";

export function useDeleteRecommendation() {
  const { success, error } = useFeedback();

  const { mutate: deleteRecommendation, isLoading } = useMutation({
    mutationFn: async (id) => {
      await deleteRecommendationFromFirestore(id);
    },
    onSuccess: () => {
      success("삭제되었습니다.");
    },
    onError: (err) => {
      error(err, "삭제 중 오류가 발생했습니다.");
    },
  });

  return { deleteRecommendation, isLoading };
}
