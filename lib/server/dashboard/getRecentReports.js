/**
 * 최근 5개의 리뷰 및 채팅 신고 데이터를 가져와 시간순으로 정렬하여 반환합니다.
 * 신고자는 reporterId로만 반환됩니다 (이메일 매핑은 getReporterEmailMap에서 수행).
 *
 * @param {FirebaseFirestore.Firestore} db - Firebase Admin SDK의 Firestore 인스턴스
 * @returns {Promise<Array<{
 *   id: string,
 *   type: "리뷰" | "채팅",
 *   reason: string,
 *   reporterId: string,
 *   reportedAt: string | null
 * }>>}
 */

export async function getRecentReports(db) {
  const [reviewDocs, chatDocs] = await Promise.all([
    db
      .collection("review_reports")
      .orderBy("reportedAt", "desc")
      .limit(5)
      .get(),
    db.collection("chatReports").orderBy("reportedAt", "desc").limit(5).get(),
  ]);

  const reporterIds = new Set();
  reviewDocs.forEach((doc) => reporterIds.add(doc.data().reporterId));
  chatDocs.forEach((doc) => reporterIds.add(doc.data().reporterId));

  const reports = [
    ...reviewDocs.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: "리뷰",
        reason: data.reason,
        reporterId: data.reporterId,
        reportedAt: data.reportedAt?.toDate().toISOString() || null,
      };
    }),
    ...chatDocs.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: "채팅",
        reason: data.reason,
        reporterId: data.reporterId,
        reportedAt: data.reportedAt?.toDate().toISOString() || null,
      };
    }),
  ];

  return reports
    .sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))
    .slice(0, 5);
}
