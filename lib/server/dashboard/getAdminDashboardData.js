import { getStats } from "@/lib/server/dashboard/getStats";
import { getChartData } from "@/lib/server/dashboard/getChartData";
import { getRecentReports } from "@/lib/server/dashboard/getRecentReports";
import { getReporterEmailMap } from "@/lib/server/dashboard/getReporterEmailMap";

export async function getAdminDashboardData() {
  try {
    const { db } = await import("@/lib/firebase/admin");

    // 병렬 처리
    const [stats, chartData, recentReportsRaw] = await Promise.all([
      getStats(db),
      getChartData(db),
      getRecentReports(db),
    ]);

    const reporterIds = new Set(
      recentReportsRaw
        .map((r) => r.reporterId)
        .filter((id) => typeof id === "string" && id.trim() !== "")
    );
    const reporterEmailMap = await getReporterEmailMap(db, reporterIds);

    // reporterEmailMap 적용
    const recentReports = recentReportsRaw.map((report) => ({
      ...report,
      reporter: reporterEmailMap[report.reporterId] || "알 수 없음",
    }));

    return {
      props: {
        stats,
        chartData,
        recentReports,
      },
    };
  } catch (err) {
    console.error("getAdminDashboardData 에러:", err);
    return {
      props: {
        stats: null,
        chartData: null,
        recentReports: [],
        error: "서버 에러가 발생했습니다.",
      },
    };
  }
}
