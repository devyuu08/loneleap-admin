"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRecommendationInFirestore } from "@/services/updateRecommendation";
import { useRouter } from "next/router";
import { useFeedback } from "@/hooks/common/useFeedback";

export function useUpdateRecommendation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  const { mutate: updateRecommendation, isLoading } = useMutation({
    mutationKey: RECOMMENDATIONS.MUTATION,
    mutationFn: ({ id, data }) => updateRecommendationInFirestore(id, data),
    onSuccess: () => {
      success("추천 여행지가 수정되었습니다.");
      queryClient.invalidateQueries(RECOMMENDATIONS.LIST);
      queryClient.invalidateQueries(RECOMMENDATIONS.DETAIL(id));
      router.push("/admin/recommendation");
    },
    onError: (err) => {
      error(err, "수정 중 오류가 발생했습니다.");
    },
  });

  return { updateRecommendation, isLoading };
}
