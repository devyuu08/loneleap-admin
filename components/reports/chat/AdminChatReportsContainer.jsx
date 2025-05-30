import LoadingSpinner from "@/components/common/LoadingSpinner";
import ChatReportView from "@/components/reports/chat/ChatReportView";
import { useAdminReports } from "@/hooks/reports/useAdminReports";

export default function AdminChatReportsContainer() {
  const {
    authReady,
    loading,
    reports,
    selectedReport,
    setSelectedReport,
    hasMore,
    loadingMore,
    error,
    handleLoadMore,
    handleReportSuccess,
  } = useAdminReports({
    endpoint: "/api/admin/report/chat/get",
    queryKey: "lastDocId",
  });

  if (!authReady || loading) {
    return <LoadingSpinner text="신고된 채팅 메시지를 불러오는 중..." />;
  }

  return (
    <ChatReportView
      reports={reports}
      selectedReport={selectedReport}
      onSelect={setSelectedReport}
      onLoadMore={handleLoadMore}
      hasMore={hasMore}
      loadingMore={loadingMore}
      error={error}
      onSuccess={handleReportSuccess}
    />
  );
}
