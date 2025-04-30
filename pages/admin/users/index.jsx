import { useEffect, useState } from "react";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import { fetchUsers } from "@/lib/users";

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

  const formatCreatedAt = (createdAt) => {
    if (!createdAt) return "N/A";
    if (typeof createdAt === "string") {
      return new Date(createdAt).toLocaleString();
    }
    if (createdAt.toDate) {
      return createdAt.toDate().toLocaleString();
    }
    return "N/A";
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">사용자 관리</h1>

          {loading && <p>로딩 중...</p>}

          {!loading && users.length === 0 && (
            <p className="text-gray-500">등록된 사용자가 없습니다.</p>
          )}

          {!loading && users.length > 0 && (
            <table className="min-w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">이메일</th>
                  <th className="p-2 border">UID</th>
                  <th className="p-2 border">가입일</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-2 border">{user.email}</td>
                    <td className="p-2 border text-xs">{user.id}</td>
                    <td className="p-2 border">
                      {formatCreatedAt(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
