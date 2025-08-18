import { useQuery } from "@tanstack/react-query";
import { getRecommendationDetail } from "@/services/getRecommendationDetail";
import { RECOMMENDATIONS } from "@/constants/queryKeys";

/**
 * 추천 여행지 상세 조회 훅
 * - ID 기반으로 단일 여행지 정보 조회
 * - ID가 없으면 요청하지 않음 (enabled 조건)
 * - 404 대응을 위해 retry 비활성화
 */

export function useRecommendationDetail(id) {
  const { data, isLoading, isError } = useQuery({
    queryKey: RECOMMENDATIONS.DETAIL(id),
    queryFn: () => getRecommendationDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5분 동안은 refetch 하지 않음
    retry: false, // 404 등 의도된 실패일 경우 재시도 막음
  });

  const notFound = !isLoading && !data;

  return {
    data,
    loading: isLoading,
    error: isError,
    notFound,
  };
}
