import { getAdminDashboardData } from "@/lib/server/dashboard/getAdminDashboardData";
import AdminDashboardContainer from "@/components/dashboard/AdminDashboardContainer";

/**
 * AdminDashboardPage
 * - 관리자 대시보드 페이지 (SSR)
 * - 통계 카드, 차트, 신고 목록 등을 렌더링
 */

export const getServerSideProps = getAdminDashboardData;

function AdminDashboardPage(props) {
  return <AdminDashboardContainer {...props} />;
}

AdminDashboardPage.title = "LoneLeap Admin | 대시보드";

export default AdminDashboardPage;
