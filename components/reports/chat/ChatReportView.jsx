import React from "react";
import ChatReportTable from "@/components/reports/chat/ChatReportTable";
import ChatReportDetail from "@/components/reports/chat/ChatReportDetail";
import NoReportSelected from "@/components/common/NoReportSelected";

function ChatReportView({
  reports,
  selectedReport,
  onSelect,
  onLoadMore,
  hasMore,
  loadingMore,
  error,
  onSuccess,
}) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">채팅 신고 목록</h2>
        <p className="text-gray-600 text-sm mt-1">
          총 <strong>{reports.length}</strong>개의 신고가 접수되었습니다.
        </p>
      </div>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      {/* 신고 목록 */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        {reports.length === 0 ? (
          <div className="text-center text-gray-500">
            신고된 채팅이 없습니다.
          </div>
        ) : (
          <>
            <ChatReportTable
              reports={reports}
              onSelect={onSelect}
              selectedReportId={selectedReport?.id}
            />

            {hasMore && reports.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={onLoadMore}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  disabled={loadingMore}
                >
                  {loadingMore ? "불러오는 중..." : "더 보기"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 상세 정보 */}
      {selectedReport ? (
        <div className="bg-white p-6 rounded-xl shadow min-h-[300px]">
          <ChatReportDetail report={selectedReport} onSuccess={onSuccess} />
        </div>
      ) : (
        <div className="flex items-center justify-center bg-white p-6 rounded-xl shadow min-h-[300px] text-gray-500 text-sm border border-dashed border-gray-300">
          <NoReportSelected />
        </div>
      )}
    </>
  );
}

export default React.memo(ChatReportView);
