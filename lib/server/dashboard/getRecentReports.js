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
