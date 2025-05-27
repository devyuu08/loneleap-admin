import { format } from "date-fns";
import ActionButtons from "@/components/common/ActionButtons";
import PropTypes from "prop-types";

export default function ChatReportDetail({ report, onSuccess }) {
  const isValidReport =
    typeof report === "object" &&
    report !== null &&
    typeof report.reason === "string" &&
    (report.messageText === undefined ||
      typeof report.messageText === "string") &&
    (report.reporterId === undefined ||
      typeof report.reporterId === "string") &&
    (report.reportedAt === undefined || typeof report.reportedAt === "string");

  if (!isValidReport) {
    return (
      <div className="p-6 text-sm text-red-400 text-center" role="alert">
        유효하지 않은 신고 데이터입니다.
      </div>
    );
  }

  const { messageText, reason, reporterId, reportedAt, messageSender } = report;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽: 신고 정보 */}
        <div className="bg-gray-50 p-4 rounded-xl border space-y-4 text-sm text-gray-800">
          <div>
            <div className="text-gray-500 font-medium mb-1">신고 사유</div>
            <div>{reason}</div>
          </div>

          <div>
            <div className="text-gray-500 font-medium mb-1">신고자</div>
            <div>{reporterId || "-"}</div>
          </div>

          <div>
            <div className="text-gray-500 font-medium mb-1">채팅 작성자</div>
            <div>
              {messageSender?.displayName ||
                messageSender?.uid ||
                "(알 수 없음)"}
            </div>
          </div>

          <div>
            <div className="text-gray-500 font-medium mb-1">신고일자</div>
            <div>
              {reportedAt
                ? (() => {
                    const date = new Date(reportedAt);
                    return !isNaN(date.getTime())
                      ? format(date, "yyyy.MM.dd HH:mm")
                      : "유효하지 않은 날짜";
                  })()
                : "-"}
            </div>
          </div>
        </div>

        {/* 오른쪽: 채팅 메시지 내용 */}
        <div className="bg-white p-4 rounded-xl border text-sm text-gray-800">
          <h4 className="text-base font-semibold text-gray-700 mb-3">
            채팅 메시지
          </h4>
          {messageText ? (
            <p className="leading-relaxed">{messageText}</p>
          ) : (
            <p className="text-gray-400 italic">삭제된 메시지입니다.</p>
          )}
        </div>
      </div>

      {/* 버튼 */}
      <div className="pt-6 mt-6 border-t">
        <ActionButtons
          report={report}
          onSuccess={typeof onSuccess === "function" ? onSuccess : () => {}}
        />
      </div>
    </div>
  );
}

ChatReportDetail.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.string,
    messageText: PropTypes.string,
    reason: PropTypes.string.isRequired,
    reporterId: PropTypes.string,
    reportedAt: PropTypes.string,
    status: PropTypes.string,
    messageSender: PropTypes.shape({
      displayName: PropTypes.string,
      uid: PropTypes.string,
    }),
  }),
  onSuccess: PropTypes.func,
};
