import React from "react";

/**
 * StatusBadge
 * - 사용자 상태(active, banned, dormant)에 따라 뱃지 스타일 및 라벨을 출력
 * - 시각적으로 상태를 구분하여 관리자 UI의 가독성을 높임
 */

function StatusBadge({ status }) {
  const variant = {
    active: "bg-green-100 text-green-800",
    banned: "bg-yellow-100 text-yellow-800",
    dormant: "bg-gray-100 text-gray-600",
  };

  const label = {
    active: "활성",
    banned: "정지",
    dormant: "휴면",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${variant[status]}`}>
      {label[status]}
    </span>
  );
}

export default React.memo(StatusBadge);
