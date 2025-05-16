import UserActionButtons from "@/components/users/UserActionButtons";

export default function UserTable({ users, onReload }) {
  const formatCreatedAt = (createdAt) => {
    if (!createdAt) return "N/A";
    const date =
      typeof createdAt === "string"
        ? new Date(createdAt)
        : createdAt.toDate?.() ?? null;

    return date
      ? date.toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";
  };
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-4 py-3 text-left">사용자 정보</th>
            <th className="px-4 py-3 text-center">가입일</th>
            <th className="px-4 py-3 text-center">작성 일정</th>
            <th className="px-4 py-3 text-center">리뷰 수</th>
            <th className="px-4 py-3 text-center">신고 이력</th>
            <th className="px-4 py-3 text-center">상태</th>
            <th className="px-4 py-3 text-center">액션</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  {/* 
                  next/image 대신 <img>를 사용하는 이유:
                  1. next/image는 onError 핸들링이 불가능하여 fallback 이미지 처리 불가
                  2. 외부 이미지(Firebase Storage)에서 잘못된 URL이나 만료된 링크가 있을 수 있음
                  3. <img> + onError를 사용하면 이미지 로드 실패 시 기본 이미지로 확실하게 대체 가능
                  */}
                  <img
                    src={user.photoURL || "/images/default-profile.png"}
                    alt="사용자 프로필"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover bg-gray-100 shrink-0"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = "true";
                        img.src = "/images/default-profile.png";
                      }
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {user.displayName || "탈퇴한 사용자"}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>

              {/* 가입일 */}
              <td className="px-4 py-4 text-center text-gray-500">
                {formatCreatedAt(user.createdAt)}
              </td>

              {/* 작성 일정 수 */}
              <td className="px-4 py-4 text-center text-gray-800">
                {user.itineraryCount ?? 0}
              </td>

              {/* 리뷰 수 */}
              <td className="px-4 py-4 text-center text-gray-800">
                {user.reviewCount ?? 0}
              </td>

              {/* 신고 이력 */}
              <td className="px-4 py-4 text-center">
                <span className="text-sm text-red-500 font-semibold">
                  {user.reportedCount ?? 0}회
                </span>
              </td>

              {/* 상태 */}
              <td className="px-4 py-4 text-center">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : user.status === "warned"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.status === "active"
                    ? "활성"
                    : user.status === "warned"
                    ? "경고"
                    : "휴면"}
                </span>
              </td>

              {/* 액션 버튼 */}
              <td className="px-4 py-4 text-center space-x-2">
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
    </div>
  );
}
