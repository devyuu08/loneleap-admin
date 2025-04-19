import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import InlineSpinner from "@/components/common/InlineSpinner";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isActive = (path) => router.pathname === path;

  const handleLogout = async () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      try {
        setIsLoading(true);
        await signOut(auth);
        router.push("/admin/login");
      } catch (error) {
        console.error("로그아웃 중 오류:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r shadow-sm flex flex-col justify-between">
        {/* 상단 로고 */}
        <div>
          <div className="flex items-center h-[60px] px-6 border-b">
            <span className="text-xl font-bold">LoneLeap 관리자</span>
          </div>

          {/* 메뉴 목록 */}
          <nav className="flex flex-col gap-2 px-4 py-4 text-sm text-gray-700">
            {[
              { href: "/admin", label: "대시보드", icon: "🏠" },
              {
                href: "/admin/reports/reviews",
                label: "리뷰 신고",
                icon: "📝",
              },
              { href: "/admin/reports/chats", label: "채팅 신고", icon: "💬" },
              { href: "/admin/users", label: "사용자 관리", icon: "👤" },
              { href: "/admin/spots", label: "추천 여행지 관리", icon: "📍" },
            ].map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  isActive(href)
                    ? "bg-gray-900 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {icon} <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* 로그아웃 */}
        <div className="p-6 border-t">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full text-sm text-gray-500 hover:text-red-500 border px-3 py-2 rounded disabled:opacity-50"
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
        {/* 본문 */}
        <main className="flex-1 px-8 py-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
