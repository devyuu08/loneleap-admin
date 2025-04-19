// loneleap-admin/components/reports/ChatReportDetail.jsx

import { format } from "date-fns";
import ActionButtons from "../reports/ActionButtons";
import DetailSection from "./DetailSection";
import PropTypes from "prop-types";

export default function ChatReportDetail({ report, onSuccess }) {
  if (!report) {
    return (
      <div
        className="p-6 text-sm text-gray-400 text-center"
        role="alert"
        aria-live="polite"
      >
        왼쪽 목록에서 신고된 채팅 메시지를 선택하세요.
      </div>
    );
  }

  // report가 있지만 유효하지 않은 경우
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

  const { messageText, reason, reporterId, reportedAt } = report;

  return (
    <div className="p-6 space-y-6">
      <DetailSection title="채팅 메시지">
        {messageText || "삭제된 메시지입니다."}
      </DetailSection>

      <DetailSection title="신고 사유">{reason}</DetailSection>

      <DetailSection title="신고자">{reporterId || "-"}</DetailSection>

      <DetailSection title="신고일자">
        {reportedAt
          ? (() => {
              const date = new Date(reportedAt);
              return !isNaN(date.getTime())
                ? format(date, "yyyy.MM.dd HH:mm")
                : "유효하지 않은 날짜";
            })()
          : "날짜 없음"}
      </DetailSection>

      <div className="pt-4 border-t">
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
  }),
  onSuccess: PropTypes.func,
};
