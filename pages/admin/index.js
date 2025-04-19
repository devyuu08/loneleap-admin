import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";
import { getAuth } from "firebase-admin/auth";

export default function AdminDashboard({ stats, recentReports }) {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">안녕하세요, 관리자님</h1>
          <p className="text-gray-500 mb-6">
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </p>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow">
              신고된 리뷰: <strong>{stats.reviewReports}</strong>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              신고된 채팅: <strong>{stats.chatReports}</strong>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              활성 사용자:{" "}
              <strong>{stats.activeUsers.toLocaleString()}명</strong>
            </div>
          </div>

          {/* 차트 박스 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-6 h-60 rounded-xl shadow flex items-center justify-center text-gray-400">
              <p>라인 차트 영역 (구현 예정)</p>
            </div>
            <div className="bg-white p-6 h-60 rounded-xl shadow flex items-center justify-center text-gray-400">
              <p>바 차트 영역 (구현 예정)</p>
            </div>
          </div>
          {/* 최근 신고 내역 */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">최근 신고 내역</h2>
              <Link
                href="/admin/reports/reviews"
                className="text-sm text-blue-500"
              >
                전체보기 →
              </Link>
            </div>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2">유형</th>
                  <th className="py-2">내용</th>
                  <th className="py-2">신고자</th>
                  <th className="py-2">상태</th>
                  <th className="py-2">시간</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      신고 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  recentReports.map((report) => (
                    <tr key={report.id} className="border-b last:border-0">
                      <td className="py-2">{report.type}</td>
                      <td className="py-2">{report.reason}</td>
                      <td className="py-2 text-gray-600">{report.reporter}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            report.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="py-2 text-gray-500 text-sm">
                        {report.reportedAt
                          ? new Date(report.reportedAt).toLocaleString(
                              "ko-KR",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}

// 서버 사이드에서만 실행되는 코드 (admin SDK는 여기서만!)
export async function getServerSideProps() {
  const { db } = await import("@/lib/firebaseAdmin");

  const [reviewSnap, chatSnap, userSnap] = await Promise.all([
    db.collection("review_reports").get(),
    db.collection("chatReports").get(),
    db.collection("users").get(),
  ]);

  // 최근 신고 5개씩 가져오기
  const recentReviewDocs = await db
    .collection("review_reports")
    .orderBy("reportedAt", "desc")
    .limit(5)
    .get();

  const recentChatDocs = await db
    .collection("chatReports")
    .orderBy("reportedAt", "desc")
    .limit(5)
    .get();

  // 신고자 ID 모으기
  const reporterIds = new Set();
  recentReviewDocs.forEach((doc) => reporterIds.add(doc.data().reporterId));
  recentChatDocs.forEach((doc) => reporterIds.add(doc.data().reporterId));

  // reporterId → 이메일 매핑
  const reporterEmailMap = {};
  const userFetches = Array.from(reporterIds).map(async (uid) => {
    const userDoc = await db.collection("users").doc(uid).get();
    if (userDoc.exists) {
      reporterEmailMap[uid] = userDoc.data().email || "알 수 없음";
    } else {
      // Firestore에 없을 경우 Auth에서 이메일 가져오기
      try {
        const userRecord = await getAuth().getUser(uid);
        reporterEmailMap[uid] = userRecord.email || "알 수 없음";
      } catch (err) {
        reporterEmailMap[uid] = "탈퇴한 사용자";
      }
    }
  });
  await Promise.all(userFetches);

  // 통합 신고 리스트 정리
  const recentReports = [
    ...recentReviewDocs.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: "리뷰",
        reason: data.reason,
        status: data.status || "pending",
        reporter: reporterEmailMap[data.reporterId] || "알 수 없음",
        reportedAt: data.reportedAt?.toDate().toISOString() || null,
      };
    }),
    ...recentChatDocs.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: "채팅",
        reason: data.reason,
        status: "pending",
        reporter: reporterEmailMap[data.reporterId] || "알 수 없음",
        reportedAt: data.reportedAt?.toDate().toISOString() || null,
      };
    }),
  ]
    .sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))
    .slice(0, 5); // 최대 5개로 제한

  return {
    props: {
      stats: {
        reviewReports: reviewSnap.size,
        chatReports: chatSnap.size,
        activeUsers: userSnap.size,
      },
      recentReports,
    },
  };
}
