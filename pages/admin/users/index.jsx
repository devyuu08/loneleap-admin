import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import UserTableContainer from "@/components/users/UserTableContainer";

export default function AdminUsersPage() {
  return (
    <AdminProtectedRoute>
      <div className="p-6">
        <UserTableContainer />
      </div>
    </AdminProtectedRoute>
  );
}
