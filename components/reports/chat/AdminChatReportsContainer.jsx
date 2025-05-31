"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAdminReports } from "@/services/adminReports";
import { useAdminAuth } from "@/hooks/auth/useAdminAuth";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import ChatReportView from "@/components/reports/chat/ChatReportView";

export default function AdminChatReportsContainer() {
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
    queryKey: ["adminReports", "chat"],
    enabled: authReady && !!authUser,
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

  const reports = data?.pages.flat() || [];

  const handleReportSuccess = () => {
    setSelectedReport(null);
  };

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
