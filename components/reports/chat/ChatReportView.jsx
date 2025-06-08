import React from "react";
import ChatReportTable from "@/components/reports/chat/ChatReportTable";
import ChatReportDetail from "@/components/reports/chat/ChatReportDetail";
import NoReportSelected from "@/components/common/feedback/NoReportSelected";
import ReportListViewLayout from "@/components/common/reports/ReportListViewLayout";

function ChatReportView(props) {
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
      title="채팅 신고 목록"
      totalCount={reports.length}
      error={error}
      isEmpty={reports.length === 0}
      table={
        <ChatReportTable
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
          <ChatReportDetail report={selectedReport} onSuccess={onSuccess} />
        )
      }
      noSelection={<NoReportSelected />}
    />
  );
}

export default React.memo(ChatReportView);
