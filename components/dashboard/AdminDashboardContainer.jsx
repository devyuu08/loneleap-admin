import AdminDashboard from "@/components/dashboard/AdminDashboard";
import EmptyState from "@/components/common/feedback/EmptyState";
import { AlertTriangle } from "lucide-react";

/**
 * AdminDashboardContainer
 * - 관리자 대시보드의 SSR 데이터를 받아 UI 컴포넌트에 전달
 * - 에러 발생 시 EmptyState 렌더링
 */

export default function AdminDashboardContainer({
  stats,
  chartData,
  recentReports,
  error,
}) {
  // 데이터 로딩 에러 시
  if (error) {
    return (
      <EmptyState
        icon={<AlertTriangle className="w-8 h-8 text-red-400 mb-2" />}
        message={
          <>
            관리자 데이터를 불러오는 중 오류가 발생했습니다.
            <br />
            {error}
          </>
        }
        className="min-h-[60vh]"
      />
    );
  }

  return (
    <AdminDashboard
      stats={stats}
      chartData={chartData}
      recentReports={recentReports}
    />
  );
}
