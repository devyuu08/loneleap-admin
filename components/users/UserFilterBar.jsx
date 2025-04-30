export default function UserFilterBar({
  filters,
  onChange,
  onReset,
  onExport,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* 드롭다운 그룹 */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 상태 */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
        >
          <option value="all">전체 사용자</option>
          <option value="active">활성</option>
          <option value="dormant">휴면</option>
          <option value="warned">경고</option>
        </select>

        {/* 가입일 */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={filters.date}
          onChange={(e) => onChange("date", e.target.value)}
        >
          <option value="all">전체 기간</option>
          <option value="7days">최근 7일</option>
          <option value="30days">최근 30일</option>
        </select>

        {/* 정렬 */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={filters.sort}
          onChange={(e) => onChange("sort", e.target.value)}
        >
          <option value="recent">최근 가입순</option>
          <option value="oldest">오래된 가입순</option>
          <option value="review">리뷰 많은 순</option>
        </select>

        {/* 초기화 버튼 */}
        <button
          onClick={onReset}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          필터 초기화
        </button>
      </div>

      {/* 내보내기 버튼 */}
      <button
        onClick={onExport}
        className="bg-black text-white rounded-md px-4 py-2 text-sm flex items-center gap-2 hover:opacity-90"
      >
        사용자 목록 내보내기
      </button>
    </div>
  );
}
