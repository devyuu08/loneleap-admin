import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchUsers } from "@/lib/server/users";
import UserFilterBar from "@/components/users/UserFilterBar";
import UserSearchInput from "@/components/users/UserSearchInput";
import UserTable from "@/components/users/UserTable";
import { exportToCSV } from "@/utils/exportToCSV";
import Pagination from "@/components/common/navigation/Pagination";
import LoadingSpinner from "@/components/common/loading/LoadingSpinner";
import EmptyState from "@/components/common/feedback/EmptyState";
import { Inbox } from "lucide-react";
import toast from "react-hot-toast";

/**
 * UserTableContainer
 * - 관리자 페이지 사용자 관리의 컨테이너 컴포넌트
 * - 사용자 목록 조회, 필터링, 검색, CSV 내보내기, 페이징 처리 포함
 * - 상태는 local state로 관리하며 비동기 fetchUsers 기반으로 데이터 로딩
 */

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
  const isInitialEmpty = users.length === 0;

  // 사용자 데이터 fetch 함수
  const loadUsers = useCallback(async (customFilters) => {
    try {
      const data = await fetchUsers(customFilters);
      setUsers(data);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("사용자 로딩 실패:", error);
      }
      toast.error("사용자 목록을 불러오는 데 실패했습니다.");
    }
  }, []);

  // 필터 변경 시 사용자 데이터 로드
  useEffect(() => {
    setLoading(true);
    loadUsers(filters).finally(() => setLoading(false));
  }, [filters, loadUsers]);

  // 필터 상태 변경
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // 필터 초기화
  const handleFilterReset = useCallback(() => {
    setFilters({ status: "all", date: "all", sort: "recent" });
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.displayName ?? ""} ${user.email ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  // CSV 내보내기 처리
  const handleExport = useCallback(() => {
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
  }, [filteredUsers]);

  // 현재 페이지의 사용자 데이터 추출
  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, usersPerPage]);

  // 필터 또는 검색 변경 시 페이지 초기화
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
