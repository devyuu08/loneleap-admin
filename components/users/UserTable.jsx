import React from "react";
import UserActionButtons from "@/components/users/UserActionButtons";
import { formatDateKR } from "@/lib/shared/date";
import StatusBadge from "@/components/users/StatusBadge";
import SkeletonImage from "@/components/common/loading/SkeletonImage";

/**
 * UserTable
 * - 관리자 페이지에서 사용자 목록을 테이블 형태로 렌더링
 * - 사용자 프로필, 가입일, 작성 일정/리뷰 수, 신고 이력, 상태, 액션 버튼 포함
 * - SkeletonImage를 사용해 fallback 이미지 처리 및 안정적인 렌더링 제공
 * - 상태 뱃지(StatusBadge)와 액션 버튼(UserActionButtons) 포함
 */

function UserTable({ users, onReload }) {
  const headerBase = "px-4 py-3";
  const headerLeft = `${headerBase} text-left`;
  const headerCenter = `${headerBase} text-center`;

  const cellBase = "px-4 py-4";
  const cellCenter = `${cellBase} text-center`;

  return (
    <section className="bg-white rounded-xl shadow-sm overflow-x-auto">
      <table className="min-w-[800px] w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className={headerLeft}>사용자 정보</th>
            <th className={headerCenter}>가입일</th>
            <th className={headerCenter}>작성 일정</th>
            <th className={headerCenter}>리뷰 수</th>
            <th className={headerCenter}>신고 이력</th>
            <th className={headerCenter}>상태</th>
            <th className={headerCenter}>액션</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition">
              <td className={cellBase}>
                <div className="flex items-center gap-3">
                  {/* 
                  next/image 대신 <img>를 사용하는 이유:
                  1. next/image는 onError 핸들링이 불가능하여 fallback 이미지 처리 불가
                  2. 외부 이미지(Firebase Storage)에서 잘못된 URL이나 만료된 링크가 있을 수 있음
                  3. <img> + onError를 사용하면 이미지 로드 실패 시 기본 이미지로 확실하게 대체 가능
                  */}
                  <SkeletonImage
                    src={user.photoURL || "/images/default-profile.png"}
                    alt="사용자 프로필"
                    size="w-8 h-8"
                    className="rounded-full object-cover bg-gray-100 shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {user.displayName || "탈퇴한 사용자"}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[160px]">
                      {user.email}
                    </p>
                  </div>
                </div>
              </td>

              {/* 가입일 */}
              <td className={`${cellCenter} text-gray-500`}>
                {formatDateKR(user.createdAt)}
              </td>

              {/* 작성 일정 수 */}
              <td className={`${cellCenter} text-gray-800`}>
                {user.itineraryCount ?? 0}
              </td>

              {/* 리뷰 수 */}
              <td className={`${cellCenter} text-gray-800`}>
                {user.reviewCount ?? 0}
              </td>

              {/* 신고 이력 */}
              <td className={cellCenter}>
                <span className="text-sm text-red-500 font-semibold">
                  {user.reportedCount ?? 0}회
                </span>
              </td>

              {/* 상태 */}
              <td className={cellCenter}>
                <StatusBadge status={user.status} />
              </td>

              {/* 액션 버튼 */}
              <td className={`${cellCenter} space-x-2 whitespace-nowrap`}>
                <UserActionButtons
                  userId={user.id}
                  currentStatus={user.status}
                  onSuccess={onReload}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default React.memo(UserTable);
