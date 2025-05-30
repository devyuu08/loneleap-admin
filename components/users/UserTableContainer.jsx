import { useState, useEffect, useCallback } from "react";
import { fetchUsers } from "@/lib/server/users";
import UserFilterBar from "@/components/users/UserFilterBar";
import UserSearchInput from "@/components/users/UserSearchInput";
import UserTable from "@/components/users/UserTable";
import { exportToCSV } from "@/utils/exportToCSV";
import Pagination from "@/components/common/Pagination";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { Inbox } from "lucide-react";

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

  const usersPerPage = 5;

  const loadUsers = useCallback(
    async (overrideFilters = filters) => {
      try {
        const data = await fetchUsers(overrideFilters);
        setUsers(data);
      } catch (error) {
        console.error("사용자 로딩 실패:", error);
      }
    },
    [filters]
  );

  useEffect(() => {
    setLoading(true);
    loadUsers().finally(() => setLoading(false));
  }, [filters.status, filters.date, filters.sort, loadUsers]);

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
      <div className="flex flex-col justify-between min-h-[70vh]">
        <div className="flex-1">
          {loading ? (
            <LoadingSpinner text="사용자 목록을 불러오는 중입니다..." />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              message={
                isInitialEmpty
                  ? "등록된 사용자가 아직 없습니다."
                  : "조건에 맞는 사용자가 없습니다."
              }
              icon={<Inbox className="w-10 h-10 text-gray-300 mb-3" />}
            />
          ) : (
            <UserTable users={currentUsers} onReload={loadUsers} />
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
