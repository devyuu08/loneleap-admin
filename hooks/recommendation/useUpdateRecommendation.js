"use client";

import { useMutation } from "@tanstack/react-query";
import { updateRecommendationInFirestore } from "@/services/updateRecommendation";
import { useRouter } from "next/router";

export function useUpdateRecommendation() {
  const router = useRouter();

  const {
    mutate: updateRecommendation,
    isLoading,
    error,
  } = useMutation({
    mutationFn: async ({ id, data }) => {
      return await updateRecommendationInFirestore(id, data);
    },
    onSuccess: () => {
      alert("추천 여행지가 수정되었습니다.");
      router.push("/admin/recommendation");
    },
    onError: (err) => {
      console.error("추천 여행지 수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    },
  });

  return { updateRecommendation, isLoading, error };
}
