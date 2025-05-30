import LoadingSpinner from "@/components/common/LoadingSpinner";

import ReviewReportView from "@/components/reports/review/ReviewReportView";
import { useAdminReports } from "@/hooks/reports/useAdminReports";

export default function AdminReviewReportsContainer() {
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
  } = useAdminReports({ endpoint: "/api/admin/report/review/get" });

  if (loading || !authReady) {
    return <LoadingSpinner text="신고된 리뷰를 불러오는 중..." />;
  }

  return (
    <ReviewReportView
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
