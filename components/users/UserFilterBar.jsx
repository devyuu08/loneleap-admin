import { Download, Filter } from "lucide-react";

export default function UserFilterBar({
  filters,
  onChange,
  onReset,
  onExport,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap justify-between items-center gap-4">
      {/* 왼쪽: 드롭다운 */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 상태 */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm h-10"
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
          className="border border-gray-300 rounded-md px-3 py-2 text-sm h-10"
          value={filters.date}
          onChange={(e) => onChange("date", e.target.value)}
        >
          <option value="all">전체 기간</option>
          <option value="7days">최근 7일</option>
          <option value="30days">최근 30일</option>
        </select>

        {/* 정렬 */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm h-10"
          value={filters.sort}
          onChange={(e) => onChange("sort", e.target.value)}
        >
          <option value="recent">최근 가입순</option>
          <option value="oldest">오래된 가입순</option>
          <option value="review">리뷰 많은 순</option>
          <option value="itinerary">일정 많은 순</option>
        </select>
      </div>

      {/* 오른쪽: 버튼 그룹 */}
      <div className="flex items-center gap-2">
        {/* 필터 초기화 */}
        <button
          onClick={onReset}
          className="flex items-center gap-1 bg-gray-100 border border-gray-300 text-gray-600 rounded-md px-3 py-2 text-sm h-10 hover:bg-gray-200"
        >
          <Filter size={16} className="stroke-gray-500" />
          <span>필터 초기화</span>
        </button>

        {/* 사용자 목록 내보내기 */}
        <button
          onClick={onExport}
          className="flex items-center gap-1 bg-black text-white rounded-md px-4 py-2 text-sm h-10 hover:opacity-80"
        >
          <Download size={16} className="stroke-white" />
          <span>사용자 목록 내보내기</span>
        </button>
      </div>
    </div>
  );
}
