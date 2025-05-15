import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";
import dayjs from "dayjs";
import dynamic from "next/dynamic";

const ReviewReportLineChart = dynamic(
  () => import("@/components/dashboard/ReviewReportLineChart"),
  { ssr: false }
);

const ChatReportLineChart = dynamic(
  () => import("@/components/dashboard/ChatReportLineChart"),
  { ssr: false }
);

const UserStatusDoughnutChart = dynamic(
  () => import("@/components/dashboard/UserStatusDoughnutChart"),
  { ssr: false }
);

export default function AdminDashboard({
  stats,
  recentReports = [],
  chartData,
  error,
}) {
  if (error) {
    return (
      <div className="p-6 text-red-600 text-center font-semibold">
        ⚠️ 관리자 데이터를 불러오는 중 오류가 발생했습니다.
        <br />
        {error}
      </div>
    );
  }

  const reviewReports = stats?.reviewReports ?? 0;
  const chatReports = stats?.chatReports ?? 0;
  const activeUsers = stats?.activeUsers ?? 0;

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
              신고된 리뷰: <strong>{reviewReports}</strong>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              신고된 채팅: <strong>{chatReports}</strong>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              활성 사용자: <strong>{activeUsers.toLocaleString()}명</strong>
            </div>
          </div>

          {/* 차트 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ReviewReportLineChart data={chartData.reviewReports} />
            <ChatReportLineChart data={chartData.chatReports} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <UserStatusDoughnutChart data={chartData.userStatusDist} />
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
  try {
    const { db } = await import("@/lib/firebaseAdmin");
    const { getAuth } = await import("firebase-admin/auth");

    const [reviewSnap, chatSnap, activeUserSnap] = await Promise.all([
      db.collection("review_reports").get(),
      db.collection("chatReports").get(),
      db.collection("users_private").where("status", "==", "active").get(),
    ]);

    // 리뷰 신고 추이 차트용 데이터
    const today = dayjs().endOf("day");
    const sevenDaysAgo = today.subtract(6, "day").startOf("day");

    const recentReviewForChartSnap = await db
      .collection("review_reports")
      .where("reportedAt", ">=", sevenDaysAgo.toDate())
      .get();

    const reviewCountMap = {};

    recentReviewForChartSnap.forEach((doc) => {
      const date = dayjs(doc.data().reportedAt?.toDate()).format("YYYY-MM-DD");
      reviewCountMap[date] = (reviewCountMap[date] || 0) + 1;
    });

    const reviewReportsForChart = Array.from({ length: 7 }).map((_, i) => {
      const date = sevenDaysAgo.add(i, "day").format("YYYY-MM-DD");
      return {
        date,
        count: reviewCountMap[date] || 0,
      };
    });

    // 채팅 신고 추이용 스냅샷
    const recentChatForChartSnap = await db
      .collection("chatReports")
      .where("reportedAt", ">=", sevenDaysAgo.toDate())
      .get();

    const chatCountMap = {};
    recentChatForChartSnap.forEach((doc) => {
      const date = dayjs(doc.data().reportedAt?.toDate()).format("YYYY-MM-DD");
      chatCountMap[date] = (chatCountMap[date] || 0) + 1;
    });

    const chatReportsForChart = Array.from({ length: 7 }).map((_, i) => {
      const date = sevenDaysAgo.add(i, "day").format("YYYY-MM-DD");
      return {
        date,
        count: chatCountMap[date] || 0,
      };
    });

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

    // 사용자 상태 분포 데이터 수집
    const [activeStatusSnap, warnedStatusSnap, inactiveStatusSnap] =
      await Promise.all([
        db.collection("users_private").where("status", "==", "active").get(),
        db.collection("users_private").where("status", "==", "warned").get(),
        db.collection("users_private").where("status", "==", "inactive").get(),
      ]);

    const userStatusData = {
      active: activeStatusSnap.size,
      warned: warnedStatusSnap.size,
      inactive: inactiveStatusSnap.size,
    };

    // 사용자 상태 비율 계산
    const userStatusSnap = await db.collection("users_private").get();
    const userStatusDistMap = {};

    userStatusSnap.forEach((doc) => {
      const status = doc.data().status || "unknown";
      userStatusDistMap[status] = (userStatusDistMap[status] || 0) + 1;
    });

    const userStatusDist = Object.entries(userStatusDistMap).map(
      ([status, count]) => ({
        status,
        count,
      })
    );

    // 6개월치 월별 리뷰/일정 작성 수 수집
    const now = dayjs();
    const sixMonthsAgo = now.subtract(5, "month").startOf("month");

    const reviewSnapForBar = await db
      .collection("reviews")
      .where("createdAt", ">=", sixMonthsAgo.toDate())
      .get();

    const itinerarySnapForBar = await db
      .collection("itineraries")
      .where("createdAt", ">=", sixMonthsAgo.toDate())
      .get();

    const reviewMap = {};
    reviewSnapForBar.forEach((doc) => {
      const date = dayjs(doc.data().createdAt.toDate()).format("YYYY-MM");
      reviewMap[date] = (reviewMap[date] || 0) + 1;
    });

    const itineraryMap = {};
    itinerarySnapForBar.forEach((doc) => {
      const date = dayjs(doc.data().createdAt.toDate()).format("YYYY-MM");
      itineraryMap[date] = (itineraryMap[date] || 0) + 1;
    });

    const labels = Array.from({ length: 6 }).map((_, i) =>
      sixMonthsAgo.add(i, "month").format("YYYY-MM")
    );

    const activityChartData = labels.map((label) => ({
      month: label,
      reviews: reviewMap[label] || 0,
      itineraries: itineraryMap[label] || 0,
    }));

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
          activeUsers: activeUserSnap.size,
        },
        recentReports,
        chartData: {
          reviewReports: reviewReportsForChart,
          chatReports: chatReportsForChart,
          userStatusDist,
          activityByMonth: activityChartData,
        },
        userStatusData,
      },
    };
  } catch (error) {
    console.error("getServerSideProps 에러:", error);
    return {
      props: {
        stats: null,
        recentReports: [],
        error: "서버 에러가 발생했습니다.",
      },
    };
  }
}
