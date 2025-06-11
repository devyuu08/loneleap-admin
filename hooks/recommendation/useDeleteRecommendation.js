"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteRecommendationFromFirestore } from "@/services/deleteRecommendation";
import { useFeedback } from "@/hooks/common/useFeedback";

/**
 * 추천 여행지 삭제 훅
 * - Firestore에서 해당 추천 데이터를 삭제
 * - 성공 시 알림, 실패 시 에러 핸들링
 */

export function useDeleteRecommendation() {
  const { success, error } = useFeedback();

  const {
    mutate: deleteRecommendation,
    isLoading: isDeleting, // 의미 명확하게 변경
  } = useMutation({
    mutationFn: deleteRecommendationFromFirestore,
    onSuccess: () => {
      success("삭제되었습니다.");
    },
    onError: (err) => {
      error(err, "삭제 중 오류가 발생했습니다.");
    },
  });

  return { deleteRecommendation, isDeleting };
}
