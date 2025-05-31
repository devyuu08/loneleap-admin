"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRecommendationsFromFirestore } from "@/services/fetchRecommendations";
import { RECOMMENDATIONS } from "@/constants/queryKeys";

export function useFetchRecommendations() {
  const {
    data: recommendations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [RECOMMENDATIONS],
    queryFn: fetchRecommendationsFromFirestore,
  });

  return { recommendations, isLoading, isError, error };
}
