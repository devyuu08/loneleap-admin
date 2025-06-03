import React from "react";
import { Search } from "lucide-react";

function UserSearchInput({ value, onChange }) {
  return (
    <div className="relative w-full sm:w-auto">
      {/* 아이콘 */}
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />

      {/* 입력창 */}
      <input
        type="text"
        placeholder="닉네임 또는 이메일 검색"
        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default React.memo(UserSearchInput);
