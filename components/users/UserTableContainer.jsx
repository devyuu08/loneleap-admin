import { useState, useEffect } from "react";
import { fetchUsers } from "@/lib/users";
import UserFilterBar from "./UserFilterBar";
import UserTable from "./UserTable";
import UserSearchInput from "./UserSearchInput";

export default function UserTableContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    date: "all",
    sort: "recent",
  });
  const [search, setSearch] = useState("");

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

  const filteredUsers = users.filter((user) =>
    `${user.displayName ?? ""} ${user.email ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      {/* 헤더 + 검색창 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">사용자 관리</h1>
        <div className="w-full max-w-xs">
          <UserSearchInput value={search} onChange={setSearch} />
        </div>
      </div>

      {/* 필터 영역: 흰색 박스 안 */}
      <UserFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        onExport={handleExport}
      />

      {/* 사용자 테이블 */}
      {loading ? (
        <p>로딩 중...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        <UserTable users={filteredUsers} />
      )}
    </>
  );
}
