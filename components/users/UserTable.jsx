export default function UserTable({ users }) {
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
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {user.displayName || "이름 없음"}
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
              <td className="px-4 py-4 text-center text-gray-800">7</td>

              {/* 리뷰 수 */}
              <td className="px-4 py-4 text-center text-gray-800">11</td>

              {/* 신고 이력 */}
              <td className="px-4 py-4 text-center">
                <span className="text-sm text-red-500 font-semibold">2회</span>
              </td>

              {/* 상태 */}
              <td className="px-4 py-4 text-center">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  활성
                </span>
              </td>

              {/* 액션 버튼 */}
              <td className="px-4 py-4 text-center space-x-2">
                <button className="text-gray-400 hover:text-blue-500">✎</button>
                <button className="text-gray-400 hover:text-yellow-500">
                  ⚠︎
                </button>
                <button className="text-gray-400 hover:text-red-500">☓</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
