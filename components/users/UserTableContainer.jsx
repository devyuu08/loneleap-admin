import { useState, useEffect } from "react";
import { fetchUsers } from "@/lib/server/users";
import UserFilterBar from "@/components/users/UserFilterBar";
import UserSearchInput from "@/components/users/UserSearchInput";
import UserTable from "@/components/users/UserTable";
import { exportToCSV } from "@/utils/exportToCSV";

export default function UserTableContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    date: "all",
    sort: "recent",
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 10;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUsers(filters);
        setUsers(data);
      } catch (err) {
        console.error("사용자 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("사용자 로딩 실패:", error);
    }
  };

  // 필터 상태 변경
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({ status: "all", date: "all", sort: "recent" });
  };

  const handleExport = () => {
    if (!filteredUsers || filteredUsers.length === 0) return;

    const exportData = filteredUsers.map((user) => ({
      UID: user.id,
      이름: user.displayName || "",
      이메일: user.email || "",
      상태: user.status || "",
      가입일:
        user.createdAt && user.createdAt.toDate
          ? user.createdAt.toDate().toLocaleDateString("ko-KR")
          : user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("ko-KR")
          : "",
      리뷰수: user.reviewCount ?? 0,
      일정수: user.itineraryCount ?? 0,
    }));

    exportToCSV("loneleap_users", exportData);
  };

  // 필터링 + 검색
  const filteredUsers = users.filter((user) =>
    `${user.displayName ?? ""} ${user.email ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 현재 페이지 데이터
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // 필터/검색 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, search]);

  // 페이지 버튼 리스트
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      {/* 상단: 제목 + 검색 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">사용자 관리</h1>
        <div className="w-full max-w-xs">
          <UserSearchInput value={search} onChange={setSearch} />
        </div>
      </div>

      {/* 필터 바 */}
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
        <>
          <UserTable users={currentUsers} onReload={loadUsers} />

          {/* 페이지네이션 */}
          <div className="flex justify-center gap-2 mt-6">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md text-sm border ${
                  page === currentPage
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
