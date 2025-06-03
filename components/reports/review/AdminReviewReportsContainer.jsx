"use client";

import { useCallback, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAdminReports } from "@/services/adminReports";
import { useAdminAuth } from "@/context/auth/useAdminAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ReviewReportView from "@/components/reports/review/ReviewReportView";
import { ADMIN_REPORTS } from "@/constants/queryKeys";

export default function AdminReviewReportsContainer() {
  const { authReady, authUser, getToken } = useAdminAuth();
  const [selectedReport, setSelectedReport] = useState(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ADMIN_REPORTS.REVIEW,
    enabled: authReady && !!authUser,
    queryFn: async ({ pageParam }) => {
      const token = await getToken();
      return await getAdminReports({
        endpoint: "/api/admin/report/review/get",
        token,
        query: pageParam ? { lastDoc: pageParam } : {},
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage?.length === 50 ? lastPage[lastPage.length - 1]?.id : undefined,
  });

  const reports = data?.pages.flat() || [];

  const handleReportSuccess = useCallback(() => {
    setSelectedReport(null);
  }, []);

  if (isLoading || !authReady) {
    return <LoadingSpinner text="신고된 리뷰를 불러오는 중..." />;
  }

  return (
    <ReviewReportView
      reports={reports}
      selectedReport={selectedReport}
      onSelect={setSelectedReport}
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage}
      loadingMore={isFetchingNextPage}
      error={error}
      onSuccess={handleReportSuccess}
    />
  );
}
