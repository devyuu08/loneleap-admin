import React, { useMemo } from "react";
import ActionButtons from "@/components/common/button/ActionButtons";
import ReportDetailLayout from "@/components/common/reports/ReportDetailLayout";
import {
  infoBoxClass,
  contentBoxClass,
  sectionTitleClass,
  labelClass,
  mutedTextClass,
} from "@/styles/reportStyles";

/**
 * ReviewReportDetail
 * - 관리자 리뷰 신고 상세 뷰 컴포넌트
 * - 신고 정보 및 연결된 리뷰 데이터를 표시
 * - 삭제된 리뷰인 경우 예외 처리
 */

function ReviewReportDetail({ report, onSuccess }) {
  const isValidReport =
    typeof report === "object" && typeof report.reason === "string";

  const { review, reason, reporterId } = report;

  // 인터뷰 Q&A 리스트 생성 (Object.entries)
  const interviewList = useMemo(() => {
    if (!review?.interviewAnswers) return null;
    return Object.entries(review.interviewAnswers);
  }, [review]);

  // 유효하지 않은 신고 데이터 처리
  if (!isValidReport) {
    return (
      <div className="p-6 text-sm text-red-400 text-center" role="alert">
        유효하지 않은 신고 데이터입니다.
      </div>
    );
  }

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
            <div className={labelClass}>리뷰 작성자</div>
            <div>
              {review?.createdBy?.displayName || review?.createdBy?.uid || "-"}
            </div>
          </div>
        </div>
      }
      right={
        <div className={contentBoxClass}>
          <h4 className={sectionTitleClass}>리뷰 원문</h4>
          {interviewList ? (
            <ul className="space-y-2 max-h-[300px] overflow-auto pr-2">
              {interviewList.map(([key, value]) => (
                <li key={key}>
                  <strong className="text-gray-600">Q{key}.</strong>{" "}
                  <span className="text-gray-800">{value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={mutedTextClass}>삭제된 리뷰입니다.</p>
          )}
        </div>
      }
    >
      <ActionButtons report={report} onSuccess={onSuccess} />
    </ReportDetailLayout>
  );
}

export default React.memo(ReviewReportDetail);
