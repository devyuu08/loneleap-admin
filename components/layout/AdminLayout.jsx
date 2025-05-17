// 관리자 레이아웃 - 사이드바 토글 기능 + lucide 아이콘 적용
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  FileText,
  MessagesSquare,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SessionTimer from "@/components/auth/SessionTimer";
import InlineSpinner from "@/components/common/InlineSpinner";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isActive = (href) => router.pathname === href;

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // 로그아웃 처리 로직 추가
    } finally {
      setIsLoading(false);
    }
  };

  const sidebarItems = [
    { href: "/admin", label: "대시보드", icon: LayoutDashboard },
    { href: "/admin/reports/reviews", label: "리뷰 신고", icon: FileText },
    { href: "/admin/reports/chats", label: "채팅 신고", icon: MessagesSquare },
    { href: "/admin/users", label: "사용자 관리", icon: Users },
    { href: "/admin/recommendation", label: "추천 여행지", icon: MapPin },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 bg-white border-r shadow-sm flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* 상단 로고 & 토글 */}
        <div className="flex items-center justify-between h-[60px] px-4 border-b">
          <span className="text-xl font-bold whitespace-nowrap">
            {isSidebarOpen ? "LoneLeap 관리자" : "LL"}
          </span>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-black"
          >
            {isSidebarOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>

        {/* 메뉴 */}
        <nav className="flex-1 flex flex-col gap-2 px-3 py-4 text-sm text-gray-700">
          {sidebarItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                isActive(href)
                  ? "bg-gray-900 text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />
              {isSidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* 하단 세션 + 로그아웃 */}
        <div className="p-4 border-t flex flex-col gap-4">
          <div className="text-xs text-gray-400 text-center">
            <SessionTimer />
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-500 border px-3 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? (
              <>
                로그아웃 중...
                <InlineSpinner size="sm" />
              </>
            ) : (
              "로그아웃"
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-8 py-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
