import React from "react";
import { format } from "date-fns";
import { FileWarning } from "lucide-react";
import ReportTableLayout from "@/components/common/ReportTableLayout";

function ReviewReportTable({ reports = [], onSelect }) {
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
