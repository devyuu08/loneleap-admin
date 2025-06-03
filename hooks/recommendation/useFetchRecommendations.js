"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRecommendationsFromFirestore } from "@/services/fetchRecommendations";
import { RECOMMENDATIONS } from "@/constants/queryKeys";

export function useFetchRecommendations() {
  const {
    data: [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [RECOMMENDATIONS.LIST],
    queryFn: fetchRecommendationsFromFirestore,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    retry: 1, // 네트워크 에러 발생 시 1회만 재시도
  });

  return { recommendations: data, isLoading, isError, error };
}
