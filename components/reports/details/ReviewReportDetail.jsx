import ActionButtons from "@/components/reports/ui/ActionButtons";

export default function ReviewReportDetail({ report, onSuccess }) {
  const isValidReport =
    typeof report === "object" && typeof report.reason === "string";

  if (!isValidReport) {
    return (
      <div className="p-6 text-sm text-red-400 text-center" role="alert">
        유효하지 않은 신고 데이터입니다.
      </div>
    );
  }

  const { review, reason, reporterId } = report;

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
            <div className="text-gray-500 font-medium mb-1">리뷰 작성자</div>
            <div>
              {review?.createdBy?.displayName || review?.createdBy?.uid || "-"}
            </div>
          </div>
        </div>

        {/* 오른쪽: 리뷰 원문 */}
        <div className="bg-white p-4 rounded-xl border text-sm text-gray-800">
          <h4 className="text-base font-semibold text-gray-700 mb-3">
            리뷰 원문
          </h4>
          {review?.interviewAnswers ? (
            <ul className="space-y-2">
              {Object.entries(review.interviewAnswers).map(([key, value]) => (
                <li key={key}>
                  <strong className="text-gray-600">Q{key}.</strong>{" "}
                  <span className="text-gray-800">{value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">삭제된 리뷰입니다.</p>
          )}
        </div>
      </div>

      <div className="pt-6 mt-6 border-t">
        <ActionButtons report={report} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
