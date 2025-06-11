import { getStats } from "@/lib/server/dashboard/getStats";
import { getChartData } from "@/lib/server/dashboard/getChartData";
import { getRecentReports } from "@/lib/server/dashboard/getRecentReports";
import { getReporterEmailMap } from "@/lib/server/dashboard/getReporterEmailMap";

/**
 * 관리자 대시보드에서 사용할 통계, 차트 데이터, 최근 신고 내역을 병렬로 가져옵니다.
 * Firestore에서 데이터를 읽고 reporterId를 이메일로 매핑한 결과를 포함합니다.
 *
 * @returns {Promise<{ props: { stats: object|null, chartData: object|null, recentReports: Array, error?: string } }>}
 */

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
    if (process.env.NODE_ENV === "development") {
      console.error("getAdminDashboardData 에러:", err);
    }
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
