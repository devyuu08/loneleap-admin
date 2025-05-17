import { format } from "date-fns";
import PropTypes from "prop-types";

export default function ChatReportTable({ reports = [], onSelect = () => {} }) {
  const isEmpty = !Array.isArray(reports) || reports.length === 0;

  return (
    <div className="w-full">
      {isEmpty ? (
        <div className="p-4 text-center text-gray-500">
          신고된 채팅 메시지가 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 text-left whitespace-nowrap">
                  메시지 내용
                </th>
                <th className="px-4 py-2 text-left whitespace-nowrap">
                  신고 사유
                </th>
                <th className="px-4 py-2 text-left whitespace-nowrap">
                  신고자
                </th>
                <th className="px-4 py-2 text-left whitespace-nowrap">
                  신고일자
                </th>
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
                      e.preventDefault();
                      onSelect(report);
                    }
                  }}
                >
                  <td className="px-4 py-2 whitespace-nowrap max-w-[240px] truncate">
                    {report.messageText || "삭제된 메시지"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap max-w-[160px] truncate">
                    {report.reason}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.reporterEmail || "(탈퇴한 사용자)"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.reportedAt
                      ? (() => {
                          const date = new Date(report.reportedAt);
                          return !isNaN(date.getTime())
                            ? format(date, "yyyy.MM.dd")
                            : "유효하지 않은 날짜";
                        })()
                      : "날짜 없음"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

ChatReportTable.propTypes = {
  reports: PropTypes.array,
  onSelect: PropTypes.func.isRequired,
};
