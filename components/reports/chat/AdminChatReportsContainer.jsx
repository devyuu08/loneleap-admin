"use client";

import { useCallback, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAdminReports } from "@/services/adminReports";
import { useAdminAuth } from "@/context/auth/useAdminAuth";
import LoadingSpinner from "@/components/common/loading/LoadingSpinner";
import ChatReportView from "@/components/reports/chat/ChatReportView";
import { ADMIN_REPORTS } from "@/constants/queryKeys";

/**
 * AdminChatReportsContainer
 * - 관리자 페이지에서 신고된 채팅 목록을 무한스크롤 방식으로 불러옴
 * - 인증 완료 후 React Query 기반으로 데이터 요청
 * - 선택된 신고는 상태로 관리하며, 상세 처리 후 리셋됨
 */

export default function AdminChatReportsContainer() {
  const { authReady, authUser, getToken } = useAdminAuth();
  const [selectedReport, setSelectedReport] = useState(null);

  // 신고 목록 불러오기 (React Query - useInfiniteQuery)
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ADMIN_REPORTS.CHAT,
    enabled: authReady && !!authUser, // 인증 완료 후 fetch
    queryFn: async ({ pageParam }) => {
      const token = await getToken();
      return await getAdminReports({
        endpoint: "/api/admin/report/chat/get",
        token,
        query: pageParam ? { lastDoc: pageParam } : {},
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage?.length === 50 ? lastPage[lastPage.length - 1]?.id : undefined,
  });

  // 전체 신고 리스트 병합
  const reports = data?.pages.flat() || [];

  // 처리 후 상세 선택 해제
  const handleReportSuccess = useCallback(() => {
    setSelectedReport(null);
  }, []);

  if (isLoading || !authReady) {
    return <LoadingSpinner text="신고된 채팅 메시지를 불러오는 중..." />;
  }

  return (
    <ChatReportView
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
