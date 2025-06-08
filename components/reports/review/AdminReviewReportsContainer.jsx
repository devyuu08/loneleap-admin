"use client";

import { useCallback, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAdminReports } from "@/services/adminReports";
import { useAdminAuth } from "@/context/auth/useAdminAuth";
import LoadingSpinner from "@/components/common/loading/LoadingSpinner";
import ReviewReportView from "@/components/reports/review/ReviewReportView";
import { ADMIN_REPORTS } from "@/constants/queryKeys";

/**
 * AdminReviewReportsContainer
 * - 관리자 리뷰 신고 목록 컨테이너
 * - 신고 목록 데이터를 무한 페이징 방식으로 불러옴 (useInfiniteQuery)
 * - 선택된 신고는 ReviewReportView에 상세 전달
 * - 성공 처리 시 상세 보기 초기화
 */

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
    enabled: authReady && !!authUser, // 인증 완료 후 쿼리 활성화
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

  // 처리 완료 시 상세 보기 초기화
  const handleReportSuccess = useCallback(() => {
    setSelectedReport(null);
  }, []);

  if (isLoading || !authReady) {
    <section aria-label="리뷰 신고 목록 로딩 중">
      <LoadingSpinner text="신고된 리뷰를 불러오는 중..." />
    </section>;
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
