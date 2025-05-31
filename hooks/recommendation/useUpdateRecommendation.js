"use client";

import { useMutation } from "@tanstack/react-query";
import { updateRecommendationInFirestore } from "@/services/updateRecommendation";
import { useRouter } from "next/router";
import { useFeedback } from "@/hooks/common/useFeedback";

export function useUpdateRecommendation() {
  const router = useRouter();
  const { success, error } = useFeedback();

  const { mutate: updateRecommendation, isLoading } = useMutation({
    mutationFn: async ({ id, data }) => {
      return await updateRecommendationInFirestore(id, data);
    },
    onSuccess: () => {
      success("추천 여행지가 수정되었습니다.");
      router.push("/admin/recommendation");
    },
    onError: (err) => {
      error(err, "수정 중 오류가 발생했습니다.");
    },
  });

  return { updateRecommendation, isLoading };
}
