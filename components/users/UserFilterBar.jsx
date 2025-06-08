import React from "react";
import { Download, Filter } from "lucide-react";
import FormSelect from "@/components/common/form/FormSelect";

function UserFilterBar({ filters, onChange, onReset, onExport }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap justify-between items-center gap-4">
      {/* 왼쪽: 드롭다운 */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 상태 */}
        <FormSelect
          id="status"
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
          options={[
            { value: "all", label: "전체 사용자" },
            { value: "active", label: "활성" },
            { value: "banned", label: "정지" },
            { value: "dormant", label: "휴면" },
          ]}
        />

        {/* 가입일 */}
        <FormSelect
          id="date"
          value={filters.date}
          onChange={(e) => onChange("date", e.target.value)}
          options={[
            { value: "all", label: "전체 기간" },
            { value: "7days", label: "최근 7일" },
            { value: "30days", label: "최근 30일" },
          ]}
        />

        {/* 정렬 */}
        <FormSelect
          id="sort"
          value={filters.sort}
          onChange={(e) => onChange("sort", e.target.value)}
          options={[
            { value: "recent", label: "최근 가입순" },
            { value: "oldest", label: "오래된 가입순" },
            { value: "review", label: "리뷰 많은 순" },
            { value: "itinerary", label: "일정 많은 순" },
          ]}
        />
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

export default React.memo(UserFilterBar);
