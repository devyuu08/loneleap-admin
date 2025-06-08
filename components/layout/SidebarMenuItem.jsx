import Link from "next/link";
import { cn } from "@/lib/shared/utils";

/**
 * SidebarMenuItem
 * - 사이드바 내 단일 메뉴 항목 렌더링
 * - 사이드바 열림 여부에 따라 라벨 토글
 * - 활성화 여부에 따라 스타일 차별화
 */

export default function SidebarMenuItem({
  href,
  label,
  icon: Icon,
  isActive,
  isSidebarOpen,
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 rounded-md transition-colors duration-200",
        isActive
          ? "bg-gray-900 text-white font-semibold"
          : "text-gray-700 hover:bg-gray-100"
      )}
      title={label} // 사이드바 닫힌 상태에서도 접근성 확보
    >
      {/* 아이콘 */}
      <Icon size={20} className="shrink-0" />

      {/* 라벨 (사이드바 열림 여부에 따라 보여짐) */}
      <div
        className={cn(
          "ml-2 origin-left transition-all duration-200",
          isSidebarOpen
            ? "scale-x-100 opacity-100 visible"
            : "scale-x-0 opacity-0 invisible"
        )}
      >
        <span className="inline-block whitespace-nowrap">{label}</span>
      </div>
    </Link>
  );
}
