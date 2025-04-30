import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import UserTableContainer from "@/components/users/UserTableContainer";

export default function AdminUsersPage() {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">사용자 관리</h1>
          <UserTableContainer />
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
