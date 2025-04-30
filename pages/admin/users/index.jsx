import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import UserTableContainer from "@/components/users/UserTableContainer";

export default function AdminUsersPage() {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="p-6">
          <UserTableContainer />
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
