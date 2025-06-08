import { useEffect, useState } from "react";
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
import ButtonSpinner from "@/components/common/loading/ButtonSpinner";
import SidebarMenuItem from "@/components/layout/SidebarMenuItem";

import { cn } from "@/lib/shared/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

/**
 * AdminLayout
 * - 관리자 페이지 전체 레이아웃 구성
 * - 사이드바 열림 상태 로컬 스토리지 저장
 * - 로그아웃 및 세션 타이머 포함
 */

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 사이드바 상태 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null) {
      setIsSidebarOpen(saved === "true");
    }
  }, []);

  // 사이드바 상태 저장
  useEffect(() => {
    localStorage.setItem("sidebar-open", isSidebarOpen.toString());
  }, [isSidebarOpen]);

  const isActive = (href) => router.pathname === href;

  const handleLogout = async () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      try {
        setIsLoading(true);

        await signOut(auth); // Firebase 로그아웃
        await fetch("/api/admin/auth/logout", { method: "POST" }); // 서버 쿠키 삭제

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
        aria-label="관리자 메뉴"
      >
        {/* 로고 + 토글 버튼 */}
        <header className="flex items-center justify-between h-[60px] px-4 border-b">
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
            aria-label="사이드바 열기/닫기"
          >
            {isSidebarOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </header>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 flex flex-col gap-2 px-3 py-4 text-sm text-gray-700">
          {sidebarItems.map(({ href, label, icon }) => (
            <SidebarMenuItem
              key={href}
              href={href}
              label={label}
              icon={icon}
              isActive={isActive(href)}
              isSidebarOpen={isSidebarOpen}
            />
          ))}
        </nav>

        {/* 로그아웃 및 세션 타이머 */}
        <footer className="p-4 border-t flex flex-col gap-4 items-center">
          {isSidebarOpen && (
            <div className="text-xs text-gray-400 text-center">
              <SessionTimer />
            </div>
          )}
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
            {isSidebarOpen && (isLoading ? <ButtonSpinner /> : "로그아웃")}
          </button>
        </footer>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-8 py-8 overflow-y-auto" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
