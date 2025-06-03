"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRecommendationsFromFirestore } from "@/services/fetchRecommendations";
import { RECOMMENDATIONS } from "@/constants/queryKeys";

export function useFetchRecommendations() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [RECOMMENDATIONS.LIST],
    queryFn: fetchRecommendationsFromFirestore,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    retry: 1,
  });

  return { recommendations: data, isLoading, isError, error };
}
