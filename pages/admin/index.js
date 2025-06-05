import { getAdminDashboardData } from "@/lib/server/dashboard/getAdminDashboardData";
import AdminDashboardContainer from "@/components/dashboard/AdminDashboardContainer";

export const getServerSideProps = getAdminDashboardData;

function AdminDashboardPage(props) {
  return <AdminDashboardContainer {...props} />;
}

AdminDashboardPage.title = "LoneLeap Admin | 대시보드";

export default AdminDashboardPage;
