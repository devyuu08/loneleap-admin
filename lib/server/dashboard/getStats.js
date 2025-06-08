/**
 * 전체 리뷰 신고 수, 채팅 신고 수, 활성 사용자 수를 count 쿼리로 가져옵니다.
 *
 * @param {FirebaseFirestore.Firestore} db - Firestore 인스턴스
 * @returns {Promise<{ reviewReports: number, chatReports: number, activeUsers: number }>}
 */

export async function getStats(db) {
  const [reviewCountSnap, chatCountSnap, activeUserCountSnap] =
    await Promise.all([
      db.collection("review_reports").count().get(),
      db.collection("chatReports").count().get(),
      db
        .collection("users_private")
        .where("status", "==", "active")
        .count()
        .get(),
    ]);

  return {
    reviewReports: reviewCountSnap.data().count,
    chatReports: chatCountSnap.data().count,
    activeUsers: activeUserCountSnap.data().count,
  };
}
