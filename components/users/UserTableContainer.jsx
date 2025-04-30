import { useState, useEffect } from "react";
import { fetchUsers } from "@/lib/users";
import UserFilterBar from "./UserFilterBar";
import UserTable from "./UserTable";

export default function UserTableContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    date: "all",
    sort: "recent",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        console.error("사용자 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({ status: "all", date: "all", sort: "recent" });
  };

  const handleExport = () => {
    alert("목록 내보내기 기능은 아직 구현되지 않았습니다.");
  };

  return (
    <>
      <UserFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        onExport={handleExport}
      />
      {loading ? (
        <p>로딩 중...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">등록된 사용자가 없습니다.</p>
      ) : (
        <UserTable users={users} />
      )}
    </>
  );
}
