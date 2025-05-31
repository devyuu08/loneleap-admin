"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRecommendationsFromFirestore } from "@/services/fetchRecommendations";

export function useFetchRecommendations() {
  const {
    data: recommendations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["recommendations"],
    queryFn: fetchRecommendationsFromFirestore,
  });

  return { recommendations, isLoading, isError, error };
}
