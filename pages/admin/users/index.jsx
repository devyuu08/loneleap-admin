import { useEffect, useState } from "react";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import { fetchUsers } from "@/lib/users";
import UserTable from "@/components/\busers/UserTable";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("사용자 조회 실패:", error);
        alert("사용자 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">사용자 관리</h1>

          {loading && <p>로딩 중...</p>}

          {!loading && users.length === 0 && (
            <p className="text-gray-500">등록된 사용자가 없습니다.</p>
          )}

          {!loading && users.length > 0 && <UserTable users={users} />}
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
