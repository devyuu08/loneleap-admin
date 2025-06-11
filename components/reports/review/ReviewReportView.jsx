import React from "react";
import ReviewReportTable from "@/components/reports/review/ReviewReportTable";
import ReviewReportDetail from "@/components/reports/review/ReviewReportDetail";
import NoReportSelected from "@/components/common/feedback/NoReportSelected";
import ReportListViewLayout from "@/components/common/reports/ReportListViewLayout";

/**
 * ReviewReportView
 * - 리뷰 신고 목록 뷰의 전체 레이아웃 구성
 * - 테이블 + 상세 보기 + 페이징 + 에러/빈 상태 처리
 * - 선택된 신고 데이터를 상세 컴포넌트에 전달
 */

function ReviewReportView(props) {
  const {
    reports,
    selectedReport,
    onSelect,
    onLoadMore,
    hasMore,
    loadingMore,
    error,
    onSuccess,
  } = props;

  return (
    <ReportListViewLayout
      title="리뷰 신고 목록"
      totalCount={reports.length}
      error={error}
      isEmpty={reports.length === 0}
      table={
        <ReviewReportTable
          reports={reports}
          onSelect={onSelect}
          selectedReportId={selectedReport?.id}
        />
      }
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      loadingMore={loadingMore}
      detail={
        selectedReport && (
          <ReviewReportDetail report={selectedReport} onSuccess={onSuccess} />
        )
      }
      noSelection={<NoReportSelected />}
    />
  );
}

export default React.memo(ReviewReportView);
