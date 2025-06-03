"use client";

import { useQuery } from "@tanstack/react-query";
import { getRecommendationDetail } from "@/services/getRecommendationDetail";
import { RECOMMENDATIONS } from "@/constants/queryKeys";

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
