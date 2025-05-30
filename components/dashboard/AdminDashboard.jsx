import Link from "next/link";

import ReviewReportLineChart from "@/components/dashboard/ReviewReportLineChart";
import ChatReportLineChart from "@/components/dashboard/ChatReportLineChart";
import UserStatusDoughnutChart from "@/components/dashboard/UserStatusDoughnutChart";
import ContentActivityBarChart from "@/components/dashboard/ContentActivityBarChart";

export default function AdminDashboard({ stats, chartData, recentReports }) {
  const reviewReports = stats?.reviewReports ?? 0;
  const chatReports = stats?.chatReports ?? 0;
  const activeUsers = stats?.activeUsers ?? 0;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">안녕하세요, 관리자님</h1>
      <p className="text-gray-500 mb-6">
        {new Date().toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })}
      </p>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          신고된 리뷰: <strong>{reviewReports}</strong>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          신고된 채팅: <strong>{chatReports}</strong>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          활성 사용자: <strong>{activeUsers.toLocaleString()}명</strong>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ReviewReportLineChart data={chartData.reviewReports} />
        <ChatReportLineChart data={chartData.chatReports} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <UserStatusDoughnutChart data={chartData.userStatusDist} />
        <ContentActivityBarChart data={chartData.activityByMonth} />
      </div>

      {/* 최근 신고 내역 */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">최근 신고 내역</h2>
          <Link href="/admin/reports/reviews" className="text-sm text-blue-500">
            전체보기 →
          </Link>
        </div>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2">유형</th>
              <th className="py-2">내용</th>
              <th className="py-2">신고자</th>
              <th className="py-2">시간</th>
            </tr>
          </thead>
          <tbody>
            {recentReports.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  신고 내역이 없습니다.
                </td>
              </tr>
            ) : (
              recentReports.map((report) => (
                <tr key={report.id} className="border-b last:border-0">
                  <td className="py-2">{report.type}</td>
                  <td className="py-2">{report.reason}</td>
                  <td className="py-2 text-gray-600">{report.reporter}</td>
                  <td className="py-2 text-gray-500 text-sm">
                    {report.reportedAt
                      ? new Date(report.reportedAt).toLocaleString("ko-KR", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
