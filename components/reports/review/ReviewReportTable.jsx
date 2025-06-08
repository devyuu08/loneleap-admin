import React from "react";
import { format } from "date-fns";
import { FileWarning } from "lucide-react";
import ReportTableLayout from "@/components/common/reports/ReportTableLayout";

/**
 * ReviewReportTable
 * - 리뷰 신고 목록 테이블 컴포넌트
 * - 각 신고 항목을 테이블 형식으로 렌더링
 * - 클릭 시 상세보기로 이동 (onSelect)
 */

function ReviewReportTable({ reports = [], onSelect }) {
  // 테이블 각 행(row) 구성
  const rows = reports.map((report) => ({
    key: report.id,
    onClick: () => onSelect(report),
    cells: [
      {
        content: report.review?.title || "삭제된 리뷰",
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

  // 테이블 컬럼 정의
  const columns = [
    { header: "리뷰 제목" },
    { header: "신고 사유" },
    { header: "신고자" },
    { header: "신고일자" },
  ];

  return (
    <ReportTableLayout
      icon={<FileWarning className="w-8 h-8 text-gray-300 mb-2" />}
      emptyMessage="신고된 리뷰가 없습니다."
      columns={columns}
      rows={rows}
    />
  );
}

export default React.memo(ReviewReportTable);
