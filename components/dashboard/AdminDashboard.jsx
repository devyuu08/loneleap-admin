import Link from "next/link";

import ReviewReportLineChart from "@/components/dashboard/ReviewReportLineChart";
import ChatReportLineChart from "@/components/dashboard/ChatReportLineChart";
import UserStatusDoughnutChart from "@/components/dashboard/UserStatusDoughnutChart";
import ContentActivityBarChart from "@/components/dashboard/ContentActivityBarChart";
import EmptyState from "@/components/common/EmptyState";
import { Inbox } from "lucide-react";

export default function AdminDashboard({ stats, chartData, recentReports }) {
  const reviewReports = stats?.reviewReports ?? 0;
  const chatReports = stats?.chatReports ?? 0;
  const activeUsers = stats?.activeUsers ?? 0;

  const cardStatBox = "bg-white p-4 rounded-xl shadow text-center";
  const tableCell = "py-2";

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className={cardStatBox}>
          신고된 리뷰: <strong>{reviewReports}</strong>
        </div>
        <div className={cardStatBox}>
          신고된 채팅: <strong>{chatReports}</strong>
        </div>
        <div className={cardStatBox}>
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
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">최근 신고 내역</h2>
          <Link href="/admin/reports/reviews" className="text-sm text-blue-500">
            전체보기 →
          </Link>
        </div>
        <table className="min-w-[600px] w-full text-sm text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className={tableCell}>유형</th>
              <th className={tableCell}>내용</th>
              <th className={tableCell}>신고자</th>
              <th className={tableCell}>시간</th>
            </tr>
          </thead>
          <tbody>
            {recentReports.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <EmptyState
                    message="최근 신고 내역이 없습니다."
                    icon={<Inbox className="w-6 h-6 text-gray-300 mb-2" />}
                    className="py-10"
                  />
                </td>
              </tr>
            ) : (
              recentReports.map((report) => (
                <tr key={report.id} className="border-b last:border-0">
                  <td className={tableCell}>{report.type}</td>
                  <td className={tableCell}>{report.reason}</td>
                  <td className={`${tableCell} text-gray-600`}>
                    {report.reporter}
                  </td>
                  <td className={`${tableCell} text-gray-500 text-sm`}>
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
