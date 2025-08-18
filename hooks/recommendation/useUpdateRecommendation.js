import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRecommendationInFirestore } from "@/services/updateRecommendation";
import { useRouter } from "next/router";
import { useFeedback } from "@/hooks/common/useFeedback";
import { RECOMMENDATIONS } from "@/constants/queryKeys";

/**
 * 추천 여행지 수정 훅
 * - Firestore의 특정 추천 항목 수정
 * - 성공 시 목록 및 상세 쿼리 무효화 → 데이터 최신화
 * - 수정 완료 후 목록 페이지로 이동
 */

export function useUpdateRecommendation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  const { mutate: updateRecommendation, isLoading } = useMutation({
    mutationKey: RECOMMENDATIONS.MUTATION,
    mutationFn: ({ id, data }) => updateRecommendationInFirestore(id, data),
    onSuccess: (_, variables) => {
      const { id } = variables;
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
