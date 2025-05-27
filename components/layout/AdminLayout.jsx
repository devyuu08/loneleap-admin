import { useEffect, useState } from "react";
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
  Footprints,
  LogOut,
} from "lucide-react";
import SessionTimer from "@/components/auth/SessionTimer";
import InlineSpinner from "@/components/common/InlineSpinner";

import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 사이드바 상태 유지
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null) {
      setIsSidebarOpen(saved === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-open", isSidebarOpen.toString());
  }, [isSidebarOpen]);

  const isActive = (href) => router.pathname === href;

  const handleLogout = async () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      try {
        setIsLoading(true);

        await signOut(auth); // Firebase 클라이언트 로그아웃
        await fetch("/api/admin/auth/logout", { method: "POST" }); // 서버 쿠키 제거

        router.push("/admin/login");
      } catch (error) {
        console.error("로그아웃 중 오류:", error);
      } finally {
        setIsLoading(false);
      }
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
        className={cn(
          "flex-shrink-0 bg-white border-r shadow-sm flex flex-col transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* 상단 로고 & 토글 */}
        <div className="flex items-center justify-between h-[60px] px-4 border-b">
          <div className="flex items-center gap-2">
            <Footprints size={22} className="text-black" />
            {isSidebarOpen && (
              <span className="text-xl font-bold whitespace-nowrap">
                LoneLeap 관리자
              </span>
            )}
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-black"
            aria-label="사이드바 토글"
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
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors duration-200",
                isActive(href)
                  ? "bg-gray-900 text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon size={20} className="shrink-0" />

              {/* 텍스트 */}
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
          ))}
        </nav>

        {/* 하단 세션 + 로그아웃 */}
        <div className="p-4 border-t flex flex-col gap-4 items-center">
          {/* 세션 타이머: 열림 상태에서만 표시 */}
          {isSidebarOpen && (
            <div className="text-xs text-gray-400 text-center">
              <SessionTimer />
            </div>
          )}

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className={cn(
              "flex items-center justify-center text-sm text-gray-500 hover:text-red-500 border rounded disabled:opacity-50 transition",
              isSidebarOpen ? "w-full px-3 py-2 gap-2" : "w-10 h-10"
            )}
            title="로그아웃"
          >
            <LogOut size={20} />
            {isSidebarOpen && (isLoading ? "로그아웃 중..." : "로그아웃")}
            {isLoading && <InlineSpinner size={18} />}
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
