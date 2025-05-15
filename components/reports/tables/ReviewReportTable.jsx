import { format } from "date-fns";
import ReportStatusBadge from "@/components/reports/ui/ReportStatusBadge";

const STATUS_LABELS = {
  pending: "미처리",
  completed: "처리완료",
};

export default function ReviewReportTable({ reports = [], onSelect }) {
  const isEmpty = !Array.isArray(reports) || reports.length === 0;

  return (
    <div className="w-full overflow-x-auto">
      {isEmpty ? (
        <div className="p-4 text-center text-gray-500">
          신고된 리뷰가 없습니다.
        </div>
      ) : (
        <table className="min-w-[800px] table-auto text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 text-left whitespace-nowrap">
                리뷰 제목
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                신고 사유
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">작성자</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                신고일자
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">상태</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(report)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelect(report);
                  }
                }}
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="max-w-[240px] truncate">
                    {report.review?.interviewAnswers
                      ? Object.entries(report.review.interviewAnswers).map(
                          ([key, value]) => (
                            <p key={key}>
                              <strong>Q{key}.</strong> {value}
                            </p>
                          )
                        )
                      : "삭제된 리뷰"}
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="max-w-[160px] truncate">{report.reason}</div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {report.reporterEmail || "(탈퇴한 사용자)"}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {report.reportedAt
                    ? format(new Date(report.reportedAt), "yyyy.MM.dd")
                    : "날짜 없음"}
                </td>
                <td className="px-4 py-2">
                  <ReportStatusBadge
                    status={STATUS_LABELS[report.status] || "미처리"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
