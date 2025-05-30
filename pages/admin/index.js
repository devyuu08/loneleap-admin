import { getAdminDashboardData } from "@/lib/server/dashboard/getAdminDashboardData";
import AdminDashboardContainer from "@/components/dashboard/AdminDashboardContainer";

export const getServerSideProps = getAdminDashboardData;

export default AdminDashboardContainer;
