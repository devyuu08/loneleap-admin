import React from "react";
import { format } from "date-fns";
import ActionButtons from "@/components/common/button/ActionButtons";
import PropTypes from "prop-types";
import ReportDetailLayout from "@/components/common/reports/ReportDetailLayout";
import {
  infoBoxClass,
  contentBoxClass,
  sectionTitleClass,
  labelClass,
  mutedTextClass,
} from "@/styles/reportStyles";

/**
 * ChatReportDetail
 * - 신고된 채팅 메시지의 상세 정보를 보여주는 컴포넌트
 * - 좌측: 신고 정보 (사유, 신고자, 작성자, 신고일자)
 * - 우측: 채팅 메시지 본문 표시
 * - ActionButtons 포함: 처리 버튼 제공
 */

function ChatReportDetail({ report, onSuccess }) {
  // 유효성 검사: 필수 필드 존재 여부 확인
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
    <ReportDetailLayout
      left={
        <div className={infoBoxClass}>
          <div>
            <div className={labelClass}>신고 사유</div>
            <div>{reason}</div>
          </div>

          <div>
            <div className={labelClass}>신고자</div>
            <div className="truncate">{reporterId || "-"}</div>
          </div>

          <div>
            <div className={labelClass}>채팅 작성자</div>
            <div className="truncate">
              {messageSender?.displayName ||
                messageSender?.uid ||
                "(알 수 없음)"}
            </div>
          </div>

          <div>
            <div className={labelClass}>신고일자</div>
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
      }
      right={
        <div className={contentBoxClass}>
          <h4 className={sectionTitleClass}>채팅 메시지</h4>
          {messageText ? (
            <p className="leading-relaxed break-words">{messageText}</p>
          ) : (
            <p className={mutedTextClass}>삭제된 메시지입니다.</p>
          )}
        </div>
      }
    >
      <ActionButtons
        report={report}
        onSuccess={typeof onSuccess === "function" ? onSuccess : () => {}}
      />
    </ReportDetailLayout>
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

export default React.memo(ChatReportDetail);
