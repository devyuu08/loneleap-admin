import Link from "next/link";

import ReviewReportLineChart from "@/components/dashboard/ReviewReportLineChart";
import ChatReportLineChart from "@/components/dashboard/ChatReportLineChart";
import UserStatusDoughnutChart from "@/components/dashboard/UserStatusDoughnutChart";
import ContentActivityBarChart from "@/components/dashboard/ContentActivityBarChart";
import EmptyState from "@/components/common/feedback/EmptyState";
import { Inbox } from "lucide-react";

/**
 * AdminDashboard
 * - 관리자 전용 대시보드 화면
 * - 신고 통계, 사용자 활동 차트, 최근 신고 내역 테이블 등 제공
 */

export default function AdminDashboard({ stats, chartData, recentReports }) {
  // 서버로부터 받아온 기본 통계값
  const reviewReports = stats?.reviewReports ?? 0;
  const chatReports = stats?.chatReports ?? 0;
  const activeUsers = stats?.activeUsers ?? 0;

  // 공통 스타일 상수
  const cardStatBox = "bg-white p-4 rounded-xl shadow text-center";
  const tableCell = "py-2";

  return (
    <main className="p-6 max-w-screen-xl mx-auto">
      {/* 관리자 인사 + 날짜 */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">안녕하세요, 관리자님</h1>
        <p className="text-gray-500">
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </p>
      </header>

      {/* 통계 카드 영역 */}
      <section aria-labelledby="admin-stats" className="mb-6">
        <h2 id="admin-stats" className="sr-only">
          관리자 통계 카드
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </section>

      {/* 차트 시각화 영역 */}
      <section aria-labelledby="admin-charts" className="mb-6">
        <h2 id="admin-charts" className="sr-only">
          신고 및 사용자 차트
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReviewReportLineChart data={chartData.reviewReports} />
          <ChatReportLineChart data={chartData.chatReports} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <UserStatusDoughnutChart data={chartData.userStatusDist} />
          <ContentActivityBarChart data={chartData.activityByMonth} />
        </div>
      </section>

      {/* 최근 신고 테이블 */}
      <section
        aria-labelledby="recent-reports"
        className="bg-white p-6 rounded-xl shadow overflow-x-auto"
      >
        <div className="flex justify-between mb-4">
          <h2 id="recent-reports" className="text-lg font-semibold">
            최근 신고 내역
          </h2>
          <Link href="/admin/reports/reviews" className="text-sm text-blue-500">
            전체보기 →
          </Link>
        </div>

        <table className="min-w-[600px] w-full text-sm text-left">
          <caption className="sr-only">최근 접수된 신고 리스트</caption>
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
      </section>
    </main>
  );
}
