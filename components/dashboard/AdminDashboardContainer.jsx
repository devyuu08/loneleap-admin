import AdminDashboard from "@/components/dashboard/AdminDashboard";
import EmptyState from "@/components/common/EmptyState";

export default function AdminDashboardContainer({
  stats,
  chartData,
  recentReports,
  error,
}) {
  if (error) {
    return (
      <EmptyState
        message={`⚠️ 관리자 데이터를 불러오는 중 오류가 발생했습니다.\n${error}`}
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
