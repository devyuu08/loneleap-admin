"use client";

import { useQuery } from "@tanstack/react-query";
import { getRecommendationDetail } from "@/services/getRecommendationDetail";

export function useRecommendationDetail(id) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recommendation", id],
    queryFn: () => getRecommendationDetail(id),
    enabled: !!id,
  });

  const notFound = !isLoading && !data;

  return {
    data,
    loading: isLoading,
    error: isError,
    notFound,
  };
}
