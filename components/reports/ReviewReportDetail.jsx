// loneleap-admin/components/reports/ReviewReportDetail.jsx

import { format } from "date-fns";
import ActionButtons from "../reports/ActionButtons";
import DetailSection from "./DetailSection";

export default function ReviewReportDetail({ report, onSuccess }) {
  if (!report) {
    return (
      <div
        className="p-6 text-sm text-gray-400 text-center"
        role="alert"
        aria-live="polite"
      >
        왼쪽 목록에서 신고된 리뷰를 선택하세요.
      </div>
    );
  }

  // report가 있지만 유효하지 않은 경우
  const isValidReport =
    typeof report === "object" && typeof report.reason === "string";

  if (!isValidReport) {
    return (
      <div className="p-6 text-sm text-red-400 text-center" role="alert">
        유효하지 않은 신고 데이터입니다.
      </div>
    );
  }

  const { review, reason, reporterId, reportedAt } = report;

  return (
    <div className="p-6 space-y-6">
      <DetailSection title="리뷰 원문">
        {review?.content || "삭제된 리뷰입니다."}
      </DetailSection>

      <DetailSection title="신고 사유">{reason}</DetailSection>

      <DetailSection title="신고자">{reporterId || "-"}</DetailSection>

      <DetailSection title="신고일자">
        {reportedAt
          ? format(new Date(reportedAt), "yyyy.MM.dd HH:mm")
          : "날짜 없음"}
      </DetailSection>

      <div className="pt-4 border-t">
        <ActionButtons report={report} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
