import React from "react";
import { format } from "date-fns";
import { MessageSquareOff } from "lucide-react";
import ReportTableLayout from "@/components/common/reports/ReportTableLayout";

/**
 * ChatReportTable
 * - 신고된 채팅 메시지 목록을 테이블 형태로 표시하는 컴포넌트
 * - ReportTableLayout을 기반으로 렌더링
 * - 클릭 시 상세 정보 열람 가능 (onSelect)
 */

function ChatReportTable({ reports = [], onSelect }) {
  // 테이블 행 구성: 각 신고 건에 대해 셀 배열 생성
  const rows = reports.map((report) => ({
    key: report.id,
    onClick: () => onSelect(report),
    cells: [
      {
        content: report.messageText || "삭제된 메시지",
        className: "max-w-[240px] truncate",
      },
      {
        content: report.reason || "-",
        className: "max-w-[160px] truncate",
      },
      {
        content: report.reporterEmail || "(탈퇴한 사용자)",
      },
      {
        content: report.reportedAt
          ? format(new Date(report.reportedAt), "yyyy.MM.dd")
          : "-",
      },
    ],
  }));

  // 테이블 헤더 정의
  const columns = [
    { header: "메시지 내용" },
    { header: "신고 사유" },
    { header: "신고자" },
    { header: "신고일자" },
  ];

  return (
    <ReportTableLayout
      icon={<MessageSquareOff className="w-8 h-8 text-gray-300 mb-2" />}
      emptyMessage="신고된 채팅 메시지가 없습니다."
      columns={columns}
      rows={rows}
    />
  );
}

export default React.memo(ChatReportTable);
